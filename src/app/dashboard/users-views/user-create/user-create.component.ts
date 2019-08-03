import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
import { FormProccesorService } from 'src/app/customers/form-proccesor.service';
import { HttpParams } from '@angular/common/http';

declare var $: any;

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
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
  
  constructor(private router: Router, 
    private http: HttpService, 
    private valForm: FormProccesorService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    /* this.http.isLogedIn.subscribe(
      (logged) => {
        logged? this.router.navigate(['/']): this.formInit();
      }
    ); */
    console.log("create user");
    this.formInit();
  }

  /* ngAfterViewInit(){
    let model = $('#'+this.modelProps.id).modal();
    let thiz = this;
    $(document).on('hidden.bs.modal', model, function (e) {

      /// TODO EVENTS
      if (this.mailProps && this.mailProps.id) {
        console.log("requestUrl: ", thiz.http.requestUrl, 'element: ', e.target, 'id: ', this.mailProps.id);
        thiz.http.requestUrl ? thiz.router.navigate([thiz.http.requestUrl]) :
          thiz.router.navigate(['../'], { relativeTo: thiz.route });
        // console.log(thiz.http.requestUrl);
        if ($(model).is(':hidden')) {
          thiz.http.requestUrl = false;
          $(document).off('hidden.bs.modal');
          return e.preventDefault()
        }
      }
    });
  } */

  onSubmit(){
    console.log("create user");
    if(this.userCreate.valid){
      /****** handel form inputs *****/
      let formInputes = this.userCreate;
      let details = formInputes.value;
      console.log(this.userCreate.valid);
      
      /* let formInputes = this.userCreate;
      let controls = formInputes.controls;
      
      
      let items = this.valForm.validate(controls, formInputes.value);
      let success = items['status'] ? items['success'] : false; */
      const theUrl = "http://ethio:8080/api/users";
      if(this.userCreate.valid){
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

  get f() { return this.userCreate.controls; }

  private formInit(){
    this.userCreate = new FormGroup({
      "name": new FormControl(null),
      'email': new FormControl(null),
      'password': new FormControl(null),
      'passwordConfirm': new FormControl(null),
      "city": new FormControl(null),
      'area': new FormControl(null),
      'tel': new FormControl(null),
      'about': new FormControl(null),
    });
  }
}
