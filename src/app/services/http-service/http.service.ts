import { Customers } from 'src/app/types/customers-type';
import { Admin } from 'src/app/types/admin-type';
import { User } from 'src/app/types/user-type';
import { AuthTokens } from 'src/app/types/auth-token-type';
import { first, tap, catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ErrorsHandler } from '../errors-exeption/errors-handler.service';
import { HelpersService } from '../helpers/helpers.service';

@Injectable({
  providedIn: 'root'
})

export class HttpService {

  public sendingMail: BehaviorSubject<{ [key: string]: boolean } | boolean> = new BehaviorSubject(false);

  public intendedUri: string;
  public currentUrl: string;

  public requestUrl: string | boolean;
  public loginTo: string | boolean;
  public sendTo: string;


  token: string;

  private headersOpt: Object = {
    headers: new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  };

  public outRequests = {
    total: 0
  };


  private baseUrl: string = "http://lara.test/api";

  constructor(private http: HttpClient,
    private jwt: JwtHelperService,
    private hls: HelpersService,
    private esrv: ErrorsHandler) {}

  buildUrl(path?: string) {
    let urlKey = path ? path : window.localStorage.getItem("admin_key") ? "auth-admin" : this.sendTo ? this.sendTo : "auth-user";
    const theUrl = urlKey ? this.baseUrl + "/" + urlKey : "http://lara.test/api/auth-user";//me

    return {
      [urlKey]: theUrl,
      [theUrl]: urlKey
    }
  }

  protected logNumRequsts() {

    let timeOut = setTimeout(() => {
      console.log("num of requests: ", this.outRequests);
      clearTimeout(timeOut);
    }, 1000);
  }

  updateObservable(keyName: string, data: {}) {
    this[keyName].next(data);
  }

  protected setOutRequests(url) {
    this.outRequests.total++;
    let urlbuild = this.buildUrl(url);

    this.outRequests[url] = {
      url: urlbuild[url],
      num: this.outRequests[url] && this.outRequests[url].num ? this.outRequests[url].num + 1 : 1
    };
  }

  register(user){
    const url = 'register',
          body = new HttpParams()
          .set('name', user['name'])
          .set('email', user['email'])
          .set('password', user['password'])
          .set('passwordConfirm', user['passwordConfirm'])
          .set('city', user['city'])
          .set('area', user['area'])
          .set('tel', user['tel'])
          .set('about', user['about']);

    return this.store(url, body);
  }

  public logIn(credential): Observable<Admin | User | {} | boolean> {

    let path = this.loginTo ? this.loginTo : false;
    const theUrl = path ? this.baseUrl + "/" + path :  this.baseUrl +"/login";
    this.setOutRequests(path);

    let body = new HttpParams()
      .set('name', credential['name'])
      .set('email', credential['email'])
      .set('password', credential['password']);

    return this.http.post(theUrl, body, this.headersOpt).pipe(first());
  }

  public sendResetPassword(credential): Observable< {} | boolean>  {

    this.setOutRequests('/password/email');
    const theUrl = this.baseUrl +  "/password/email";

    let body = new HttpParams()
      .set('name', credential['name'])
      .set('email', credential['email']);
    
      return this.http.post(theUrl, body, this.headersOpt).pipe(first());
  }

  public resetPassword(credential): Observable<Admin | User | {} | boolean>  {

    this.setOutRequests('password/reset');
    const theUrl = this.baseUrl + "/password/reset";
    
    let body = new HttpParams()
    .set('email', credential['email'])
    .set('password', credential['password'])
    .set('password_confirmation', credential['password_confirmation'])
    .set('token', credential['token']);

    console.log(credential);
    return this.http.post(theUrl, body,this.headersOpt);
  }

  store(theUrl, body): Observable<Admin | User | {} | boolean>  {

    let url = this.baseUrl + "/" + theUrl;
    this.setOutRequests(theUrl);

    return this.http.post(url, (body || {}), this.getHttpOpt());
  }

  postData(postUrl, body?, opt?) {

    this.setOutRequests(postUrl);
    let url = this.baseUrl + "/" + postUrl;

    if (!opt) opt = this.getHttpOpt();
    
    return this.http.post(url, (body || {}), opt).pipe(catchError(err => {
      // this.esrv.handleError(err);
      // console.error(err.message);
      localStorage.setItem('errors_server', JSON.stringify(err));
      console.log("Error is handled");
      return throwError("Error thrown from catchError");
    }));
  }

  getData(path: string, token?): Observable<{ [key: string]: Customers[] } | any> {
    let url = this.baseUrl + "/" + path;

    this.setOutRequests(path);
    
    return ! (this.outRequests[url])? this.http.get(url, this.getHttpOpt()).pipe(first()): of(false);
  }

  logOut(urlParams) {

    let url = urlParams && typeof urlParams == "string" ? this.baseUrl + "/" + urlParams : this.baseUrl + "/logout",
      token = new HttpParams().set('token', urlParams.token);

    if (typeof urlParams == "object") {
      url = urlParams.url ? this.baseUrl + "/" + urlParams.url : this.baseUrl + "/logout";
    }
    return this.http.post(url, token, this.getHttpOpt(urlParams.token));
  }

  authenticated(urlParams: AuthTokens, cbk: CallableFunction): Promise<User | Admin | {}> {

    let nameType = Object.keys(urlParams)[0],
      path = 'auth-' + nameType,
      url = this.baseUrl + "/" + path,
      token = new HttpParams().set('token', urlParams[nameType]['token']);;

    this.setOutRequests(path);

    return this.http.post(url, token, this.headersOpt)
      .pipe(first(),map(user => this.getValidUser(user))).toPromise().catch(this.esrv.handleError);
  }

  private getValidUser(user){
    return ((typeof user == "object") && ('status' in user) && (user['status'] === false))? false: user;
  }

  private getHttpOpt(token?: string) {
    // console.log(this.apiKey);

    return {
      headers: new HttpHeaders({
        // 'Content-Type': 'multipart/form-data',
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'Content-Type':  'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    };
  }

}
