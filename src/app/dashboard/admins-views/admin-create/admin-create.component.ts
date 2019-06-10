import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
import { FormProccesorService } from 'src/app/customers/form-proccesor.service';
import { Location } from '@angular/common';

declare var $;

@Component({
  selector: 'app-admin-create',
  templateUrl: './admin-create.component.html',
  styleUrls: ['./admin-create.component.css']
})
export class AdminCreateComponent implements OnInit {

  logInform: FormGroup;
  phoneNum: any = '^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})';
  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  passwordPatt: string = '^\\w{6,}$';

  loginUrl = "admin-login";
  md;
  
  constructor(private router: Router, 
    private http: HttpService, 
    private valForm: FormProccesorService,
    private route: ActivatedRoute,
    private loc: Location) {}

  ngOnInit() {
    /* this.http.isLogedIn.subscribe(
      (logged) => {
        logged? this.router.navigate(['/']): this.formInit();
      }
    ); */
    this.formInit();

    let thiz = this;
    $(document).on('hidden.bs.modal','.modal', function () {

      /// TODO EVENTS
      console.log("called create method ", thiz.http.requestUrl);
      thiz.http.requestUrl? thiz.router.navigate([thiz.http.requestUrl]): thiz.router.navigate([thiz.router.url.split('/create')[0]]);//, {relativeTo: this.route}
      
      // console.log(thiz.loc.normalize(thiz.loc.path()));
      // thiz.loc.replaceState(thiz.loc.path());
      // thiz.loc.back()
      //thiz.loc.getState()['navigationId'] >= 2? thiz.loc.back():
        // thiz.router.navigate(['../'], {relativeTo: this.route});
      });
  }
  onSubmit(){

    if(this.logInform.valid){
      /****** handel form inputs *****/
      let formInputes = this.logInform;
      let details = formInputes.value;
    
      /* let formInputes = this.logInform;
      let controls = formInputes.controls;
      
      
      let items = this.valForm.validate(controls, formInputes.value);
      let success = items['status'] ? items['success'] : false; */
      const theUrl = "http://ethio:8080/api/admin-register";
      if(this.logInform.valid){
        const body = new HttpParams()
          .set('name', details['name'])
          .set('email', details['email'])
          .set('password', details['password'])
          .set('passwordConfirm', details['passwordConfirm'])
          .set('admin_type', details['admin_type']);

        this.http.store(theUrl, body).
          subscribe(evt => {
          console.log(evt);
          
          if(evt['access_token']){
            this.http.nextIslogged(true);
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

  get f() { return this.logInform.controls; }

  private formInit(){
    this.logInform = new FormGroup({
      "name": new FormControl(null),
      'email': new FormControl(null),
      'password': new FormControl(null),
      'passwordConfirm': new FormControl(null),
      'admin_type': new FormControl(""),
    });
    this.md = $('#forgotPassword').modal();
  }
}
