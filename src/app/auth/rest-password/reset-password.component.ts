import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HelpersService } from 'src/app/services/helpers/helpers.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';


declare var $;

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  emailPatteren: RegExp | string;
  passwordPatt: RegExp | string;

  resetPassword: FormGroup;
  resetSubscription:Subscription;

  token: string | boolean;
  private url: string;

  params = {
    id: 'resetPassword',
    modelSize: 'modal-md',
    title: "שנה סיסמה"
  };

  constructor(
    private auth: AuthService,
    private router: Router,
    private helper: HelpersService,
    private route: ActivatedRoute) { 
      this.emailPatteren = this.helper.getPatteren('email');
      this.passwordPatt = this.helper.getPatteren('password');
    }

  ngOnInit() {
    this.initRestPasswordForm();
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

    let values = this.resetPassword.value;
    values['token'] = this.route.snapshot.queryParamMap['params']['token'];
    if (this.resetPassword.valid && values['token']) {

     this.resetSubscription = this.auth.resetPassword(values).
      subscribe(user => {
        console.log(user);
        // if (user['user'] || user['admin']) $('.close').click();
        if(user['status']){ 
          this.helper.notifyMsg().success("הסיסמה שונת בהצלחה!", "שיחזור סיסמה", {positionClass: "toast-bottom-left"});
          (decodeURIComponent(location.pathname) == "/pssword/email")? this.router.navigate(['/']): '';
          $('.close').click();
        }
      },
      (err) => {
        // this.http.nextIslogged(false);
        console.log(err);
      });
    }
  }


  // f() { return this.logInform.controls; }


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

  ngOnDestroy(){
    if(this.resetSubscription) this.resetSubscription.unsubscribe();
  }
}
