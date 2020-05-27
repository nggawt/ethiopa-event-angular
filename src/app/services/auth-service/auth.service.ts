import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Admin, AdminUser } from 'src/app/types/admin-type';
import { User, UserFields, Users } from 'src/app/types/user-type';
import { Auth } from './auth';
import { BaseAuth } from './base-auth';


@Injectable({
  providedIn: 'root'
})

export class AuthService extends BaseAuth implements Auth {

  private logged: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public allowLogIn = new BehaviorSubject(false);

  public isLogedIn: Observable<boolean> = this.logged.asObservable();
  public userObs: Observable<any> = this.user.asObservable();

  public authUser: UserFields | AdminUser | boolean;


  login(credential: { name: string, email: string, password: string }): Observable<User | Admin | boolean> {

    return this.http.logIn(credential)
      .pipe(tap((users: User | Admin) => this.handleAuth(users)));
  }

  register(user: UserFields): Observable<User | Admin | boolean> {

    return this.http.register(user)
      .pipe(tap((users: User | Admin) => this.handleAuth(users)));
  }

  resetPassword(user: UserFields): Observable<User | Admin | boolean> {

    return this.http.resetPassword(user)
      .pipe(tap((users: User | Admin) => this.handleAuth(users)));
  }

  sendResetPasswordEmail(user: { name: string, email: string }): Observable<{} | boolean> {
    const msg = "your reset password link was sent, go check your email";
    return this.http.sendResetPassword(user);
  }

  logout(user: AdminUser | UserFields): Observable<{} | boolean> {

    let params = this.getUrlParams(user);
    return this.http.logOut(params)
      .pipe(tap((item: {} | boolean) => this.removeAuth(params.type)));
  }

  protected handleAuth(users: User | Admin) {

    if (users['status'] && users['type'] == 'user') {
      this.addAuth(users, 'user');
    } else if (users['status'] && users['type'] == 'admin') {
      this.addAuth(users, 'admin');
    } else {
      console.warn("No user are logged in!.");
    }
  }

  protected addAuth(auth: Admin | User | boolean, userType: string) {

    let user: Admin | User = this.formatUserProps(auth),
      token = this.buildToken(auth['access_token'], userType);

    this.setToken(token, userType).setActivated(user);
    this.addUser(user, userType); 
    ! this.authUser? this.setAuthUser(user[userType]): '';
  }

  private addUser(user: Admin | User, userType: string) {
    let users = this.user.getValue();
    if (users && Object.keys(users).length) {
      users[userType] = user[userType];
      this.user.next(users);
    } else {
      this.logged.next(true);
      this.user.next(user);
    }
    return this;
  }

  setAuthUser(user: AdminUser | UserFields | boolean) {
    this.authUser = user;
  }

  activateUser(userType: string) {

    let users = this.user.getValue();

    // activated
    // tokens + token storage
    // this.activeted = userType;

    Object.keys(users).forEach((current, idx) => {
      (current == userType) ? this.active(users, current) : this.deActive(users, current);
    });
    this.saveToken(this.tokens);

    // users
    this.emit(users);
  }

  protected removeAuth(userType: string) {

    // tokens -> localstorage
    let leftToken = this.removeToken(userType),
      leftUser = this.removeUser(userType);

    console.log("::leftUser:: ", leftUser, " ::leftToken:: ", leftToken)
    // this.tokens
    this.tokens = leftToken;

    // users
    this.user.next(leftUser);

    // this.authUser
    this.authUser = leftUser && leftUser[userType] ? leftUser[userType] : false;

    // activated && localstorage
    if (leftToken && leftUser) {
      this.setActivated(<Admin | User>leftUser);
    } else {
      this.destroyActivation();
    }
  }

  formatUserProps(data): Admin | User {
    return this.userTransform(data);
  }

  protected userTransform(data): Admin | User {
    console.log(data);
    
    let user: Admin | User;
    if(data.type == 'admin'){
      user = {
        admin: {
          user: data['user'],
          authority: data['authority'],
          type: data.type,
          avatar: 'https://source.unsplash.com/random/120x120'
        }
      };
      if(data['roles']) user.admin.roles = data['roles'];
    }else if (data.type == 'user') {
      user = { user: data['user']};
      user['user']['avatar'] = 'https://source.unsplash.com/random/120x120';
    } 
    return user;
  }

  addPropsToUser(user: AdminUser | UserFields): AdminUser | UserFields {

      user.avatar = 'https://source.unsplash.com/random/120x120';
    return user;
  }

  getUrlParams(user) {
    return {
      from_path: location.pathname,
      url: user['authority'] ? "admin-logout" : "logout",
      type: user['authority'] ? "admin" : "user",
      token: this.getToken((user['authority'] ? "admin" : "user"))
    };
  }

  getActiveUser(users: Users, userType?: string): AdminUser | UserFields | {} {

    return Object.keys(users).reduce((acc, currValue) => {
      if(userType == currValue){
        acc = users[currValue];
      }else if (users[currValue].activeted) {
        acc = users[currValue];
      }
      return acc;
    }, {});
  }

  auth(): this {
    return this;
  }

  authCheck(): boolean {
    const invalid = this.authUser? this.invalidToken(this.getToken(this.authUser['type'])) :this.isExpiredToken();
    console.info("user type::> ", (this.authUser? this.authUser['type']: this.authUser), " ::invalid:: ", invalid);
    if(invalid && this.authUser) this.removeAuth(this.authUser['type']);
    return invalid? false : true;
  }

  emit(users) {
    this.user.next(users);
  }

  getToken(name?: string) {
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    return name && tokens && tokens[name] ? tokens[name]['token'] : (tokens && this.activeted && tokens[this.activeted])? tokens[this.activeted]['token'] : '';
  }
}