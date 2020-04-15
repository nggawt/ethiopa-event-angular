import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service/http.service';
import { HttpParams } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css', '../../../styles/validate.css']
})
export class UserCreateComponent implements OnInit {

  userCreate: FormGroup;

  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  passwordPatt: string = '^\\w{6,}$';

  mdProps = {
    id: 'create_user',
    modalSize: "modal-md",
    name: "משתמש",
    emailTo: "",
    title: 'צור משתמש'
  };

  constructor(private http: HttpService) { }

  ngOnInit() {  this.formInit(); }

  get f() { return this.userCreate.controls; }

  private formInit() {
    this.userCreate = new FormGroup({
      "name": new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'email': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'passwordConfirm': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      "city": new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'area': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'tel': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'about': new FormControl(null, [Validators.required, Validators.minLength(3)]),
    });
  }

  onSubmit() {
    console.log("create user");

    /****** handel form inputs *****/

    if (this.userCreate.valid) {
      const theUrl = "http://lara.test/api/users";

      this.http.store(theUrl, this.userCreate.value).
        subscribe(evt => {
          console.log(evt);

            // $(".close").click();
        }, (err) => console.log(err));
    } else {
      /* messages errors */
      // console.log(items['errors']);
    }
  }
}
