import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/types/user-type';
import { Admin } from 'src/app/types/admin-type';
import { AuthToken } from 'src/app/types/auth-token-type';

@Injectable()
export abstract class BaseAuth {

  protected user: BehaviorSubject<{ [key: string]: Admin | User | boolean } | boolean> = new BehaviorSubject(false);
  protected guard: string[] = ['user', 'admin'];
  private tokens: AuthToken;
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

  protected getTokens(multiTokens?: string): AuthToken {

    multiTokens = multiTokens ? multiTokens : this.jwt.tokenGetter('tokens');
    if (!multiTokens) return {};
    let parsed = JSON.parse(multiTokens);

    return Object.keys(parsed).reduce((tottal, current: string) => {
      if (this.guard.indexOf(current) >= 0 && parsed[current] && !this.jwt.isTokenExpired(parsed[current]['token'])) {
        tottal[current] = parsed[current];
      }
      return tottal;
    }, {});
  }

  protected isExpiredToken() {
    let multiTokens = this.jwt.tokenGetter('tokens');
    if (multiTokens && Object.keys(this.getTokens(multiTokens)).length) return false;
    return true;
  }

  private updateTokens(tokens: AuthToken): void {
    localStorage.setItem('tokens', JSON.stringify(tokens));
    if (tokens.admin) {
      localStorage.setItem('token', tokens.admin.token);
      this.activeted = 'admin';
    }else{
      this.activeted = 'user';
    }
  }

  setToken(adminProps: {[key: string]: {[key: string]: string | boolean}}, typeName) {
    if (window.localStorage.getItem('tokens')) {
      let auth = this.tokens;
      this.tokens ? this.tokens[typeName] = adminProps[typeName] : this.tokens = adminProps;

      window.localStorage.setItem('tokens', JSON.stringify(this.tokens));
    } else {
      window.localStorage.setItem('tokens', JSON.stringify(adminProps));
    }
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