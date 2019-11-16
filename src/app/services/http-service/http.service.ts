import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { of, BehaviorSubject, Observable, AsyncSubject, throwError } from 'rxjs';
import { tap, delay, map, find, filter, first, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../../types/user-type';
import { ErrorsHandler } from '../errors-exeption/errors-handler.service';
import { Admin } from 'src/app/types/admin-type';

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

  private USER_TYPE: { [user: string]: boolean } = { USER: false, ADMIN: false };

  private apiKey: any;
  private logged: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private user: BehaviorSubject<User | Admin | boolean> = new BehaviorSubject(false);

  public allowLogIn = new BehaviorSubject(false);
  public sendingMail: BehaviorSubject<{ [key: string]: boolean } | boolean> = new BehaviorSubject(false);

  public intendedUri: string;
  public requestUrl: string | boolean;
  public loginTo: string | boolean;
  public sendTo: string;

  public outRequests = {
    total: 0
  }

  public authUser: User;
  private baseUrl: string = "http://ethio:8080/api";

  public isLogedIn: Observable<boolean> = this.logged.asObservable();
  public userObs: Observable<any> = this.user.asObservable();

  constructor(private http: HttpClient, private jwt: JwtHelperService, private esrv: ErrorsHandler) {
    let isAuth = this.isAuth();
    console.log('is Authonticated: ',isAuth, ' expire in: ', this.jwt.getTokenExpirationDate(this.jwt.tokenGetter()));

    if (isAuth) this.userPromise();
    let decoded = this.jwt.decodeToken(this.jwt.tokenGetter());
    // this.getData('customers').subscribe(item => console.log(item));
    // this.logNumRequsts();
  }

  isExpiredToken() {
    
    return this.jwt.isTokenExpired(this.jwt.tokenGetter());
  }

  protected logNumRequsts() {

    let timeOut = setTimeout(() => {
      console.log(this.outRequests);
      clearTimeout(timeOut);
    }, 7000);
  }

  updateObservable(keyName: string, data: {}) {
    this[keyName].next(data);
  }

  protected setOutRequests(url) {
    this.outRequests.total++;
    this.outRequests[url] = (this.outRequests[url] && this.outRequests[url] > 0) ? this.outRequests[url] = (this.outRequests[url] + 1) : this.outRequests[url] = 1;
  }

  public logIn(credential, path?) {

    path = path ? path : this.loginTo ? this.loginTo : false;
    const theUrl = path ? this.baseUrl + "/" + path : "http://ethio:8080/api/login";

    console.log("URL: ", theUrl);
    let body = new HttpParams()
      .set('name', credential['name'])
      .set('email', credential['email'])
      .set('password', credential['password']);
    // const jwt = new JwtHelperService()
    this.setOutRequests(theUrl);
    return this.http.post(theUrl, body, this.headersOpt)
      .pipe(
        first(),
        // map(user => user && user['admin']? user['admin']: user ? user: false),
        tap(res => {
          let itemsRes = res && res['admin'] ? res['admin'] : res ? res : false;
          
          let isAdmin = res['roles'] || res['authority'] || res['admin'];

          isAdmin ? this.USER_TYPE["ADMIN"] = true : itemsRes ? this.USER_TYPE["USER"] = true : '';

          if (itemsRes && itemsRes['access_token']) {
            this.allowLogIn.next(false);
            this.setApiKey(itemsRes);
            
            let user = this.getResponseUser(res);
            this.setUserProps(user);
            this.user.next(user);
            console.log("url: ", theUrl, 'response: ', res, " user: ", user);
          }
        }));
  }

  protected getResponseUser(response){

    let itemsRes = response && response['admin'] ? response['admin'] : response;

    let user = response['roles'] ? {
      user: itemsRes['user'],
      authority: itemsRes['authority'],
      roles: response['roles']
    } : (itemsRes && itemsRes['authority']) ? {
      user: itemsRes['user'],
      authority: itemsRes['authority']
    } : itemsRes['user'] ? itemsRes['user'] : false;

    (user['user'] && !user['user'].avatar)
        ? user['user'].avatar = 'https://source.unsplash.com/random/120x120' : !user.avatar
        ? user.avatar = 'https://source.unsplash.com/random/120x120' : '';

    return user;
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
    let url = this.baseUrl + "/" + theUrl;
    this.setOutRequests(url);
    return this.http.post(url, (body || {}), this.getHttpOpt())
      .pipe(
        tap(user => {
          console.log(user);
        }));
  }

  postData(postUrl, body?, opt?) {

    postUrl = postUrl ? this.baseUrl + "/" + postUrl : false;
    if (!opt) opt = this.getHttpOpt();
    this.setOutRequests(postUrl);
    return this.http.post(postUrl, (body || {}), opt).pipe(catchError(err => {
      // this.esrv.handleError(err);
      // console.error(err.message);
      localStorage.setItem('errors_server', JSON.stringify(err));
      console.log("Error is handled");
      return throwError("Error thrown from catchError");
    }));
  }

  getData(url?, opt?) {

    url = url ? this.baseUrl + "/" + url : "http://ethio:8080/api/events";
    //this.setOutRequests(url);
    return ! this.isExpiredToken() ? this.http.get(url, this.getHttpOpt()).pipe(tap(item => this.setOutRequests(url)), first()) : 
                                    this.http.get(url).pipe(tap(item => this.setOutRequests(url)), first());
  }

  logOut(urlParams?) {
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

  getUserType() {
    let token = new HttpParams().set('token', this.jwt.tokenGetter());
    this.http.post(this.baseUrl + '/user-type', token, this.headersOpt).subscribe(userType => {
      console.log(userType);

    });
  }

  userPromise(path?): Promise<User | any> {
    console.log("userPromise", " window.localStorage: ", window.localStorage);

    path = path ? path : window.localStorage.getItem("admin_key") ? "auth-admin" : this.sendTo ? this.sendTo : false;
    const theUrl = path ? this.baseUrl + "/" + path : "http://ethio:8080/api/auth-user";//me
    let token = new HttpParams().set('token', this.jwt.tokenGetter());
    this.getUserType();
    this.setOutRequests(theUrl);
    return this.http.post(theUrl, token, this.headersOpt)
      .pipe(
        first(),
        tap((res) => {
          let user = this.getResponseUser(res);
          console.log('url: ', theUrl, ' response: ', res, ' user: ', user);
          if (user) this.setUserProps(user);

        })).toPromise().catch(this.esrv.handleError);
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
