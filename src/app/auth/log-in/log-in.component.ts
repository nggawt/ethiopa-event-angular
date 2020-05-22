import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/http-service/auth.service';
import { HelpersService } from 'src/app/services/helpers/helpers.service';

declare let $: any;

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit, OnDestroy {

  logInform: FormGroup;

  phoneNum: RegExp | string;
  emailPatt: RegExp | string;
  passwordPatt: RegExp | string;

  url: string;
  loginSubscriber: Subscription;

  params = {
    id: 'login',
    modelSize: 'modal-md',
    title: "כניסה"
  };

  @Input() ldComp: CallableFunction;

  constructor(private router: Router,
    private helper: HelpersService,
    private auth: AuthService) {
    this.phoneNum = this.helper.getPatteren('phone');
    this.emailPatt = this.helper.getPatteren('email');
    this.passwordPatt = this.helper.getPatteren('password');
  }

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
          if (user['status']) {
            let title = "התחברות",
              body = "התחברת בהצלחה!";
            
            this.helper.notifyMsg().success(body, title, { positionClass: "toast-bottom-left" });
            $('.close').click();
          }
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
