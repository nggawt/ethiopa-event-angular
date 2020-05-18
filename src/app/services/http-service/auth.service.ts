import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Admin, AdminUser } from 'src/app/types/admin-type';
import { User, UserFields } from 'src/app/types/user-type';
import { Auth } from './auth';
import { BaseAuth } from './base-auth';


@Injectable({
  providedIn: 'root'
})

export class AuthService extends BaseAuth implements OnDestroy, Auth {

  private logged: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public allowLogIn = new BehaviorSubject(false);

  public isLogedIn: Observable<boolean> = this.logged.asObservable();
  public userObs: Observable<any> = this.user.asObservable();

  public authUser: UserFields | AdminUser | boolean;

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
    this.setActivated();
    this.authUser = !this.authUser || user[userType].activated? user[userType]: this.authUser; 
  }

  private addUser(user: User | Admin, userType: string) {
    let users = this.user.getValue();
    if (users && Object.keys(users).length) {
      users[userType] = user[userType];
      this.user.next(users);
    } else {
      this.logged.next(true);
      this.user.next(user);
    }
  }
  setAuthUser(user: AdminUser){
    this.authUser = user;
  }

  activateUser(userType: string){
    this.activate(userType);
  }

  logout(user: AdminUser | UserFields): boolean {
    let params = this.getUrlParams(user);
    console.log(user, params);
    this.http.logOut(params).subscribe(evt => {
      console.log(evt);
      this.removeAuth(params.type);
    });
    return false;
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
    this.authUser = leftUser && leftUser[userType]? leftUser[userType]:false;

    // activated && localstorage
    if(leftToken && leftUser){
      this.setActivated();
    }else{
      window.localStorage.clear();
    }
  }

  protected formatUserProps(data) {
    let user: Admin | User = this.userTransform(data);
    return this.addPropsToUser(user);
  }

  protected userTransform(data):  Admin | User{

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
  
  addPropsToUser(user: User | Admin): User | Admin {

    (user['user'] && !user['user'].avatar) ? user['user'].avatar = 'https://source.unsplash.com/random/120x120' :
      user && user['admin'] && ! user['admin']?.avatar ? user['admin'].avatar = 'https://source.unsplash.com/random/120x120' : '';
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

  getActiveUser(users: Admin | User){
    
    return Object.keys(users).reduce((acc, currValue) => {
      if(users[currValue].activeted){
        acc = users[currValue];
      } 
      return acc;
    }, {});
  }

  auth(): this {
    return this;
  }

  authCheck(): boolean {
    return this.validateTokens(this.tokens)? true: false;
  }

  emit(users) {
    this.user.next(users);
  }

  register(): boolean {
    throw new Error("Method not implemented.");
  }

  getToken(name?: string) {
    return name && this.tokens[name] ? this.tokens[name]['token'] : this.tokens && this.tokens[this.activeted] ? this.tokens[this.activeted]['token'] : '';
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