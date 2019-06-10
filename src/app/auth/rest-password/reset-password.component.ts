import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service/http.service';
import { ActivatedRoute, Router } from '@angular/router';
declare var $;

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';

  resetPassword: FormGroup;

  token: string | boolean;
  private url: string;

  constructor(
    private http: HttpService, 
    private router: Router, 
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.initRestPasswordForm();
    console.log("reset");
    
  }

  initRestPasswordForm() {

    this.resetPassword = new FormGroup({
      "name": new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required]),
      'password_confirmation': new FormControl(null, [Validators.required]),
    });
    
  }



  onSubmit() {
    // let param = this.route.snapshot.queryParamMap['params'];
    console.log("sending");
    let values = this.resetPassword.value;
    values['token'] = this.route.snapshot.queryParamMap['params']['token'];
    if (this.resetPassword.valid && values['token']) {
      console.log("sending");
      console.log(this.resetPassword.value);
      this.sendPasswordResetEmail(values);
    }
  }

  sendPasswordResetEmail(values) {
    console.log(this.resetPassword);
    // this.resetPassword.controls.
    // resetPassword
    let url = decodeURIComponent(location.pathname);


    this.http.resetPassword(values).
      subscribe(evt => {
        console.log(evt);

        // let redirectUrl = this.http.IntendedUri? this.http.IntendedUri: this.url? this.url: "/";
        // if(evt['user']) this.setUrlPrpfile(evt['user']);
        // if(evt['user'] && evt['user']['customer']) this.setUrlPage(evt['user']['customer']);
        // this.router.navigate([redirectUrl]);
        // $('.close').click();
        // location.reload();
      },
        (err) => {
          // this.http.nextIslogged(false);
          console.log(err);
        });
  }

  // f() { return this.logInform.controls; }

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
