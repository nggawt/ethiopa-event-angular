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

    if (users['status']) {
      this.addAuth(users, 'user');
    } else if (users['admin']) {
      this.addAuth(users, 'admin');
    } else {
      console.warn("No user are logged in!.");
    }
  }

  protected addAuth(auth: Admin | User | boolean, userType: string) {

    let user: Admin | User = this.formatUserProps(auth),
      token = userType == 'user' ? this.buildToken(auth['access_token'], 'user') :
        this.buildToken(auth[userType]['access_token'], userType);;

    this.setToken(token, userType).setActivated(user);
    this.addUser(user, userType);

    // this.setToken(token, userType);
    // this.setActivated();
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
    this.activate(userType);
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

  protected formatUserProps(data): Admin | User {
    let user: Admin | User = this.userTransform(data);
    return this.addPropsToUser(user);
  }

  protected userTransform(data): Admin | User {

    let user: Admin | User;

    if (data['roles']) {
      user = {
        admin: {
          user: data['admin']['user'],
          authority: data['authority'],
          roles: data['roles']
        }
      };
    } else if (data['authority']) {
      user = {
        admin: {
          user: data['admin']['user'],
          authority: data['authority'],
        }
      };
    } else if (data['user']) {
      user = { user: data['user'] };//data['user']; 
    }
    return user;
  }

  addPropsToUser(user: Admin | User): Admin | User {

    (user['user'] && !user['user'].avatar) ? user['user'].avatar = 'https://source.unsplash.com/random/120x120' :
      user && user['admin'] && !user['admin']?.avatar ? user['admin'].avatar = 'https://source.unsplash.com/random/120x120' : '';
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

  getActiveUser(users: Users) {

    return Object.keys(users).reduce((acc, currValue) => {
      if (users[currValue].activeted) {
        acc = users[currValue];
      }
      return acc;
    }, {});
  }

  auth(): this {
    return this;
  }

  authCheck(): boolean {
    return this.validateTokens(this.tokens) ? true : false;
  }

  emit(users) {
    this.user.next(users);
  }

  getToken(name?: string) {
    return name && this.tokens[name] ? this.tokens[name]['token'] : this.tokens && this.tokens[this.activeted] ? this.tokens[this.activeted]['token'] : '';
  }
}

/*
for (const token of Object.keys(tokens)) {
  loggedUser[Object.keys(token)[0]] = await this.http.authenticated(token);
}
*/

/* if(tokens.length == 2){
  loggedUser = {
    [Object.keys(tokens[0])[0]]: await this.http.authenticated(tokens[0]),
    [Object.keys(tokens[1])[0]]: await this.http.authenticated(tokens[1])
  };
}else{
  loggedUser = {
    [Object.keys(tokens[0])[0]]: await this.http.authenticated(tokens[0]),
  };
} */

/*
this.getAuth(tokens).then(user => {
  console.log("implemented: ", user);
  this.emit(user);
});
*/
/*
  // map(user => user && user['admin']? user['admin']: user ? user: false),
      tap(res => {
        let isAdmin = res['roles'] || res['authority'] || res['admin'];
        let itemsRes = res && res['admin'] ? res['admin'] : res ? res : false;


        if (itemsRes && itemsRes['access_token']) {
          // this.allowLogIn.next(false);
          this.setApiKey(itemsRes);

          let user = this.getResponseUser(res);
          this.setUserProps(user);
          console.log("url: ", theUrl, 'response: ', res, " user: ", user);
        }
      })
*/