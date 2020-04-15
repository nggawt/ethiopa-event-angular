import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpService } from '../../services/http-service/http.service';
import { FormProccesorService } from 'src/app/customers/form-proccesor.service';
import { HttpParams } from '@angular/common/http';
// import { filter, tap, first } from 'rxjs/operators';
declare let $: any;


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  regiter: FormGroup;

  params = {
    id: 'rgister',
    modelSize: 'modal-lg',
    title: "הרשמה"
  };

  phoneNum: any = '^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})';
  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  passwordPatt: string = '^\\w{6,}$';

  constructor(private router: Router, private http: HttpService, private valForm: FormProccesorService) { }

  ngOnInit() {
    this.http.isLogedIn.subscribe(
      (logged) => {
        (logged) ? this.router.navigate(['/']) : this.formInit();
      }
    );
  }

  onSubmit() {
    console.log("register");
    
    if (this.regiter.valid) {
      /****** handel form inputs *****/
      let formInputes = this.regiter;
      let details = formInputes.value;

      /* let formInputes = this.regiter;
      let controls = formInputes.controls;
      
      
      let items = this.valForm.validate(controls, formInputes.value);
      let success = items['status'] ? items['success'] : false; */
      const theUrl = "http://lara.test/api/register";
      if (this.regiter.valid) {
        const body = new HttpParams()
          .set('name', details['name'])
          .set('email', details['email'])
          .set('password', details['password'])
          .set('passwordConfirm', details['passwordConfirm'])
          .set('city', details['city'])
          .set('area', details['area'])
          .set('tel', details['tel'])
          .set('about', details['about']);

        this.http.store(theUrl, body).
          subscribe(evt => {
            console.log(evt);
            
            if (evt['access_token']) {
              this.http.nextIslogged(true);
              // location.reload();
              this.router.navigate(['/']);
            }

          }, (err) => console.log(err));
      } else {
        /* messages errors */
        // console.log(items['errors']);

      }
    }
  }

  get f() { return this.regiter.controls; }

  private formInit() {
    this.regiter = new FormGroup({
      "name": new FormControl(null),
      'email': new FormControl(null),
      'password': new FormControl(null),
      'passwordConfirm': new FormControl(null),
      "city": new FormControl(null),
      'area': new FormControl(null),
      'tel': new FormControl(null),
      'about': new FormControl(null),
    });

    
    /* 
         let md = $('#forgotPassword').modal();
        let thiz = this;
        md.on('hidden.bs.modal', function (e) {
    
          // thiz.router.navigate(["/"]);
          console.log(this);
          md.modal('hide');
    
          return e.preventDefault();
        }); */
  }
}

