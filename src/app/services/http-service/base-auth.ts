import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { User, UserFields } from 'src/app/types/user-type';
import { Admin, AdminUserFields } from 'src/app/types/admin-type';
import { AuthTokens } from 'src/app/types/auth-token-type';

@Injectable()
export abstract class BaseAuth {

  protected user: BehaviorSubject<Admin | User | boolean> = new BehaviorSubject(false);
  protected guard: string[] = ['user', 'admin'];
  protected tokens: AuthTokens | boolean;
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
    if (tokens && Object.keys(tokens).length) {
      this.tokens = tokens;
      this.updateTokens(tokens);
      this.setAuth(tokens);
    }
  }

  abstract setAuth(tokens): void;

  authCheck(): boolean {
    return (!this.isExpiredToken());
  }

  check(): boolean {
    return (!this.isExpiredToken());
  }

  protected getTokens(multiTokens?: string): AuthTokens {

    multiTokens = multiTokens ? multiTokens : this.jwt.tokenGetter('tokens');
    if (!multiTokens) return {};
    let parsed = JSON.parse(multiTokens);

    return this.validateTokens(parsed);
  }

  protected validateTokens(tokens: AuthTokens) {
    return Object.keys(tokens).reduce((tottal, current: string) => {
      if (this.guard.indexOf(current) >= 0 && tokens[current] && this.isValidToken(tokens[current]['token'])) {
        tottal[current] = tokens[current];
      }
      return tottal;
    }, {});
  }

  protected isValidToken(token: string) {
    return !this.jwt.isTokenExpired(token);
  }

  protected isExpiredToken() {
    let multiTokens = this.jwt.tokenGetter('tokens');
    if (multiTokens && Object.keys(this.getTokens(multiTokens)).length) return false;
    return true;
  }

  private updateTokens(tokens: AuthTokens): void {
    localStorage.setItem('tokens', JSON.stringify(tokens));
    if (tokens.admin) {
      localStorage.setItem('token', tokens.admin.token);
      this.activeted = 'admin';
    } else {
      this.activeted = 'user';
    }
  }

  setActivated(tokens: AuthTokens | boolean, user?: User | Admin | boolean): void {
    let users: User | Admin| boolean = this.user.getValue(),
        keys = Object.keys(users);

    
    console.log("tokens:: ", tokens, " ::users:: ", users);
    if (users && keys.length == 2) {

      keys.forEach((current, idx) => {
        this.tokens[current]['activeted'] = current == "admin" ? true : false;
        current == "admin" ? users[current]['activeted'] = true : users && users[current] ? users[current]['activeted'] = false : '';
      });

    } else if(users){
      let nameType = keys[0];
      (user && user[nameType]) ? user[nameType].activeted = true : users && users[nameType] ? users[nameType].activeted = true : '';
      tokens[nameType]['activeted'] = true;
    }else{
      this.activeted = null;
    }
    console.warn("::users:: ", users, " ::user:: ", user, " ::tokens:: ", tokens);
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

  protected buildToken(token: string, typeName: string): AuthTokens {

    return {
      [typeName]: {
        [typeName + '_key']: true,
        token: token,
        activeted: false
      }
    };
  }

  protected setToken(adminProps: AuthTokens, typeName): void {

    if (window.localStorage.getItem('tokens')) {

      this.tokens ? this.tokens[typeName] = adminProps[typeName] : this.tokens = adminProps;
      window.localStorage.setItem('tokens', JSON.stringify(this.tokens));
    } else {
      window.localStorage.setItem('tokens', JSON.stringify(adminProps));
      this.tokens = adminProps;
    }
  }

  protected removeToken(typeName: string): AuthTokens | boolean {
    let tokens = this.tokens && Object.keys(this.tokens).length > 1? this.tokens: JSON.parse(this.jwt.tokenGetter('tokens')),
    leftToken = (<AuthTokens | boolean>this.removeItemFromObject(tokens, typeName));
    (leftToken)? window.localStorage.setItem('tokens', JSON.stringify(leftToken)): '';
    return leftToken;
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