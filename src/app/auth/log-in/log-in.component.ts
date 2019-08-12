import { Component, OnInit, Input, AfterViewChecked, AfterContentChecked } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../../services/http-service/http.service';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { of } from 'rxjs';
// import { filter, tap, first } from 'rxjs/operators';
declare let $: any;


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit, AfterContentChecked {

  logInform: FormGroup;
  phoneNum: any = '^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})';
  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  passwordPatt: string = '^\\w{6,}$';

  url: string;

  params = {
    id: 'login',
    modelSize: 'modal-md',
    title: "כניסה"
  };

  constructor(private router: Router,
    private route: ActivatedRoute,
    private http: HttpService, private jwt: JwtHelperService) { }

  ngOnInit() {

    this.url = decodeURIComponent(location.pathname);
    /* if (! this.http.isAuth()) {
      this.params = {
        id: 'login',
        modelSize: 'modal-md',
        title: "כניסה"
      };
    } */
    this.initFormLogin();
  }
  ngAfterContentChecked (){
    // if(this.http.isAuth()) this.redirect();
  }

  private initFormLogin() {

    this.logInform = new FormGroup({
      "name": new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required])
    });
    // $('#login').modal();
  }

  logOut() {

    this.http.logOut().subscribe(evt => {
      console.log(evt);
      // location.reload();
    });
    // this.user$ = of(false);
    this.redirect();
  }

  redirect() {
    let splitUrl: any = (this.url.indexOf('halls-events') >= 0) ? this.url.split("/") : false;
    splitUrl = (splitUrl && (splitUrl[1] && splitUrl[2])) ? splitUrl[1] + "/" + splitUrl[2] : (splitUrl && splitUrl[1]) ? splitUrl[1] : "/";
    this.router.navigate([splitUrl], { relativeTo: this.route });
  }

  onSubmit() {

    if (this.logInform.valid) {
      console.log(this.logInform.value);
      this.http.logIn(this.logInform.value).
        subscribe(evt => {

          let IntendedUri = this.http.intendedUri ? this.http.intendedUri : "/";
          console.log(this.jwt.decodeToken(evt['access_token']));

          this.router.navigate([IntendedUri]);
          $('.close').click();

        }, (err) => {
          // this.isTrue = true;
          console.log(err);
        });
    }
  }

  register(path) {
    $('.close').click();
    // this.md.modal('hide');
    this.router.navigate([path]);
  }

  sendEmail(path) {
    $('.close').click();
    // this.md.modal('hide');
    this.router.navigate([path]);
  }

  get f() { return this.logInform.controls; }

}
