import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
import { NgValidateSrvService } from 'src/app/services/validators/ng-validate-srv.service';

declare var $: any;

@Component({
  selector: 'app-admin-registration',
  templateUrl: './admin-registration.component.html',
  styleUrls: ['./admin-registration.component.css']
})
export class AdminRegistrationComponent implements OnInit {

  regiter: FormGroup;
  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  passwordPatt: string = '^\\w{6,}$';

  mdProps = {
    id: 'admin_regiter',
    modalSize: "modal-md",
    name: "אדמין",
    emailTo: "",
    title: 'אדמין הרשמה'
  };

  constructor(private router: Router,
    private http: HttpService,
    private route: ActivatedRoute,
    private ngVal: NgValidateSrvService) { }

  ngOnInit() {
    /* this.http.isLogedIn.subscribe(
      (logged) => {
        logged? this.router.navigate(['/']): this.formInit();
      }
    ); */
    this.formInit();
  }

  get f() { return this.regiter.controls; }

  private formInit() {
    this.regiter = new FormGroup({
      "name": new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(5)]),
      'passwordConfirm': new FormControl(null, [Validators.required, Validators.minLength(5)]),
      'authority': new FormControl("", [Validators.required, Validators.max(3)]),
    });
  }

  onSubmit() {
    
    /****** handel form inputs *****/
    if (this.regiter.valid) {
      let formInputes = this.regiter;
      let details = formInputes.value;

      const theUrl = "http://lara.test/api/admin-register";
      if (this.regiter.valid) {
        const body = new HttpParams()
          .set('name', details['name'])
          .set('email', details['email'])
          .set('password', details['password'])
          .set('passwordConfirm', details['passwordConfirm'])
          .set('authority', details['authority']);

        this.http.store(theUrl, body).
          subscribe(evt => {
            console.log(evt);

            if (evt['access_token']) {
              // this.http.nextIslogged(true);
              $(".close").click();
              // location.reload();
              // this.router.navigate(['/']);
            }

          }, (err) => console.log(err));
      } else {
        /* messages errors */
        // console.log(items['errors']);

      }
    }
  }

 /*  onSubmit() {

    console.log(this.formGr, this.itemData.id);
    let validItems = this.ngVal.getValidatedItems(this.formGr),
      validInputs = Object.keys(validItems.inputs).length ? validItems.inputs : false;
      validInputs ? this.send(validInputs, 'PUT') : console.log('Please fill valid form');
  }

  send(items: { [key: string]: string }, method: string): void {

    let url = 'admins/' + this.itemData.id + '?_method=' + method;
    this.http.postData(url, items).subscribe(response => {
      console.log('response: ', response);
    });
  } */
}
