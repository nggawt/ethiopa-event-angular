import { Customers } from 'src/app/types/customers-type';
import { Admin } from 'src/app/types/admin-type';
import { User } from 'src/app/types/user-type';
import { AuthTokens } from 'src/app/types/auth-token-type';
import { first, tap, catchError } from 'rxjs/operators';
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

  public logIn(credential, path?) {

    path = path ? path : this.loginTo ? this.loginTo : false;
    const theUrl = path ? this.baseUrl + "/" + path : "http://lara.test/api/login";
    this.setOutRequests(path);

    let body = new HttpParams()
      .set('name', credential['name'])
      .set('email', credential['email'])
      .set('password', credential['password']);

    return this.http.post(theUrl, body, this.headersOpt).pipe(first());
  }

  public sendResetPassword(credential) {

    this.setOutRequests('/password/email');

    const theUrl = "http://lara.test/api/password/email";

    let body = new HttpParams()
      .set('name', credential['userName'])
      .set('email', credential['logInEmail']);

    return this.http.post(theUrl, body, this.headersOpt)
      .pipe(
        first(),
        tap(res => {
          if (res && res['access_token']) {
            // this.setUserProps(res);
          }
          console.log(res);
        }));
  }

  public resetPassword(credential) {

    //password/email  
    this.setOutRequests('password/reset');

    const theUrl = "http://lara.test/api/password/reset";

    let body = new HttpParams()
      .set('email', credential['email'])
      .set('password', credential['newPassword'])
      .set('password_confirmation', credential['password_conf'])
      .set('token', credential['token']);

    return this.http.post(theUrl, body, this.headersOpt)
      .pipe(first(),
        tap(res => {
          if (res && res['access_token']) {
            // this.setUserProps(res);
          }
          console.log(res);
        }));
  }

  store(theUrl, body) {
    let url = this.baseUrl + "/" + theUrl;
    this.setOutRequests(theUrl);
    return this.http.post(url, (body || {}), this.getHttpOpt())
      .pipe(
        tap(user => {
          console.log(user);
        }));
  }

  postData(postUrl, body?, opt?) {

    this.setOutRequests(postUrl);
    let url = this.baseUrl + "/" + postUrl;

    if (!opt) opt = this.getHttpOpt();
    console.log(opt);
    
    return this.http.post(url, (body || {}), opt).pipe(catchError(err => {
      // this.esrv.handleError(err);
      // console.error(err.message);
      localStorage.setItem('errors_server', JSON.stringify(err));
      console.log("Error is handled");
      return throwError("Error thrown from catchError");
    }));
  }

  postDta(postUrl, body, token: string) {

    this.setOutRequests(postUrl);
    let url = this.baseUrl + "/" + postUrl;

    console.log(token);
    return this.http.post(url, (body || {}), this.getHttpOpt(token)).pipe(catchError(err => {
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
    console.log(path);
    
    return ! this.outRequests[url]? this.http.get(url, this.getHttpOpt()).pipe(first()): of(false);
  }

  logOut(urlParams) {

    let url = urlParams && typeof urlParams == "string" ? this.baseUrl + "/" + urlParams : this.baseUrl + "/logout",
      token = new HttpParams().set('token', urlParams.token);

    if (typeof urlParams == "object") {
      url = urlParams.url ? this.baseUrl + "/" + urlParams.url : this.baseUrl + "/logout";
    }
    return this.http.post(url, token, this.getHttpOpt(urlParams.token));
  }

  getUserType() {
    let token = new HttpParams().set('token', this.jwt.tokenGetter());
    this.http.post(this.baseUrl + '/user-type', token, this.headersOpt).subscribe(userType => {
      console.log(userType);
    });
  }

  authenticated(urlParams: AuthTokens, cbk: CallableFunction): Promise<User | Admin | any> {

    let nameType = Object.keys(urlParams)[0],
      path = 'auth-' + nameType,
      url = this.baseUrl + "/" + path,
      token = new HttpParams().set('token', urlParams[nameType]['token']);;

    console.log(urlParams);
    this.setOutRequests(path);

    return this.http.post(url, token, this.headersOpt)
      .pipe(
        first(),
        tap((res) => {
          // console.log('url: ', theUrl, ' response: ', res, ' user: ', user);
        })).toPromise().catch(this.esrv.handleError);
  }

  private getHttpOpt(token?: string) {
    // console.log(this.apiKey);

    return {
      headers: new HttpHeaders({
        // 'Content-Type':  'application/json',
        // 'Content-Type': 'multipart/form-data',
        // 'Content-Type': 'application/x-www-form-urlencoded',
        // 'Accept': 'application/json',
        'Authorization': 'Bearer ' + token //this.jwt.tokenGetter()
      })
    };
  }

}
