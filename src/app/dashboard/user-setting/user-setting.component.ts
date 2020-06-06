import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { HelpersService } from 'src/app/services/helpers/helpers.service';
import { Admin, AdminUser } from 'src/app/types/admin-type';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.css', '../../styles/validate.css']
})
export class UserSettingComponent implements OnInit {

  @Input() admin: AdminUser;
  emailPatteren: RegExp | string;
  formSetting: FormGroup;
  messages: {} | any;

  /***************  ********************/
  constructor(private http: HttpService, private helper: HelpersService) { }

  ngOnInit() { 
    this.emailPatteren = this.helper.getPatteren('email');
    console.log(this.admin);
      this.admin = (this.admin && this.admin.user)? this.admin.user: this.admin? this.admin: this.admin;
    if(this.admin && this.admin.user){
      this.initFormSetting();
    }
  }

  initFormSetting() {

    this.formSetting = new FormGroup({
      'changePassword': new FormGroup({
        'email': new FormControl(this.admin.user['email'], [Validators.required]),
        'currentPassword': new FormControl(null, [Validators.required]),
        'newPassword': new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
        'passwordConf': new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
      }),
      'changeEmail': new FormGroup({
        'currentEmail': new FormControl(this.admin.user['email'], [Validators.required]),
        'newEmail': new FormControl(null, [Validators.required]),
        'passwordEmail': new FormControl(null, [Validators.required]),
      }),
      'deleteAccount': new FormGroup({
        'delAccountEmail': new FormControl(this.admin.user['email'], [Validators.required]),
        'accountPassword': new FormControl(null, [Validators.required]),
        'feedback': new FormControl(null),
      })
    });
  }

  formSt(formGroups) {

    let itemsGroup = this.formSetting.controls[formGroups.id];

    const theUrl = "admins/" + this.admin.user["id"];

    const actionUri: string | boolean = (formGroups.id == "changeEmail") 
          ? "change_email" : (formGroups.id == "changePassword") 
          ? "change_password" : false;
          
    let method = actionUri ? 'PATCH' : (formGroups.id == "deleteAccount") ? "DELETE" : false;
    let url = actionUri ? theUrl + "/" + actionUri : theUrl;

    url = url + "?_method=" + method;

    console.log("id: ", formGroups.id, "form ", itemsGroup, " url: ", url);

    if (itemsGroup.valid && url) {
      this.send(itemsGroup.value, url);
    }
  }

  send(body: {}, url: string) {

    this.http.postData(url, body)
      .subscribe(evt => {

        console.log(evt);
      }, (err) => {
        console.log(err);

      });
  }

  onSubmit(){
    alert("onSubmit fn need to implement");
  }

  displayMessages(messages?: string){
    alert("displayMessages fn need to implement");
  }
}
