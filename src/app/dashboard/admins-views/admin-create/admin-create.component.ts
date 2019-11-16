import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
import { FormProccesorService } from 'src/app/customers/form-proccesor.service';
import { Location } from '@angular/common';

declare var $;

@Component({
  selector: 'app-admin-create',
  templateUrl: './admin-create.component.html',
  styleUrls: ['./admin-create.component.css', '../../../styles/validate.css']
})
export class AdminCreateComponent implements OnInit {

  regiter: FormGroup;
  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  passwordPatt: string = '^\\w{6,}$';

  mdProps = {
    id: 'create_admin',
    modalSize: "modal-md",
    name: "אדמין",
    emailTo: "",
    title: 'צור אדמין'
  };
  
  constructor(
    private http: HttpService, ) {}

  ngOnInit() { this.formInit(); }

  get f() { return this.regiter.controls; }

  private formInit(){
    this.regiter = new FormGroup({
      "name": new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'email': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'passwordConfirm': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'authority': new FormControl("", [Validators.required, Validators.max(3)]),
    });
  }

  onSubmit(){
    console.log(this.regiter);
    
    if(this.regiter.valid){
      /****** handel form inputs *****/
      let formInputes = this.regiter;
      let details = formInputes.value;
    
      /* let formInputes = this.regiter;
      let controls = formInputes.controls;
      
      
      let items = this.valForm.validate(controls, formInputes.value);
      let success = items['status'] ? items['success'] : false; */
      // const theUrl = "http://ethio:8080/api/admin-register";
      
      const theUrl =  "http://ethio:8080/api/admins";
      if(this.regiter.valid){
        const body = new HttpParams()
          .set('name', details['name'])
          .set('email', details['email'])
          .set('password', details['password'])
          .set('passwordConfirm', details['passwordConfirm'])
          .set('authority', details['authority']);

        this.http.store(theUrl, body).
          subscribe(evt => {
          console.log(evt);
          
          if(evt['access_token']){
            this.http.nextIslogged(true);
            $(".close").click();
            // location.reload();
            // this.router.navigate(['/']);
          }

        },(err) => console.log(err));
      }else{
        /* messages errors */
        // console.log(items['errors']);
        
      }
    }
  }
}
