import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service/http.service'; 
import { ResourcesService } from 'src/app/services/resources/resources.service';

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
    nameFrom: string | boolean,
    emailTo: string | boolean,
    modalSize: string,
    title: string
    inputs: {
      email_from: boolean,
      email_to: boolean,
      name: boolean,
      area: boolean,
      phone: boolean,
      city: boolean
    }
  };

  formConcat: FormGroup;
  constructor(private http: HttpService, private rsrv: ResourcesService) { }
  
  ngOnInit() {

    this.initFormConcat();
  }

  getInputs(all: string | boolean, only?: string) {
    let inputs = this.mailProps.inputs,
      emailFrom = inputs && typeof inputs.email_from == "string" ? inputs.email_from : null,
      emailTo = inputs && typeof inputs.email_to == "string" ? inputs.email_to : null;

    let inputsForm = {
      name: new FormControl(null, [Validators.required, Validators.min(3), Validators.max(40)]),
      email_from: new FormControl(emailFrom, [Validators.required]),
      email_to: new FormControl(emailTo, [Validators.required]),
      phone: new FormControl(null),
      city: new FormControl(null, [Validators.min(3), Validators.max(40)]),
      area: new FormControl(null, [Validators.required, Validators.min(3), Validators.max(40)]),
      subject: new FormControl(null, [Validators.required, Validators.min(6), Validators.max(90)]),
      message: new FormControl(null, [Validators.required, Validators.min(6), Validators.max(255)]),//, this.same
    };

    return (all && all == "all") ? inputsForm : inputsForm[only];
  }

  sendToInputs() {

    let inputsGroups = {},
      inputs = this.mailProps.inputs;

    for (let ii in inputs) {
      if (inputs[ii] && typeof inputs[ii] != "string") inputsGroups[ii] = this.getInputs(false, ii);
    }
    return inputsGroups;
  }

  initFormConcat() {
    let fGroupInputs = ! this.mailProps.inputs ? this.getInputs("all") : this.sendToInputs();
    console.log(fGroupInputs);
    this.formConcat = new FormGroup(fGroupInputs);
  }

  onSubmit() {

    if (this.formConcat.valid) {
      const theUrl = "contact";
      let valuesToSend = this.formConcat.value;
      (typeof valuesToSend.email_from != "string")? valuesToSend.email_from = this.mailProps.inputs.email_from: '';
      (typeof valuesToSend.email_to != "string")? valuesToSend.email_to = this.mailProps.inputs.email_to: '';
      (typeof valuesToSend.name != "string")? valuesToSend.name = this.mailProps.nameFrom: '';
      console.log("valid data: ", valuesToSend);
      
      this.send(valuesToSend, false, theUrl);
    } else {
      console.log(this.formConcat);
    }
  }

  getStl(input) {
    let ngClassResualt = (input.valid && input.touched && input.dirty) ? 'border border-success' : (input.touched && input.dirty) ? 'border border-danger' : false;
    if (ngClassResualt) return ngClassResualt;
  }

  send(body, method?: string | boolean, urlArg?: string) {

    let url = urlArg ? urlArg : "http://lara.test/api/events";
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

  ngOnDestroy() {
    // this.http.requestUrl = false;
  }
}
