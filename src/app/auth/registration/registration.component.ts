import { Admin } from 'src/app/types/admin-type';
import { User } from 'src/app/types/user-type';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/http-service/auth.service';
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

  phoneNum: any = '^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})';
  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  passwordPatt: string = '^\\w{6,}$';

  constructor(private router: Router, 
    private auth: AuthService) { }

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
        if (user['user'] || user['admin']) decodeURIComponent(location.pathname) == "register"? this.router.navigate(['/']): $('.close').click();
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

