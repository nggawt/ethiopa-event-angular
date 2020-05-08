import { HttpService } from './http.service';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Admin } from 'src/app/types/admin-type';
import { User } from 'src/app/types/user-type';
import { Auth } from './auth';
import { BaseAuth } from './base-auth';
import { AuthToken } from 'src/app/types/auth-token-type';

declare var $: any;

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
          let user = users['user'];

          this.updateAuth(user, (!this.authUser ? true : false));
          let token = this.buildToken(users['access_token'], 'user');
          console.log(token);

          this.setToken(token, 'user');
        } else if (users['admin']) {
          let admin = {
            admin: {
              user: users['admin']['user'],
              authority: users['authority'],
              roles: users['roles']
            }
          },
          token = this.buildToken(users['admin']['access_token'], 'admin');
          
          this.updateAuth(admin);
          this.setToken(token, 'admin');

          console.log(users, " ::::::: ", admin, " ::token:: ", token);
        } else {
          console.warn("No user are logged in!.");
        }
      }, (err) => {
        console.log(err);
      });

    return cbk ? cbk(true) : true;
  }

  public updateAuth(user, append?: boolean) {

    if (append) {
      let currUser = this.user.getValue();
      this.user.next({ [Object.keys(currUser)[0]]: currUser[Object.keys(currUser)[0]], user });
      console.log(currUser);
    } else {
      this.authUser = user;
      this.logged.next(true);
      this.user.next(user);
    }
  }

  auth(): this {
    return this;
  }

  setAuth(tokens: AuthToken): void {

    this.getAuthenticated(tokens, (items) => {
      console.log("implemented: ", items);
      items.activeted = this.activeted;
      if (items.user?.user) items.user = items.user.user;
      // this.addPropsToUser(items);
      this.emit(items);
    });
  }

  async getAuthenticated(tokens: AuthToken, cabk) {

    let loggedUser = {};
    if (tokens.admin) loggedUser['admin'] = await this.http.authenticated({ ['admin']: tokens.admin });
    if (tokens.user) loggedUser['user'] = await this.http.authenticated({ ['user']: tokens.user });
    cabk(loggedUser);
  }

  emit(users) {
    this.user.next(users);
  }

  register(): boolean {
    throw new Error("Method not implemented.");
  }

  logout(): boolean {

    return true;
  }

  protected addPropsToUser(user) {

    (user['user'] && !user['user'].avatar)
      ? user['user'].avatar = 'https://source.unsplash.com/random/120x120' : !user.avatar
        ? user.avatar = 'https://source.unsplash.com/random/120x120' : '';
  }

  protected buildToken(token: string, typeName: string) {

    return {
      [typeName]: {
        [typeName + '_key']: true,
        token: token
      }
    };
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