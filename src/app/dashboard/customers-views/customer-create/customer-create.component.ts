import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
import { FormProccesorService } from 'src/app/customers/form-proccesor.service';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FormFilesAndInputsProccesorService } from 'src/app/services/form-files-and-inputs/form-files-and-inputs-proccesor.service';
declare var $;

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.css']
})
export class CustomerCreateComponent implements OnInit {

  /* ************ valadition **************** */
  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  passwordPatt: string = '^\\w{6,}$';
  phoneNum: any = '^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})';

  /* **************************** */
  createCustomer: FormGroup;
  allowdeactivate: boolean = true;
  customer;
  formMethod: string ="post";

  messages: {};

  constructor(
    private router: Router,
    private http: HttpService,
    private formInputs: FormProccesorService,
    public formFiles: FormFilesAndInputsProccesorService) { }

  ngOnInit() {

    this.http.isLogedIn.subscribe(
      (isLogged) => {
        this.formInt();
        $('.media-placeholder').hide();
        // console.log(this.imgsTargetElement);

        // this.imgsTargetElement.hide();
        if (!isLogged) {

          // this.formInt();
        } else {

          // this.router.navigate(['/']);
        }
      });

  }

  inputReset(customer) {
    let comp = customer['id'];
    console.log(this.createCustomer.controls);
    this.createCustomer.controls[comp].reset();
  }

  default(customer) {
    let comp = customer.id;
    this.customer && this.customer[comp] ? this.createCustomer.controls[comp].setValue(this.customer[comp]) : this.inputReset(customer)
  }


  allTodefault() {
    let controls = this.createCustomer.controls;

    for (let ii in controls) {
      if (controls.hasOwnProperty(ii)) {
        if (controls[ii].value !== this.customer[ii]) {
          if (this.customer[ii]) controls[ii].setValue(this.customer[ii]);
        }
      }
    }
    ['loggo', 'video', 'gallery'].forEach(el => {
      /* let delLen = this.filesDl[el].length > 0;
      let elem = this.findItemInArrayFiles(el)

      if((elem && delLen) || (delLen && el == "gallery")){
        this.galReset(el);
        this.galDefault(el);
      }  */
    });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

    let filesLoggo = this.formFiles.arrayFlies['loggo'].length >= 1;
    let filesGallery = this.formFiles.arrayFlies['gallery'].length >= 1;
    let filesVideo = this.formFiles.arrayFlies['video'].length >= 1;

    let haveFiles = filesGallery || filesLoggo || filesVideo;

    /* if (haveFiles) {
      return true;
    } else {
      return false;
    } */
    if ((this.createCustomer.dirty || this.createCustomer.touched || haveFiles) && this.allowdeactivate) {
      return confirm("לא שמרתה את הפרטים. תרצה לעזוב דף זה בכל זאת?")
    } else {
      return true;
    }
  }

  get f() { return this.createCustomer.controls; }

  private formInt() {

    this.createCustomer = new FormGroup({
      'company': new FormControl(null, [Validators.required]),
      'businessType': new FormControl("", [Validators.required]),
      'title': new FormControl(null, [Validators.required]),
      'contact': new FormControl(null, [Validators.required]),
      'tel': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required]),
      'address': new FormControl(null, [Validators.required]),
      'descriptions': new FormControl(null, [Validators.required]),
      'deals': new FormControl(null, [Validators.required])
    });
  }


  onSubmit() {

    this.customer = this.createCustomer.value;

    /****** handel form inputs *****/
    let controls = this.createCustomer.controls;

    let items = this.formInputs.validate(controls);
    let success = items['status'] ? items['success'] : false;

    /****** handel form files and validate *****/
    // let extractFilesSend = this.formFiles.extractSendingFiles(this.arrayFlies);
    let filestObject = this.formFiles.handleFilesBeforSend();

    let messages = filestObject['messages'];

    if (messages['success'] && !messages['warning'] && (filestObject['haveFilesToSend'] || filestObject['filesToDelete'])) {

      console.log("files: ", filestObject, "inputs: ", items);
      let fToSend = this.formFiles.buildSendingFiles(filestObject['filesToSend'], filestObject['filesToDelete'], this.createCustomer.value);

      if (success && filestObject['filesToSend']['loggo'].length) {
        let findLinkCust = filestObject['filesToSend']['loggo'][0];

        success['loggo'] = this.formFiles.getUrl(this.createCustomer.value) + "/" + findLinkCust.target + "/" +
          findLinkCust.name.split('.')[0] + '.' + findLinkCust.name.split('.')[(findLinkCust.name.split('.').length) - 1];

        fToSend.set('formInputs', JSON.stringify(success));
      }

      /****** if we have callback send back to requested component else send to server *****/
      this.send(fToSend, this.createCustomer.value);
    } else {

      this.messages = messages['errors'] ? messages['errors'] : messages['warning'];
      console.log(messages);

      // this.reset();
      this.formFiles.resetMessages();
    }
  }


  send(body, customer?) {

    let updaterUrl = "customers";

    this.http.postData(updaterUrl, body)
      .subscribe(evt => {

        // if(evt['errors']){
        console.log(evt);
        let msgs = this.formInputs.getMassages(evt);
        this.messages = msgs;
        console.log(msgs);
        this.allowdeactivate = false;

        this.formInputs.resetMessages().then(response => {
          // let url = "/customers/"+ this.formFiles.getUrl(customer) + "/media";
          this.messages = response;
          // this.router.navigate([url]);
        });
        // }else{
        // location.reload();
        // }
        /**** send new customer to his own page *****/

      }, (err) => {

        console.log(err);
        if (err["status"] === 401) {
          console.log(err['status']);

          this.http.nextIslogged(false);
          // window.localStorage.removeItem('user_key');
          window.location.reload();
        }
      });
  }

  close() {
    this.router.navigate(['../']);
  }
}
