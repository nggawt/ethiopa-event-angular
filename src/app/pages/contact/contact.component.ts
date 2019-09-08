import { Component, OnInit, Input, OnChanges, AfterContentInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service/http.service';
import { ValidationService } from 'src/app/services/validation/validation.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { Router, ActivatedRoute } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css', '../../styles/validate.css']
})
export class ContactComponent implements OnInit, OnDestroy {

  phonePatteren: RegExp = /^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})/;
  emailPatteren: RegExp = /^[a-z]+[a-zA-Z_\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$/;

  @Input() mailProps: {
    id: string,
    url: string,
    nameTo: string | boolean,
    emailTo: string | boolean,
    modalSize: string,
    title: string
  };

  formConcat: FormGroup;
  constructor(
    private fmValidor: ValidationService,
    private http: HttpService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.initFormConcat();
  }

  initFormConcat() {

    this.formConcat = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.min(3), Validators.max(40)]),
      email: new FormControl(null, [Validators.required]),
      phone: new FormControl(null),
      city: new FormControl(null, [Validators.min(3), Validators.max(40)]),
      area: new FormControl(null, [Validators.required, Validators.min(3), Validators.max(40)]),
      subject: new FormControl(null, [Validators.required, Validators.min(6), Validators.max(90)]),
      message: new FormControl(null, [Validators.required, Validators.min(6), Validators.max(255)]),//, this.same
    });
  }

  onSubmit() {
    
    if (this.formConcat.valid) {
      const theUrl = "contact";
      this.send(this.formConcat.value, false, theUrl);
    } else {
      console.log(this.formConcat);
    }
  }

  getStl(input) {
    console.log(input);

    let ngClassResualt = (input.valid && input.touched && input.dirty) ? 'border border-success' : (input.touched && input.dirty) ? 'border border-danger' : false;
    if (ngClassResualt) return ngClassResualt;
  }

  send(body, method?: string | boolean, urlArg?: string) {

    let url = urlArg ? urlArg : "http://ethio:8080/api/events";
    let requestUrl = method ? urlArg + "?_method=" + method : url;// (! urlArg)? url + "/" + this.currentEvt["id"] + "?_method=" + method:

    this.http.postData(requestUrl, body)
      .subscribe(evt => {

        console.log('requestUrl: ', requestUrl, ' request: ', evt);
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

  validateForm(form: FormGroup): any {
    let invalid = form.valid ? true : false;
    console.log(form);
    console.log(invalid);

    return invalid ? { invalid: true } : null;
  }

  same(val: FormControl): { [s: string]: boolean } | null {
    // console.log(val);
    if (false) {
      return { "dfdf": true };
    }
    return null;
  }

  ngOnDestroy() {
    // this.http.requestUrl = false;
  }
}
