import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
import { FormProccesorService } from 'src/app/customers/form-proccesor.service';
declare var $:any;

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {

  userCreate: FormGroup;

  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  passwordPatt: string = '^\\w{6,}$';

  
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
    console.log("Create Events Component called!");
    
    this.formInit();
  }

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

    $('#forgotPassword').modal();
    let thiz = this;
    $(document).on('hidden.bs.modal','.modal', function () {
      /// TODO EVENTS
      thiz.http.requestUrl? thiz.router.navigate([thiz.http.requestUrl]): thiz.router.navigate(['../'], {relativeTo: this.route});
    });
  }
}
