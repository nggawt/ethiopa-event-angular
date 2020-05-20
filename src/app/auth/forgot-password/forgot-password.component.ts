import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
import { AuthService } from 'src/app/services/http-service/auth.service';
import { Subscription } from 'rxjs';
declare var $;
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  sendResetPasswordToEmail: FormGroup;
  forgotSubs: Subscription;

  @Input() ldComp: CallableFunction;

  params = {
    id: 'forgotPassword',
    modelSize: 'modal-md',
    title: "איפוס סיסמה"
  };

  constructor(private router: Router, private http: HttpService, private auth: AuthService) { }

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
          if(response['message']) $('.close').click();
        });
    }
  }

  ngOnDestroy(){
    if(this.forgotSubs) this.forgotSubs.unsubscribe();
  }
}



