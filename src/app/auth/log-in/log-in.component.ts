import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../../services/http-service/http.service';
import { AuthService } from 'src/app/services/http-service/auth.service';
import { Subscription } from 'rxjs';

declare let $: any;

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit, OnDestroy {

  logInform: FormGroup;

  phoneNum: any = '^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})';
  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  passwordPatt: string = '^\\w{6,}$';

  url: string;
  loginSubscriber: Subscription;

  params = {
    id: 'login',
    modelSize: 'modal-md',
    title: "כניסה"
  };

  @Input() ldComp: CallableFunction;

  constructor(private http: HttpService,
    private auth: AuthService) { }

  ngOnInit() {

    this.url = decodeURIComponent(location.pathname);
    this.initFormLogin();
  }

  get f() { return this.logInform.controls; }

  private initFormLogin() {

    this.logInform = new FormGroup({
      "name": new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required])
    });
  }

  onSubmit() {

    if (this.logInform.valid) {
      this.loginSubscriber = this.auth.login(this.logInform.value)
        .subscribe(user => {
          // console.log(user); 
          if (user['user'] || user['admin']) $('.close').click();
        });
    }
  }

  register() {
    $('.close').click();
    this.ldComp('register', {
      from_path: location.pathname,
      url: "register",
      type: 'user'
    });
  }

  forgotPassword(path) {

    $('.close').click();
    this.ldComp('forgot', {
      from_path: location.pathname,
      url: "forgot",
      type: 'user'
    });
  }

  ngOnDestroy() {
    if (this.loginSubscriber) this.loginSubscriber.unsubscribe();
  }
}
