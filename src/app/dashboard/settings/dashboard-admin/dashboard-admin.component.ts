import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/services/http-service/http.service';
import { Router } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  admin$: Observable<{}>;
  phoneNum: RegExp = /^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})/;
  emailPatteren: string = '^[a-z]+[a-zA-Z_\\d\\.]*@[A-Za-z]{2,10}\\.[A-Za-z]{2,3}(?:\\.?[a-z]{2})?$';
  // emailPatteren: RegExp = /^[a-z]+[a-zA-Z_\d\.]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$/;
  datePattern: RegExp = /^\b((?=0)0[1-9]|(?=[1-9])[1-9]|(?=[1-2])[1-2][0-9]|(?=3)3[0-1])\-((?=0)0[1-9]|(?=[1-9])[1-9]|(?=1)1[0-2]?)\-20((?=1)19|(?=2)2[0-5])$/;//\d{2}\-\d{2}\-\d{4}
  timePattern: RegExp = /^\b((?=0)0[0-9]|(?=1)1[0-9]|(?=2)2[0-3])\:((?=0)0[0-9]|(?=1)1[0-9]|(?=[0-5])[0-5][0-9])$/;
  /***************  ********************/
  formSetting: FormGroup;
  constructor(private http: HttpService, private router:Router) { }

  ngOnInit() {
    this.admin$ = this.http.userObs.pipe(filter(item => typeof item == "boolean" || typeof item == "object"), tap(item => {
      console.log(item);
      this.initFormSetting();
    }));//.subscribe(user => console.log(user));takeWhile(item => typeof item == "boolean" || typeof item == "object"),
    // last
  }

  initFormSetting() {

    this.formSetting = new FormGroup({
      'changePassword': new FormGroup({
        'currentPassword': new FormControl(null, [Validators.required]),
        'newPassword': new FormControl(null, [Validators.required, Validators.minLength(6)]),
        'passwordConf': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      }),
      'changeEmail': new FormGroup({
        'currentEmail': new FormControl(null, [Validators.required]),
        'newEmail': new FormControl(null, [Validators.required]),
        'passwordEmail': new FormControl(null, [Validators.required]),
      }),
      'deleteAccount': new FormGroup({
        'delAccountEmail': new FormControl(null, [Validators.required]),
        'accountPassword': new FormControl(null, [Validators.required]),
        'feedback': new FormControl(null, [Validators.required]),
      })
    });
  }

  formSt(formGroups) {

    let itemsGroup = this.formSetting.controls[formGroups.id];
    let items = itemsGroup['controls'];
    console.log(itemsGroup);
    
  }
}
