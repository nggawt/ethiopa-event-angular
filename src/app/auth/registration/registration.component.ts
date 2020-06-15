import { HelpersService } from 'src/app/services/helpers/helpers.service';
import { Admin } from 'src/app/types/admin-type';
import { User } from 'src/app/types/user-type';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth-service/auth.service';

import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {

  regiter: FormGroup;
  regisSubs:Subscription;

  @Input() ldComp: CallableFunction;

  params = {
    id: 'rgister',
    modelSize: 'modal-lg',
    title: "הרשמה"
  };

  phoneNum: RegExp | string;
  emailPatt: RegExp | string;
  passwordPatt: RegExp | string;

  constructor(private router: Router, 
    private helper: HelpersService,
    private auth: AuthService) { 
      this.phoneNum = this.helper.getPatteren('phone');
      this.emailPatt = this.helper.getPatteren('email');
      this.passwordPatt = this.helper.getPatteren('password');
    }

  ngOnInit() {

    this.auth.isLogedIn.subscribe(
      (logged) => {
        (logged) ? this.router.navigate(['/']) : this.formInit();
      });
  }

  onSubmit() {
    
    if (this.regiter.valid) {
      /****** handel form inputs *****/
      let formInputes = this.regiter;
      let details = formInputes.value; 

      this.regisSubs = this.auth.register(details)
      .subscribe((user: Admin | User) => {
        console.log(user);
        if(user['status']){
          let title = "הרשמה",
                body = "נרשמת לאתר בהצלחה";

          this.helper.notifyMsg().success(body, title, {positionClass: "toast-bottom-left"});
          decodeURIComponent(location.pathname) == "/register"? this.router.navigate(['/']): $('.close').click();
        }
      });
    }
  }

  get f() { return this.regiter.controls; }

  private formInit() {
    this.regiter = new FormGroup({
      "name": new FormControl(null),
      'email': new FormControl(null),
      'password': new FormControl(null),
      'passwordConfirm': new FormControl(null),
      "city": new FormControl(null),
      'area': new FormControl(null),
      'tel': new FormControl(null),
      'about': new FormControl(null),
    }); 
  }

  backToLogin(){
    $('.close').click();
    this.ldComp('login', {
      from_path: location.pathname,
      url: "login",
      type: 'user'
    });
  }

  ngOnDestroy(){
    if(this.regisSubs) this.regisSubs.unsubscribe();
  }
}

