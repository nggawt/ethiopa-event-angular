import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { User, UserFields } from 'src/app/types/user-type';
import { Admin, AdminUser } from 'src/app/types/admin-type';
import { AuthTokens } from 'src/app/types/auth-token-type';

@Injectable()
export abstract class BaseAuth {

  protected user: BehaviorSubject<Admin | User | boolean> = new BehaviorSubject(false);
  protected guard: string[] = ['user', 'admin'];
  protected tokens: AuthTokens | null;
  public activeted: string;

  private USER_TYPE: { [user: string]: boolean } = { USER: false, ADMIN: false };


  constructor(public jwt: JwtHelperService, public http: HttpService) {
    // JSON.parse(localStorage.getItem('tokens'))
    // let check = this.authCheck();
    this.initAuth();
    console.warn("RUNS BASE AUTH:> ", this.tokens);

  }

  initAuth() {
    let tokens = this.getTokens();
    if (tokens) {
      this.tokens = tokens;
      // this.updateTokens(tokens);
      this.setAuth(tokens);
    }else{
      localStorage.clear();
    }
  }

  // abstract setAuth(tokens): void;
  abstract addPropsToUser(user: User | Admin):User | Admin;
  abstract emit(user): void;

  abstract setAuthUser(user: AdminUser)

  protected getTokens(multiTokens?: string): AuthTokens | null{

    multiTokens = multiTokens ? multiTokens : this.jwt.tokenGetter('tokens');
    if (!multiTokens) return {};
    let parsed = JSON.parse(multiTokens);

    return this.validateTokens(parsed);
  }

/*   private updateTokens(tokens: AuthTokens): void {
    localStorage.setItem('tokens', JSON.stringify(tokens));
    if (tokens.admin) {
      localStorage.setItem('token', tokens.admin.token);
      this.activeted = 'admin';
    } else {
      this.activeted = 'user';
    }
  } */

  setAuth(tokens: AuthTokens): void {

    this.getAuthenticated(tokens, (users) => {
      //console.log(users);
      if (users) {
        Object.keys(users).forEach((userName: string, idx: number) => {
          if (users[userName]) this.addPropsToUser(users[userName]);
        });

        if (users.user?.user) users.user = users.user.user;
        this.setActivated(users);
        this.emit(users);
      } else {
        window.localStorage.clear();
      }
    });
  }

  protected validateTokens(tokens: AuthTokens): AuthTokens | null {
    let authenticated = Object.keys(tokens).reduce((tottal, current: string) => {
      if (this.guard.indexOf(current) >= 0 && tokens[current] && this.isValidToken(tokens[current]['token'])) {
        tottal[current] = tokens[current];
      }
      return tottal;
    }, {});
    return Object.keys(authenticated).length? authenticated: null;
  }

  protected isValidToken(token: string) {
    return !this.jwt.isTokenExpired(token);
  }

  protected isExpiredToken() {
    let multiTokens = this.jwt.tokenGetter('tokens');
    if (multiTokens && Object.keys(this.getTokens(multiTokens)).length) return false;
    return true;
  }

  protected setToken(adminProps: AuthTokens, typeName): void {

    if (this.tokens) {

      this.tokens[typeName] = adminProps[typeName];
      this.saveToken(this.tokens);
    } else {
      this.saveToken(adminProps);
      this.tokens = adminProps;
    }
  }

  check(): boolean {
    return (!this.isExpiredToken());
  }

  protected setActivated(users?: User | Admin | boolean): void { // tokens: AuthTokens | boolean, user?: User | Admin | boolean
    
    users = users? users: this.user.getValue();
    let tokens = this.tokens,
    keys = users? Object.keys(users): [];
    
    // this.activate()

    console.log("tokens:: ", tokens, " ::users:: ", users);
    if (users && keys.length == 2) {
      let hasActive = false;
      keys.forEach((current, idx) => { 

        if(tokens[current]['activeted']){
          users[current]['activeted'] = true;
          hasActive = true;
          this.setAuthUser(users[current]);
        }
      });

      if(! hasActive){
        this.setAuthUser(users['admin']);
        users['admin']['activeted'] = true
      }
    } else if(users){
      let nameType = keys[0];
      users[nameType].activeted = true
      tokens[nameType]['activeted'] = true;
      this.setAuthUser(users[nameType]);
    }else{
      this.activeted = null;
    }
    console.warn("::users:: ", users, " ::tokens:: ", tokens);
  }

  activate(userType: string, users?: Admin | User | boolean, tokens?: AuthTokens){

    users = users? users: this.user.getValue();
    tokens = tokens? tokens: this.tokens;

    Object.keys(users).forEach((current, idx) => { 

      if(current == userType){
        tokens[current]['activeted'] = true;
        users[current]['activeted'] = true;
        this.setAuthUser(users[current]);
      }else{
        tokens[current]['activeted'] = false;
        users[current]['activeted'] = false;
      }
    });
    // activated
    this.activeted = userType;

    // users
    this.emit(users);

    // tokens + token storage
    this.tokens = tokens;
    this.saveToken(this.tokens);
  }

  protected async getAuthenticated(tokens: AuthTokens, cabk) {

    let loggedUser = {};
    if (tokens.admin) loggedUser['admin'] = await this.http.authenticated({ ['admin']: tokens.admin }, (err) => {
      let error = err();
      console.log(error);
            
    });
    if (tokens.user) loggedUser['user'] = await this.http.authenticated({ ['user']: tokens.user }, (err) => {
      let error = err();
      console.log(error);
    });

    (loggedUser['admin'] && Object.keys(loggedUser['admin']).length || 
    loggedUser['user'] && Object.keys(loggedUser['user']).length? cabk(loggedUser): cabk(false));
  }

  protected removeToken(typeName: string): AuthTokens | null {
    return (<AuthTokens | null>this.removeItemFromObject(this.tokens, typeName)); 
  }

  protected removeUser(typeName): Admin | User | boolean {
    let users: User | Admin | boolean = this.user.getValue(),
        leftUser = Object.keys(users)? (<Admin | User | boolean>this.removeItemFromObject(users, typeName)): false;

    return leftUser;
  }

  protected removeItemFromObject(object: Admin | User | AuthTokens | boolean, delimiter: string): Admin | User | AuthTokens | boolean {

    let ob = Object.keys(object).reduce((tottal, current) => {
      (current != delimiter)? tottal[current]= object[current]: '';
      return tottal;
    }, {});
    
    return Object.keys(ob).length? ob: false;
  }

  isAdmin(user: User | Admin): boolean {
    return user && user['authority'] || user['user'] && user['user']['autority'] ? true : false;
  }

  private saveToken(tokens: AuthTokens){
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