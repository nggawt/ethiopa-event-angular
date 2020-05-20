import { AuthService } from 'src/app/services/http-service/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
declare var $;

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  emailPatteren: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';

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
    private route: ActivatedRoute) { }

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

    // $('#forgotPassword').modal();

    // let thiz = this;
    // $(document).on('hidden.bs.modal', '.modal', function () {

    //   /// TODO EVENTS
    //   console.log(thiz.http.requestUrl);
    //   thiz.http.requestUrl ? thiz.router.navigate([thiz.http.requestUrl]) : thiz.router.navigate(['../'], { relativeTo: this.route });
    // });
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
        if (user['user'] || user['admin']) decodeURIComponent(location.pathname) == "/pssword/email"? this.router.navigate(['/']): $('.close').click();
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
