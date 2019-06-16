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
  private user: BehaviorSubject<User | boolean> = new BehaviorSubject(false);

  public allowLogIn = new BehaviorSubject(false);

  public intendedUri: string;
  public requestUrl: string;
  public loginTo: string;
  public sendTo: string;

  public authUser: User;
  private baseUrl: string = "http://ethio:8080/api";

  public isLogedIn: Observable<boolean> = this.logged.asObservable();
  public userObs: Observable<User | boolean> = this.user.asObservable();

  constructor(private http: HttpClient, private router: Router) {this.userPromise();}

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
            this.setApiKey(res);
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
            this.setApiKey(res);
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
            this.setApiKey(res);
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
            this.setApiKey(user);
            console.log(user);
          }
        }));
  }

  postData(postUrl, body, opt?) {
    postUrl = postUrl ? this.baseUrl + "/" + postUrl: false;
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
          this.removeApiKey();
        }, (err) => {
          this.removePropsUser();
          this.removeApiKey();
        }));
  }

  userPromise(path?): Promise<User | any> {

    path = path ? path : window.localStorage.getItem("admin_key") ? "auth-admin" : this.sendTo ? this.sendTo : false;
    const theUrl = path ? this.baseUrl + "/" + path : "http://ethio:8080/api/auth-user";

    let sSK = window.localStorage.getItem('user_key');
    this.apiKey = this.apiKey ? this.apiKey : sSK;

    let token = new HttpParams().set('token', this.apiKey);

    // console.log('url: ', theUrl, "token: ", this.apiKey);

    return this.http.post(theUrl, token, this.headersOpt)
      .pipe(
        first(),
        tap((resp) => {
          console.log('response: ', resp);

          let user: User = resp['status'] && resp["user"] ? resp["user"] : false;
          if (user) {
            this.setUserProps(user);
            this.setApiKey(resp);
          } else {

            this.removePropsUser();
            this.removeApiKey();
            // return reject(user);
          }
        })).toPromise().catch(this.handleError);
  }

  handleError(errors) {
    console.log(errors);
  }

  private removePropsUser() {
    this.logged.next(false);
    this.user.next(false);
  }

  private setUserProps(user) {
    this.authUser = user;
    this.logged.next(true);
    this.user.next(user);
  }

  isAuth() {
    return this.isLogedIn;
  }

  setApiKey(user) {
    user['authority'] ? window.localStorage.setItem("admin_key", "true") : "";

    if(user['access_token']){
      this.apiKey = user['access_token'];
      window.localStorage.setItem('user_key', this.apiKey);
    } 
  }

  removeApiKey() {
    console.log("tokken remove");
    window.localStorage.clear();
    this.apiKey = false;

    // const userKey = "user_key";
    // window.localStorage.removeItem(userKey);
    // window.localStorage.getItem("admin_key")? window.localStorage.removeItem("admin_key"): '';

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
