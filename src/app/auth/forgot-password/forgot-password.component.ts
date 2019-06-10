import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private router: Router) { }

  ngOnInit() {
    this.initRestPasswordForm();
  }

  initRestPasswordForm() {

    this.sendResetPasswordToEmail = new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required])
    });
    this.md = $('#forgotPassword').modal();
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



