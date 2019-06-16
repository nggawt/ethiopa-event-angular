import { Component, OnInit, Input } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../../services/http-service/http.service';
import { first } from 'rxjs/operators';
import { Location } from '@angular/common';
// import { of } from 'rxjs';
// import { filter, tap, first } from 'rxjs/operators';
declare let $: any;


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  logInform: FormGroup;
  phoneNum: any = '^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})';
  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  passwordPatt: string = '^\\w{6,}$';
  isTrue = true;
  md;

  url:string;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpService, private loc:Location) { }

  ngOnInit() {

    // this.http.isAuthenticeted().pipe(first()).subscribe(
    //   (res) => {
    //     if(!res){
    //       this.model = $('#myFormModel').modal();
    //       this.formInit();
    //     }else{
    //       this.router.navigate(['/halls_events']);
    //     }
    //   }
    // );
    
    this.initFormLogin();
    let thiz = this;

    $(document).on('hidden.bs.modal','.modal', function () {

      /// TODO EVENTS
      thiz.http.requestUrl? thiz.router.navigate([thiz.http.requestUrl]): thiz.router.navigate(['../'], {relativeTo: this.route});
    });
  }

  private initFormLogin() {

    this.logInform = new FormGroup({
      "name": new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required])
    });
    $('#forgotPassword').modal();
  }

  logOut(){
    this.url = decodeURIComponent(location.pathname);

    this.http.logOut().subscribe(evt =>{
      console.log(evt);
      // location.reload();
    });
    // this.user$ = of(false);
    this.redirect();
  }

  redirect(){
    let splitUrl:any = ( this.url.indexOf('halls-events') >= 0)?  this.url.split("/"): false;
        splitUrl = (splitUrl && (splitUrl[1] && splitUrl[2])) ?  splitUrl[1]+"/"+splitUrl[2] :(splitUrl && splitUrl[1])? splitUrl[1]: "/";
        this.router.navigate([splitUrl], { relativeTo: this.route });
  }

  onSubmit() {

    if (this.logInform.valid) {
      // this.isTrue = false;
      console.log(this.logInform.value);
      
      this.http.logIn(this.logInform.value).
        subscribe(evt => {

          let IntendedUri = this.http.intendedUri ? this.http.intendedUri : "/";
          console.log(evt);
          this.router.navigate([IntendedUri]);
          $('.close').click();

        }, (err) => {
          // this.isTrue = true;
          console.log(err);
        });
    }
  }

  register(path) {
    $('.close').click();
    // this.md.modal('hide');
    this.router.navigate([path]);
  }

  sendEmail(path){
    $('.close').click();
    // this.md.modal('hide');
    this.router.navigate([path]);
  }

  get f() { return this.logInform.controls; }

}
