import { Component, OnInit, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { HttpService } from '../../services/http-service/http.service';
import { Observable, of } from 'rxjs';
import { first, filter, tap, map, skipWhile } from 'rxjs/operators';
import { CustomersDataService } from '../../customers/customers-data-service';
import { User } from '../../types/user-type';
declare let $:any;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  /*********Log-in props *********/
  phoneNum: any = '^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})';
  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  passwordPatt: string = '\\w{6,}$';

  private url:string;
  logInform: FormGroup;
  resetPassword: FormGroup;
  sendResetPasswordToEmail: FormGroup;

  @ViewChild('logInTemplate', {static: true}) logInTemplate;
  @ViewChild('sendResetEmailTemplate', {static: true}) sendResetEmailTemplate; 
  @ViewChild('sendResetPasswordTemplate', {static: true}) sendResetPasswordTemplate; 

  private resetPass:boolean = false;
  formType: any;
  token: string | boolean;
  userProfil:string;
  customerPage: string | boolean;
 /*********Header props *********/
  auth: Observable<boolean>;
  msgTo;

  @Input() loginTo;

  user$: Observable<User | boolean> ;

  constructor(
    private http: HttpService, 
    private router: Router, 
    private route: ActivatedRoute) {}

  ngOnInit() {
    // if(this.model) this.model .click();
    // if(! this.model) this.model = $('#forgotPassword').modal();
    // let thiz = this;
    // let md = this.model;
    // console.log(this.model);
    // this.model.on('hidden.bs.modal', function (e) {

    //   // thiz.router.navigate(["/"]);
    //   console.log(this);
    //   md.modal('dispose');

    //   return e.preventDefault();
    // });
  }


  currentForm(){
    let token = this.route.snapshot.queryParamMap['params']['token'];
    let loc = decodeURIComponent(location.href).split("?token=")[1];
    let token1 = this.route.snapshot.paramMap.get('token');
    const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;

    this.token = loc? loc: false;
    let rspurl = this.url.split("/password/")[1];
    
    if(loc && loc.length == 64 && (rspurl == "email" || rspurl == "email/")){
      this.initResetPasswordForm();
      // console.log($('#myFormModel'));
      
      this.formType = this.sendResetPasswordTemplate;
      setTimeout(() =>{
        $('#myFormModel').modal();

      }, 500)
    }else{
      this.formType = this.logInTemplate;
      this.initFormLogin();
    } 
  }
  
  logIn(){
    this.url = decodeURIComponent(location.pathname);
    // console.log(this.url);
    // console.log($('#myFormModel'));

    if(this.resetPass) this.resetPass = false;
     
    this.formType = this.logInTemplate;
    this.initFormLogin();
    $('#myFormModel').modal();
  } 

  private initFormLogin(){
   
    this.logInform = new FormGroup({
      "name": new FormControl(null, [Validators.required]),
      'logInEmail': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required])
    });
    
    // this.formType = 'logIn';
  }
  
  sendReset(){
    console.log("called!");
    this.sendResetPasswordToEmail = new FormGroup({
      "name": new FormControl(null, [Validators.required]),
      'logInEmail': new FormControl(null, [Validators.required])
    });
    this.resetPass = true;
    this.formType = this.sendResetEmailTemplate;
    // this.formType = this.sendResetEmailTemplate;
  }

  initResetPasswordForm(){
    
    this.resetPassword = new FormGroup({
      "name": new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required]),
      'newPassword': new FormControl(null, [Validators.required]),
      'password_conf': new FormControl(null, [Validators.required]),
    });
    // this.formType = 'resetPassword';
    // $('#myFormModel').modal();
  }

  logOut(){
    this.url = decodeURIComponent(location.pathname);

    this.http.logOut().subscribe(evt =>{
      console.log(evt);
      
      // location.reload();
    });
    this.user$ = of(false);
    this.redirect();
  }

  redirect(){
    let splitUrl:any = ( this.url.indexOf('halls-events') >= 0)?  this.url.split("/"): false;
        splitUrl = (splitUrl && (splitUrl[1] && splitUrl[2])) ?  splitUrl[1]+"/"+splitUrl[2] :(splitUrl && splitUrl[1])? splitUrl[1]: "/";
        this.router.navigate([splitUrl], { relativeTo: this.route });
  }

  onSubmit() {
    console.log(this.loginTo);
    
    this.url = decodeURIComponent(location.pathname);
    if (this.logInform.valid) {
      console.log(this.logInform.value);
      
      this.http.logIn(this.logInform.value).
        subscribe(evt => {
          console.log(evt);
          this.user$ = of(evt['user']);
          let redirectUrl = this.http.intendedUri? this.http.intendedUri: this.url? this.url: "/";
          if(evt['user']) this.setUrlProfile(evt['user']);
          if(evt['user'] && evt['user']['customer']) this.setUrlPage(evt['user']['customer']);
          // this.router.navigate([redirectUrl]);
          $('.close').click();
          // location.reload();
        },
        (err) => {
          // this.http.nextIslogged(false);
          console.log(err);
        });
    }
  }

  sendPasswordResetEmail(){
    console.log(this.logInform);
    // this.logInform.controls.
    // resetPassword
    this.url = decodeURIComponent(location.pathname);
    if (this.sendResetPasswordToEmail.valid) {
      
      this.http.sendResetPassword(this.sendResetPasswordToEmail.value).
        subscribe(evt => {
          console.log(evt);
          
          // let redirectUrl = this.http.intendedUri? this.http.intendedUri: this.url? this.url: "/";
          // if(evt['user']) this.setUrlProfile(evt['user']);
          // if(evt['user'] && evt['user']['customer']) this.setUrlPage(evt['user']['customer']);
          // this.router.navigate([redirectUrl]);
          $('.close').click();
          // location.reload();
        },
        (err) => {
          // this.http.nextIslogged(false);
          console.log(err);
        });
    }
  }

  register(){
    $('.close').click(); 
    this.router.navigate(['/register']);
  }
  
  getForm(theForm) { 
    console.log(theForm);
    return theForm.controls;
   }

  f() { return this.logInform.controls; }

  reset(){
    console.log(this.resetPassword);
    let values = this.resetPassword.value;
    values['token'] = this.token;
    // values['token'] = this.route.snapshot.queryParamMap['params']['token'];

    if (this.resetPassword.valid && this.token) {
      console.log("sending");
      console.log(this.resetPassword.value);
      this.http.resetPassword(values).
        subscribe(evt => {
          console.log(evt);
          
          let redirectUrl = this.http.intendedUri? this.http.intendedUri: this.url? this.url: "/";
          if(evt['user']) this.setUrlProfile(evt['user']);
          if(evt['user'] && evt['user']['customer']) this.setUrlPage(evt['user']['customer']);
          this.router.navigate(['/']);
          $('.close').click();
          // location.reload();
        },
        (err) => {
          // this.http.nextIslogged(false);
          console.log(err);
        });
    }
    
  }
  private setUrlPage(customer){
    
    let compNameTrimed = customer['company'].trim(),
        bTypeTrimed = customer['businessType'].trim(),
        compName = (compNameTrimed.split(' ').length > 1)? this.appendSelashBetweenSpace(compNameTrimed, ' '):customer['company'],
        businessType = (bTypeTrimed.split(' ').length > 1)? this.appendSelashBetweenSpace(bTypeTrimed, ' '):customer['businessType'];

    return "customers/"+businessType+"/"+compName;
  }

  private setUrlProfile(obj){
    return "/users/"+obj['name'];
  }

  appendSelashBetweenSpace(text, delimiter?){
    let str:string;
    delimiter = delimiter? delimiter: " ";
    text.split(delimiter).forEach(element => {
      (str)? (element != "")? str += "-" + element: '': (element != "")? str = element: '';
    });
    return str;
  }

}
