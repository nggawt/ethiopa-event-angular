import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { User, Users, UserFields } from 'src/app/types/user-type';
import { Admin, AdminUser } from 'src/app/types/admin-type';
import { AuthTokens } from 'src/app/types/auth-token-type';

@Injectable()
export abstract class BaseAuth {

  protected user: BehaviorSubject<Users | Admin | User | boolean> = new BehaviorSubject(false);
  protected guard: string[] = ['user', 'admin'];
  protected tokens: AuthTokens | boolean;
  public activeted: string;

  constructor(public jwt: JwtHelperService, public http: HttpService) {

    this.initAuth();
    console.warn("RUNS BASE AUTH:> ", this.tokens);
  }

  initAuth() {
    let tokens = this.getTokens();
    if (tokens) {
      this.tokens = <AuthTokens>tokens;
      this.setAuth(this.tokens);

    } else {
      this.destroyActivation();
    }
  }

  abstract addPropsToUser(user: Admin | User): Admin | User;
  abstract emit(user: Users | Admin | User | boolean): void;
  abstract setAuthUser(user: AdminUser | UserFields | boolean)

  protected getTokens(multiTokens?: string): AuthTokens | boolean {

    multiTokens = multiTokens ? multiTokens : this.jwt.tokenGetter('tokens');
    if (!multiTokens) return false;
    let parsed = JSON.parse(multiTokens);

    return this.validateTokens(parsed);
  }

  setAuth(tokens: AuthTokens): void {

    this.getAuthenticated(tokens, (users) => {
      if (users) {

        Object.keys(users).forEach((userName: string, idx: number) => {
          if (users[userName]) this.addPropsToUser(users[userName]);
        });

        if (users.user?.user) users.user = users.user.user;
        this.setActivated(users).emit(users);

      } else {
        this.destroyActivation();
      }
    });
  }

  protected validateTokens(tokens: AuthTokens | boolean): AuthTokens | boolean {
    let authenticated = Object.keys(tokens).reduce((tottal, current: string) => {
      if (this.guard.indexOf(current) >= 0 && tokens[current] && this.isValidToken(tokens[current]['token'])) {
        tottal[current] = tokens[current];
      }
      return tottal;
    }, {});
    return Object.keys(authenticated).length ? authenticated : false;
  }

  protected isValidToken(token: string) {
    return !this.jwt.isTokenExpired(token);
  }

  protected isExpiredToken() {
    let multiTokens = this.jwt.tokenGetter('tokens');
    if (multiTokens && Object.keys(this.getTokens(multiTokens)).length) return false;
    return true;
  }

  protected setToken(adminProps: AuthTokens, typeName) {

    if (this.tokens) {

      this.tokens[typeName] = adminProps[typeName];
      // this.saveToken(this.tokens);
    } else {
      // this.saveToken(adminProps);
      this.tokens = adminProps;
    }
    return this;
  }

  protected setActivated(users: Users | User | Admin) {

    let currrentUsers = this.user.getValue(), 
      hasActive = false,
      tokens = this.tokens;

    (currrentUsers && Object.keys(currrentUsers).length)? currrentUsers[Object.keys(users)[0]] = users[Object.keys(users)[0]]: currrentUsers = users;
    let userskeys  = Object.keys(currrentUsers);

    console.log("tokens:: ", tokens, " ::users:: ", currrentUsers);
    if (currrentUsers && userskeys.length == 2) {
      userskeys.forEach((current, idx) => {

        if (tokens[current]['activeted']) {
          this.active(currrentUsers, current);
          hasActive = true;
        }
      });
      if (!hasActive) this.active(users, 'admin');

    } else if (currrentUsers) {
      let nameType = userskeys[0];
      this.active(currrentUsers, nameType);
    } else if(tokens){
      this.active(users, Object.keys(tokens)[0]);
    }else{
      this.destroyActivation();
    }
    // this.saveToken(tokens);
    console.warn("::users:: ", currrentUsers, " ::tokens:: ", tokens);
    return this;
  }

