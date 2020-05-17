import { HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Admin, AdminUserFields, AdminUser } from 'src/app/types/admin-type';
import { User, UserFields } from 'src/app/types/user-type';
import { Auth } from './auth';
import { BaseAuth } from './base-auth';
import { AuthTokens } from 'src/app/types/auth-token-type';


@Injectable({
  providedIn: 'root'
})

export class AuthService extends BaseAuth implements OnDestroy, Auth {

  private logged: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public allowLogIn = new BehaviorSubject(false);

  public isLogedIn: Observable<boolean> = this.logged.asObservable();
  public userObs: Observable<any> = this.user.asObservable();

  public authUser: User | Admin | boolean;

  loginSubscriber: Subscription;


  login(credential: { name: string, email: string, password: string }, cbk?: CallableFunction): User | boolean {

    this.loginSubscriber = this.http.logIn(credential)
      .subscribe(users => {

        if (users['status']) {
          this.addAuth(users, 'user'); 
        } else if (users['admin']) {
          this.addAuth(users, 'admin');  
        } else {
          console.warn("No user are logged in!.");
        }
      }, (err) => {
        console.log(err);
      });

    return cbk ? cbk(true) : true;
  }

  protected addAuth(users, userType: string) {


    let user: Admin | User = this.formatUserProps(users),
      token = userType == 'user'? this.buildToken(users['access_token'], 'user'): 
              this.buildToken(users[userType]['access_token'], userType);;

    this.addUser(user, userType);
    this.setToken(token, userType);
    this.setActivated(token, user);
    this.authUser = !this.authUser || user[userType].activated? user: this.authUser; 
  }

  addUser(user: User | Admin, userType: string) {
    let users = this.user.getValue();
    if (users && Object.keys(users).length) {
      users[userType] = user[userType];
      this.user.next(users);
    } else {
      this.logged.next(true);
      this.user.next(user);
    }
  }

  logout(user: AdminUser | UserFields): boolean {
    let params = this.getUrlParams(user);
    console.log(user, params);
    this.http.logOut(params).subscribe(evt => {
      console.log(evt);
      // location.reload();
      this.updateAuth(params.type);
    });
    return false;
  }

  getUrlParams(user) {
    return {
      from_path: location.pathname,
      url: user['authority'] ? "admin-logout" : "logout",
      type: user['authority'] ? "admin" : "user",
      token: this.getToken((user['authority'] ? "admin" : "user"))
    };
  }

  protected updateAuth(userType: string) {
    // tokens -> localstorage

    let leftToken = this.removeToken(userType),
      leftUser = this.removeUser(userType);

    console.log("::leftUser:: ", leftUser, " ::leftToken:: ", leftToken)
    // this.tokens
    this.tokens = leftToken;

    // users
    this.user.next(leftUser);

    // this.authUser
    this.authUser = leftUser;

    // activated && localstorage
    (!leftToken || !leftUser) ? window.localStorage.clear() : this.setActivated(leftToken, leftUser);;

  }

  auth(): this {
    return this;
  }

  setAuth(tokens: AuthTokens): void {

    this.getAuthenticated(tokens, (users) => {
      console.log(users);
      if (users) {
        Object.keys(users).forEach((userName: string, idx: number) => {
          if (users[userName]) this.addPropsToUser(users[userName]);
        });

        if (users.user?.user) users.user = users.user.user;
        this.emit(users);
        this.setActivated(tokens);
      } else {
        window.localStorage.clear();
      }
    });
  }

  emit(users) {
    this.user.next(users);
  }

  register(): boolean {
    throw new Error("Method not implemented.");
  }

  getToken(name?: string) {
    return name && this.tokens[name] ? this.tokens[name]['token'] : this.tokens && this.tokens[this.activeted] ? this.tokens[this.activeted]['token'] : false;
  }

  protected formatUserProps(data) {
    let user = this.userTransform(data);
    return this.addPropsToUser(user);
  }

  private userTransform(data) {

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

  protected addPropsToUser(user) {

    (user['user'] && !user['user'].avatar) ? user['user'].avatar = 'https://source.unsplash.com/random/120x120' :
      user && user.admin && !user.admin?.avatar ? user['admin'].avatar = 'https://source.unsplash.com/random/120x120' : '';
    return user;
  }

  ngOnDestroy() {
    if (this.loginSubscriber) this.loginSubscriber.unsubscribe();
    console.log("unsubscribe auth component!");

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