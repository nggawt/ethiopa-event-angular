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
    // console.warn("RUNS BASE AUTH:> ", this.tokens);
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

  abstract addPropsToUser(user:AdminUser | UserFields): AdminUser | UserFields;
  abstract emit(user: Users | Admin | User | boolean): void;
  abstract setAuthUser(user: AdminUser | UserFields | boolean)

  protected getTokens(multiTokens?: string): AuthTokens | boolean {

    multiTokens = multiTokens ? multiTokens : this.jwt.tokenGetter('tokens');
    if (! multiTokens) return false;
    return this.validateTokens(JSON.parse(multiTokens));
  }

  setAuth(tokens: AuthTokens): void {

    this.getAuthenticated(tokens, (users: Users | Admin | User) => {

      if (users) {
        this.setActivated(users).emit(users);

      } else {
        this.destroyActivation();
      }
    });
  }

  protected validateTokens(tokens: AuthTokens | boolean): AuthTokens | boolean {

    let authenticated = Object.keys(tokens).reduce((tottal, current: string) => {

      if (this.guard.indexOf(current) >= 0 && (! this.invalidToken(tokens[current]['token']))) {
        tottal[current] = tokens[current];
      }
      return tottal;
    }, {});

    return Object.keys(authenticated).length ? authenticated : false;
  }

  protected invalidToken(token: string) {
    return this.jwt.isTokenExpired(token);
  }

  protected isExpiredToken() {
    let multiTokens = this.jwt.tokenGetter('tokens'),
        validTokens = multiTokens? this.getTokens(multiTokens): false;
    if (multiTokens && validTokens) return false;
    return true;
  }

  protected setToken(adminProps: AuthTokens, typeName) {

    if (this.tokens) {
      this.tokens[typeName] = adminProps[typeName];
    } else {
      this.tokens = adminProps;
    }
    return this;
  }

  protected setActivated(users: Users | User | Admin) {

    let currrentUsers = this.user.getValue(), hasActive = false;
    (currrentUsers && Object.keys(currrentUsers).length)? currrentUsers[Object.keys(users)[0]] = users[Object.keys(users)[0]]: currrentUsers = users;

    let userskeys  = Object.keys(currrentUsers);
    userskeys.forEach((current) => {

      if (this.tokens[current]['activeted']) {
        this.active(currrentUsers, current);
        hasActive = true;
      }
    });
    if (! hasActive) users['admin']? this.active(users, 'admin'): users['user'] ? this.active(users, 'user'): '';
    this.saveToken(this.tokens);

    // console.warn("::users:: ", currrentUsers, " ::tokens:: ", this.tokens);
    return this;
  }

  active(users: Users | User | Admin | boolean, type: string) {

    users[type]['activeted'] = true;
    this.tokens[type]['activeted'] = true;
    this.http.token = this.tokens[type]['token'];
    this.activeted = type;
    
    this.setAuthUser(users[type]);
  }

  deActive(users: Users | User | Admin | boolean, type: string) {

    users[type]['activeted'] = false;
    this.tokens[type]['activeted'] = false;
  }

  destroyActivation() {

    this.tokens = false;
    this.http.token = '';
    this.activeted = null;
    this.setAuthUser(false);
    this.emit(false);
    window.localStorage.clear();
  }

  protected async getAuthenticated(tokens: AuthTokens, cabk) {

    let loggedUser = {}, user: AdminUser | UserFields;
    if (tokens.admin) {

      user = await this.http.authenticated({ ['admin']: tokens.admin }, (err) => {
        console.log(err);
      });
      if(user && user.type == "admin") loggedUser['admin'] = this.addPropsToUser(user); 
    }

    if (tokens.user) {

      user = await this.http.authenticated({ ['user']: tokens.user }, (err) => {
        console.log(err);
      });
      if(user && user.type == "user") loggedUser['user'] = this.addPropsToUser(user);
    }
    (loggedUser? cabk(loggedUser) : cabk(false));
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

  protected saveToken(tokens: AuthTokens | boolean) {
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