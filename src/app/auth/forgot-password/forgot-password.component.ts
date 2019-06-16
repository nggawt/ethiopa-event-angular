import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
declare var $;
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  sendResetPasswordToEmail: FormGroup;
  md;

  constructor(private router: Router, private http: HttpService) { }

  ngOnInit() {
    this.initRestPasswordForm();
  }

  initRestPasswordForm() {

    this.sendResetPasswordToEmail = new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required])
    });
    $('#forgotPassword').modal();
    let thiz = this;
    $(document).on('hidden.bs.modal', '.modal', function () {

      /// TODO EVENTS
      console.log(thiz.http.requestUrl);
      thiz.http.requestUrl ? thiz.router.navigate([thiz.http.requestUrl]) : thiz.router.navigate(['../'], { relativeTo: this.route });
    });
  }

  register(path) {
    $('.close').click();
    // this.md.modal('hide');
    this.router.navigate([path]);
  }

  onSubmit() {
    console.log(this.sendResetPasswordToEmail);
  }
}



