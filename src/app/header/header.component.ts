import { HelpersService } from './../services/helpers/helpers.service';
import { UserFields } from 'src/app/types/user-type';
import { AdminUser } from 'src/app/types/admin-type';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../services/http-service/http.service';
import { Observable, of, Subscription } from 'rxjs';
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

export class HeaderComponent implements OnInit, OnDestroy {

  private url: string;
  loginParams: { [key: string]: string };
  sendingMail: Observable<{ [key: string]: boolean } | boolean>;

  eeMessage: MessageModel;
  user$: Observable<User | boolean>;
  allowLogin$: Observable<boolean>;

  logoutSubs: Subscription;

  constructor(private http: HttpService, 
    private router: Router, 
    private auth: AuthService,
    private helper: HelpersService) { }

  ngOnInit() {
    this.url = decodeURIComponent(location.pathname);
    this.user$ = this.auth.userObs;//.pipe(skip(1));
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

  logIn(user: string) {
    console.log("HEADER login method: ", user);
    this.auth.allowLogIn.next(true);
    this.http.requestUrl = this.url
    this.loginParams = this.getUrlParams(user);
  }

  register(path) {
    this.http.requestUrl = this.url;
    this.router.navigate([path]);
  }

  forgot(path) {
    this.http.requestUrl = this.url;
    this.router.navigate([path]);
  }

  logOut(user: AdminUser | UserFields) {

    this.logoutSubs = this.auth.logout(user)
    .subscribe(response => {
      
      console.log("::response:: ", response);
        if(response['status']){
          let title = "התנתקות",
              body = "התנתקות בוצע בהצלחה!";
          this.helper.notifyMsg().success(body, title, { positionClass: 'toast-top-center' });
        }
      });
  }

  active(user: UserFields | AdminUser) {
    console.log(user);
    (!user.activeted) ? this.auth.activateUser((user['authority'] ? 'admin' : 'user')) : '';
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
    console.log(obj);

    this.router.navigate(["/users/" + obj['name']]);
  }

  setUrlPage(customer) {

    let compNameTrimed = customer['company'].trim(),
      bTypeTrimed = customer['businessType'].trim(),
      compName = (compNameTrimed.split(' ').length > 1) ? this.appendSelashBetweenSpace(compNameTrimed, ' ') : customer['company'],
      businessType = (bTypeTrimed.split(' ').length > 1) ? this.appendSelashBetweenSpace(bTypeTrimed, ' ') : customer['businessType'];

    this.router.navigate(["/customers/" + businessType + "/" + compName]);
  }

  appendSelashBetweenSpace(text, delimiter?) {
    let str: string;
    delimiter = delimiter ? delimiter : " ";
    text.split(delimiter).forEach(element => {
      (str) ? (element != "") ? str += "-" + element : '' : (element != "") ? str = element : '';
    });
    return str;
  }

  redirect() {
    let splitUrl: any = (this.url.indexOf('halls-events') >= 0) ? this.url.split("/") : false;
    splitUrl = (splitUrl && (splitUrl[1] && splitUrl[2])) ? splitUrl[1] + "/" + splitUrl[2] : (splitUrl && splitUrl[1]) ? splitUrl[1] : "/";
    this.router.navigate([splitUrl]);//, { relativeTo: this.route }
  }

  ngOnDestroy() {
    if (this.logoutSubs){
      this.logoutSubs.unsubscribe();
      console.log("HEADER is Unsubscribe!");
      
    } 
  }
}
