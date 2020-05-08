import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../services/http-service/http.service';
import { Observable, of } from 'rxjs';
import { map, skip, auditTime } from 'rxjs/operators';
import { User } from '../types/user-type';
import { MessageModel } from '../types/message-model-type';
import { AuthService } from '../services/http-service/auth.service';
declare let $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css', '../styles/form-inputs.css'],
  encapsulation: ViewEncapsulation.None
})

export class HeaderComponent implements OnInit {

  private url: string;
  loginParams: { [key: string]: string };
  sendingMail: Observable<{ [key: string]: boolean } | boolean>;

  eeMessage: MessageModel;
  user$: Observable<User | boolean>;
  allowLogin$: Observable<boolean>;

  constructor(private http: HttpService, private router: Router, private auth: AuthService) { }

  ngOnInit() {
    this.url = decodeURIComponent(location.pathname);
    this.user$ = this.auth.userObs.pipe(skip(1));
    this.allowLogin$ = this.auth.allowLogIn;
  }

  contactModel(param) {

    this.eeMessage = {
      id: 'contact_ee',
      url: this.url,
      modalSize: "modal-lg",
      nameTo: 'אתיופיה אירועים',
      nameFrom: false,
      emailFrom: false,
      emailTo: "ethiopia-events@gmail.com",
      title: 'שלח הודעה',
      inputs: {
        email_from: true, 
        email_to: false, 
        name: true,
        area: true, 
        phone: true, 
        city: true,
        subject: true, 
        message: true
      }
    };
    this.http.sendingMail.next({ ['contact_ee']: true });
    this.sendingMail = this.http.sendingMail;
  }

  logOut(user: {}) {

    console.log(user);
    this.url = decodeURIComponent(location.pathname);
    let params = this.getUrlParams(user);

    this.http.logOut(params).subscribe(evt => {
      console.log(evt);
      // location.reload();
    });

    this.user$ = of(false);
    this.redirect();
  }

  logIn(user: string) {
    console.log("HEADER login method: ", user);
    this.auth.allowLogIn.next(true);
    this.http.requestUrl = decodeURIComponent(location.pathname);
    this.loginParams = this.getUrlParams(user);
  }

  register(path) {
    // $('.close').click(); 
    this.http.requestUrl = decodeURIComponent(location.pathname);
    console.log(this.http.requestUrl);

    this.router.navigate([path]);
  }

  getUrlParams(user) {
    let params = {
      from_path: location.pathname,
      url: user == "user" ? "login" : "admin-login",
      type: user
    };

    if (typeof user == "object") {
      params.url = user['admin'] ? "login" : "admin-login";
      params.type = user['admin'] ? "user" : "admin";
    }
    return params;
  }

  setUrlProfile(obj) {
    return "/users/" + obj['name'];
  }

  redirect() {
    let splitUrl: any = (this.url.indexOf('halls-events') >= 0) ? this.url.split("/") : false;
    splitUrl = (splitUrl && (splitUrl[1] && splitUrl[2])) ? splitUrl[1] + "/" + splitUrl[2] : (splitUrl && splitUrl[1]) ? splitUrl[1] : "/";
    this.router.navigate([splitUrl]);//, { relativeTo: this.route }
  }
}