  active(users: Users | User | Admin | boolean, type: string) {

    users[type]['activeted'] = true;
    this.tokens[type]['activeted'] = true;
    this.http.token = this.tokens[type]['token'];
    this.activeted = type;
    this.setAuthUser(users[type]);
    this.saveToken(this.tokens);
  }

  deActive(users: Users | User | Admin | boolean, type: string) {
    users[type]['activeted'] = false;
    this.tokens[type]['activeted'] = false;
    // this.activeted = null;
    // this.http.token = '';
    // this.setAuthUser(false);
    // this.saveToken(this.tokens);
  }

  destroyActivation() {
    this.tokens = false;
    this.http.token = '';
    this.setAuthUser(false);
    this.emit(false);
    window.localStorage.clear();
  }

  activate(userType: string, users?: Users | User | Admin | boolean, tokens?: AuthTokens | boolean) {

    users = users ? users : this.user.getValue();
    tokens = tokens ? tokens : this.tokens;

    Object.keys(users).forEach((current, idx) => {

      (current == userType) ? this.active(users, current) : this.deActive(users, current);
    });

    // users
    this.emit(users);

    // activated
    // this.activeted = userType;

    // tokens + token storage
    // this.tokens = tokens;
    // this.saveToken(this.tokens);
  }

  protected async getAuthenticated(tokens: AuthTokens, cabk) {

    let loggedUser = {};
    if (tokens.admin) {

      loggedUser['admin'] = await this.http.authenticated({ ['admin']: tokens.admin }, (err) => {
        let error = err();
        console.log(error);

      });
    }

    if (tokens.user) {

      loggedUser['user'] = await this.http.authenticated({ ['user']: tokens.user }, (err) => {
        let error = err();
        console.log(error);
      });
    }

    (loggedUser && loggedUser['admin'] && Object.keys(loggedUser['admin']).length ||
      loggedUser['user'] && Object.keys(loggedUser['user']).length ? cabk(loggedUser) : cabk(false));
  }

  protected removeToken(typeName: string): AuthTokens | null {
    return (<AuthTokens | null>this.removeItemFromObject(this.tokens, typeName));
  }

  protected removeUser(typeName): User | Admin | boolean {
    let users: Users | User | Admin | boolean = this.user.getValue(),
      leftUser = Object.keys(users) ? (<User | Admin | boolean>this.removeItemFromObject(users, typeName)) : false;

    return leftUser;
  }

  protected removeItemFromObject(object: Users | User | Admin | AuthTokens | boolean, delimiter: string): User | Admin | AuthTokens | boolean {

    let ob = Object.keys(object).reduce((tottal, current) => {
      (current != delimiter) ? tottal[current] = object[current] : '';
      return tottal;
    }, {});

    return Object.keys(ob).length ? ob : false;
  }

  isAdmin(user: Users): boolean {
    return user && user['authority'] || user['user'] && user['user']['autority'] ? true : false;
  }

  private saveToken(tokens: AuthTokens | boolean) {
    localStorage.setItem('tokens', JSON.stringify(tokens))
  }

  protected buildToken(token: string, typeName: string): AuthTokens {

    return {
      [typeName]: {
        [typeName + '_key']: true,
        token: token,
        activeted: false
      }
    };
  }
}

/* getTokens fn
    return this.guard.map((name, idx) => {
          let item;
          if(parsed[name] && ! this.jwt.isTokenExpired(parsed[name]['token'])){
            item? item[name] = parsed[name]: item = {[name]: parsed[name]};
            return item;
          }
          return false;
        }).filter(item => typeof item == "object");
    */
/* updateTokens fn
    let validTokens = tokens.reduce((tottal, curr) => {
      tottal[Object.keys(curr)[0]] = curr[Object.keys(curr)[0]];
      return tottal;
    }, {});
*/