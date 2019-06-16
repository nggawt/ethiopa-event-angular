import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service/http.service';
import { ValidationService } from 'src/app/services/validation/validation.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  @Input() sendMessageTo;
  
  messages: object | boolean;
  formConcat: FormGroup;
  constructor(private fmValidor: ValidationService,private http: HttpService) { }

  ngOnInit() {

    this.initFormConcat();
  }
  
  initFormConcat(){

    this.formConcat = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      phone: new FormControl(null),
      city: new FormControl(null),
      area: new FormControl(null),
      msg_subject: new FormControl(null, [Validators.required]),
      message: new FormControl(null, [Validators.required]),//, this.same
    }/* ,
    {
      validators: this.validateForm
    } */);
  }

  onSubmit(){
    console.log(this.formConcat);
    let controls = this.formConcat.controls;

    // const theUrl = "http://ethio:8080/api/contact/"+this.user["id"];
    const theUrl = "http://ethio:8080/api/contact";

    /* 
      password: "required|string|min:6|max:30",
      passwordConf: "required|string|password|same|min:6|max:30",
    */

    let rules: object = {
      name: "required|string|min:3|max:30",
      email: "required|string",
      city: "required|string|min:3|max:30",
      area: "required|string|min:3|max:30",
      phone: "required",
      msg_subject: "required|string|min:6|max:30",
      message: "required|string|min:6|max:255",
    };

    let validatedItems =  this.fmValidor.validate(controls, rules);
    console.log(validatedItems);
    if(validatedItems['status']) this.send(validatedItems['success'], false, theUrl);

  }

  getStl(input){
    console.log(input);
    
    let ngClassResualt = (input.valid && input.touched && input.dirty)?'border border-success': (input.touched && input.dirty)? 'border border-danger': false;
    if(ngClassResualt) return  ngClassResualt;
  }

  send(body, method?:string | boolean, urlArg?:string) {
    let url = urlArg? urlArg:"http://ethio:8080/api/events";
    let requestUrl = method ? urlArg+"?_method=" + method : url;// (! urlArg)? url + "/" + this.currentEvt["id"] + "?_method=" + method:
    console.log(requestUrl);
    
    this.http.postData(requestUrl, body)
      .subscribe(evt => {

        console.log(evt);
        let msgs = this.fmValidor.getMassages(evt);
        console.log(msgs);
        this.messages = msgs;
        //this.resetMessages();

      }, (err) => {

        console.log(err);
        if (err["status"] === 401) {
          this.http.nextIslogged(false);
          window.localStorage.removeItem('user_key');
          window.location.reload();
        }
      });
  }

  validateForm(form: FormGroup): any{
    let invalid = form.valid? true: false;
    console.log(form);
    console.log(invalid);
    
    return invalid? {invalid: true}: null;
  }
  
  same(val: FormControl): {[s: string]: boolean} | null{
    // console.log(val);
    if(false){
      return {"dfdf": true};
    }
    return null;
  }
}
