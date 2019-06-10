import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { of, BehaviorSubject, Observable, AsyncSubject } from 'rxjs';
import { tap, delay, map, find, filter, first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../../types/user-type';

@Injectable({
  providedIn: 'root'
})

export class HttpService {

  private headersOpt: Object = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  };

  private apiKey: any;
  private logged: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private user: BehaviorSubject<User | number | boolean> = new BehaviorSubject(1);

  public allowLogIn = new BehaviorSubject(false);

  public intendedUri: string;
  public requestUrl: string;
  public loginTo: string;
  public sendTo: string;

  public authUser: User;
  private baseUrl: string = "http://ethio:8080/api";

  public isLogedIn: Observable<boolean> = this.logged.asObservable();
  public userObs: Observable<User | number | boolean> = this.user.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    console.log(location.pathname);
    this.sendTo = ! this.sendTo? (location.pathname.indexOf("/dashboard") >= 0)? 'auth-admin':'auth-user': this.sendTo;
    this.userPromise().then(user => user? this.user.next(user.status ? user['user'] : user.status): this.user.next(false));
  }

  public logIn(credential, path?) {
    path = path ? path : this.loginTo ? this.loginTo : false;
    const theUrl = path ? this.baseUrl + "/" + path : "http://ethio:8080/api/login";
    console.log(credential);
    
    let body = new HttpParams()
      .set('name', credential['name'])
      .set('email', credential['email'])
      .set('password', credential['password']);

    return this.http.post(theUrl, body, this.headersOpt)
      .pipe(
        first(),
        tap(res => {
          if (res && res['access_token']) {
            this.allowLogIn.next(false);
            this.setUserProps(res);
            this.user.next(res['user'] ? res['user'] : false);
          }
        }));
  }

  public sendResetPassword(credential) {
    //password/email  
    const theUrl = "http://ethio:8080/api/password/email";
    let body = new HttpParams()
      .set('name', credential['userName'])
      .set('email', credential['logInEmail']);

    return this.http.post(theUrl, body, this.headersOpt)
      .pipe(
        first(),
        tap(res => {
          if (res && res['access_token']) {
            this.allowLogIn.next(false);
            this.setUserProps(res);
          }
          console.log(res);

        }));
  }

  public resetPassword(credential) {
    //password/email  
    const theUrl = "http://ethio:8080/api/password/reset";
    let body = new HttpParams()
      .set('email', credential['email'])
      .set('password', credential['newPassword'])
      .set('password_confirmation', credential['password_conf'])
      .set('token', credential['token']);

    return this.http.post(theUrl, body, this.headersOpt)
      .pipe(
        first(),
        tap(res => {
          if (res && res['access_token']) {
            this.allowLogIn.next(false);
            this.setUserProps(res);
          }
          console.log(res);

        }));
  }

  store(theUrl, body) {
    return this.http.post(theUrl, body, this.headersOpt)
      .pipe(
        tap(user => {
          if (user['access_token']) {
            this.allowLogIn.next(false);
            this.setUserProps(user);
          }
        }));
  }

  postData(postUrl, body, opt?) {
    if (!opt) opt = this.getHttpOpt();

    return this.http.post(postUrl, body, opt);
  }

  getData(url?, opt?) {

    url = url ? this.baseUrl + "/" + url : "http://ethio:8080/api/events";
    return this.apiKey ? this.http.get(url, this.getHttpOpt()) : this.http.get(url);
  }

  public logOut(urlParams?) {

    urlParams = urlParams ? this.baseUrl + "/" + urlParams : this.baseUrl + "/logout";
    let token = new HttpParams().set('token', this.apiKey);
    console.log('token', this.apiKey);

    return this.http.post(urlParams, token, this.getHttpOpt())
      .pipe(
        tap(msg => {
          this.removePropsUser();
          if (this.apiKey) {
            window.sessionStorage.removeItem('user_key');
            this.apiKey = false;
          }
        }, (err) => {
          this.removePropsUser();
          if (this.apiKey) {
            window.sessionStorage.removeItem('user_key');
            this.apiKey = false;
          }
        }));
  }

  // isAuthenticeted() {

  //   const theUrl = "http://ethio:8080/api/authUser";
  //   let sSK = window.sessionStorage.getItem('user_key');
  //   this.apiKey = this.apiKey ? this.apiKey : sSK;
  //   let token = new HttpParams().set('token', this.apiKey);

  //   this.http.post(theUrl, token, this.headersOpt).pipe(first())
  //     .subscribe(
  //       (res) => {
  //         let user = res && res["user"]? res["user"]:false;

  //         if (user) {
  //           this.setUserProps(user);
  //           // console.log(user);
  //         } else {
  //           console.log("No user");
  //           this.removePropsUser();
  //     }});
  //   return this.userObs;
  // }

  userPromise(path?): Promise<User | any> {

    path = path ? path : this.sendTo ? this.sendTo : false;
    const theUrl = path ? this.baseUrl + "/" + path : "http://ethio:8080/api/auth-user";

    let sSK = window.sessionStorage.getItem('user_key');
    this.apiKey = this.apiKey ? this.apiKey : sSK;
    
    let token = new HttpParams().set('token', this.apiKey);

    console.log('url: ', theUrl, "token: ", this.apiKey);
    
    return this.http.post(theUrl, token, this.headersOpt)
      .pipe(
        first(),
        tap((resp) => {
          console.log('response: ', resp);
          
          let user: User = resp && resp["user"] ? resp["user"] : false;
          if (user) {
            this.setUserProps(user);
            // return response(user);
          } else {

            this.removePropsUser();
            // return reject(user);
          }
        })).toPromise().catch(this.handleError);
  }

  handleError(errors) {
    console.log(errors);
  }

  private removePropsUser() {
    // console.log('removePropsUser');
    this.apiKey = false;
    this.logged.next(false);
    this.user.next(false);

    const userKey = "user_key";
    window.sessionStorage.removeItem(userKey);
  }

  private setUserProps(user) {
    // console.log(user);

    const apiKey = user['access_token'];
    user = user && user['user'] ? user['user'] : user['id'] ? user : false;

    if (user) {
      this.authUser = user;
      const userKey = "user_key";
      this.logged.next(true);
      console.log("apiKey ", apiKey);

      this.apiKey = apiKey ? apiKey : this.apiKey;
      window.sessionStorage.setItem(userKey, this.apiKey);
    } else {
      // this.authUser = user &&  user['email']? user: this.authUser;
    }
  }

  isAuth() {
    return this.isLogedIn;
  }

  getApiKey() {
    return this.apiKey;
  }

  nextIslogged(param) {
    this.logged.next(param);
  }

  private getHttpOpt() {
    // console.log(this.apiKey);

    return {
      headers: new HttpHeaders({
        // 'Content-Type':  'application/json',
        // 'Content-Type': 'multipart/form-data',
        // 'Content-Type': 'application/x-www-form-urlencoded',
        // 'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.apiKey
      })
    };
  }

}
