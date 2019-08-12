import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { of, BehaviorSubject, Observable, AsyncSubject } from 'rxjs';
import { tap, delay, map, find, filter, first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
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
  public requestUrl: string | boolean;
  public loginTo: string;
  public sendTo: string;

  public outRequests = {
    total: 0
  }

  public authUser: User;
  private baseUrl: string = "http://ethio:8080/api";

  public isLogedIn: Observable<boolean> = this.logged.asObservable();
  public userObs: Observable<User | boolean> = this.user.asObservable();

  constructor(private http: HttpClient, private jwt: JwtHelperService) {

    console.log('is Authonticated: ', this.isAuth());
    if (this.isAuth()) this.userPromise();
    let decoded = this.jwt.decodeToken(this.jwt.tokenGetter());
    // this.getData('customers').subscribe(item => console.log(item));
    // this.logNumRequsts();
  }

  isExpiredToken() {
    return this.jwt.isTokenExpired(this.jwt.tokenGetter());
  }

  protected logNumRequsts(){

    let timeOut = setTimeout(() => {
      console.log(this.outRequests);
      clearTimeout(timeOut);
    }, 7000);
  }

  protected setOutRequests(url) {
    this.outRequests.total++;
    this.outRequests[url] = (this.outRequests[url] && this.outRequests[url] > 0) ? this.outRequests[url] = (this.outRequests[url] + 1) : this.outRequests[url] = 1;
  }

  public logIn(credential, path?) {
    path = path ? path : this.loginTo ? this.loginTo : false;
    const theUrl = path ? this.baseUrl + "/" + path : "http://ethio:8080/api/login";

    let body = new HttpParams()
      .set('name', credential['name'])
      .set('email', credential['email'])
      .set('password', credential['password']);
    // const jwt = new JwtHelperService()
    this.setOutRequests(theUrl);
    return this.http.post(theUrl, body, this.headersOpt)
      .pipe(
        first(),
        tap(res => {
          console.log(res);

          if (res && res['access_token']) {
            this.allowLogIn.next(false);
            this.setUserProps(res['user']);
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

    this.setOutRequests(theUrl);
    return this.http.post(theUrl, body, this.headersOpt)
      .pipe(
        first(),
        tap(res => {
          if (res && res['access_token']) {
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

    this.setOutRequests(theUrl);
    return this.http.post(theUrl, body, this.headersOpt)
      .pipe(
        first(),
        tap(res => {
          if (res && res['access_token']) {
            this.setUserProps(res);
          }
          console.log(res);
        }));
  }

  store(theUrl, body) {

    this.setOutRequests(theUrl);
    return this.http.post(theUrl, (body || {}), this.getHttpOpt())
      .pipe(
        tap(user => {
          if (user['access_token']) {
            this.setUserProps(user);
            console.log(user);
          }
        }));
  }

  postData(postUrl, body?, opt?) {

    postUrl = postUrl ? this.baseUrl + "/" + postUrl : false;
    if (!opt) opt = this.getHttpOpt();
    this.setOutRequests(postUrl);
    return this.http.post(postUrl, (body || {}), opt);
  }

  getData(url?, opt?) {

    url = url ? this.baseUrl + "/" + url : "http://ethio:8080/api/events";
    //this.setOutRequests(url);
    return !this.isExpiredToken() ? this.http.get(url, this.getHttpOpt()).pipe(tap(item => this.setOutRequests(url)), first()) : this.http.get(url).pipe(tap(item => this.setOutRequests(url)), first());
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
    console.log("userPromise");

    path = path ? path : window.localStorage.getItem("admin_key") ? "auth-admin" : this.sendTo ? this.sendTo : false;
    const theUrl = path ? this.baseUrl + "/" + path : "http://ethio:8080/api/auth-user";//me
    let token = new HttpParams().set('token', this.jwt.tokenGetter());

    this.setOutRequests(theUrl);
    return this.http.post(theUrl, token, this.headersOpt)
      .pipe(
        first(),
        tap((resp) => {
          console.log('url: ', theUrl, ' response: ', resp);

          let user: User = resp['status'] && resp["user"] ? resp["user"] : resp['id'] ? resp : false;
          if (user) this.setUserProps(user);

          // if (user) {
          // this.setUserProps(user);
          // if(resp['access_token']) this.setApiKey(resp);
          // } else {

          // this.removePropsUser();
          // this.removeApiKey();
          // }
        })).toPromise().catch(this.handleError);
  }

  handleError(errors) {
    console.log(errors);
  }

  private removePropsUser() {
    this.logged.next(false);
    this.user.next(false);
    this.allowLogIn.next(true);
  }

  private setUserProps(user) {
    this.authUser = user;
    this.logged.next(true);
    this.user.next(user);
  }

  isAuth() {
    let exp = this.isExpiredToken();
    if (exp) {
      this.removePropsUser();
      if (this.jwt.tokenGetter()) this.removeApiKey();
      return !exp;
    }
    return !exp;
  }

  setApiKey(user) {
    if (user['authority']) window.localStorage.setItem("admin_key", "true");
    if (user['access_token']) {
      this.apiKey = user['access_token'];
      window.localStorage.setItem('token', this.apiKey);
    }
  }

  removeApiKey() {
    console.log("tokken remove");
    window.localStorage.clear();
    this.apiKey = false;
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
        'Authorization': 'Bearer ' + this.jwt.tokenGetter()
      })
    };
  }

}
