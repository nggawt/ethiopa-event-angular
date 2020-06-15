import { HelpersService } from 'src/app/services/helpers/helpers.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth-service/auth.service';

import { Subscription } from 'rxjs';

declare var $;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  emailPatt: RegExp | string;
  
  sendResetPasswordToEmail: FormGroup;
  forgotSubs: Subscription;

  @Input() ldComp: CallableFunction;

  params = {
    id: 'forgotPassword',
    modelSize: 'modal-md',
    title: "איפוס סיסמה"
  };

  constructor(private helper: HelpersService, 
    private auth: AuthService) { 
      this.emailPatt = this.helper.getPatteren('email');
    }

  ngOnInit() {
    this.initRestPasswordForm();
  }

  initRestPasswordForm() {

    this.sendResetPasswordToEmail = new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required])
    });
  }

  register() {

    $('.close').click();
    this.ldComp('register', {
      from_path: location.pathname,
      url: "register",
      type: 'user'
    });
  }

  backToLogin() {
    // {
    //   from_path: location.pathname,
    //   url: user == "user" ? "login" : "admin-login",
    //   type: user
    // }
    $('.close').click();
    this.ldComp('login', {
      from_path: location.pathname,
      url: "login",
      type: 'user'
    })
  }

  onSubmit() {

    if (this.sendResetPasswordToEmail.valid) {
      this.forgotSubs = this.auth.sendResetPasswordEmail(this.sendResetPasswordToEmail.value)
        .subscribe(response => {
          console.log(response);
          if(response['status']){
            // this.http.intendedUri = "/customers";
            this.helper.notifyMsg().success(response['message'], "איפוס סיסמה", {positionClass: "toast-bottom-left"});
            $('.close').click();
          } 
        });
    }
  }

  ngOnDestroy(){
    if(this.forgotSubs) this.forgotSubs.unsubscribe();
  }
}



