import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
import { FormProccesorService } from 'src/app/customers/form-proccesor.service';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FormFilesAndInputsProccesorService } from 'src/app/services/form-files-and-inputs/form-files-and-inputs-proccesor.service';
import { ResourcesService } from '../../../services/resources/resources.service';
import { tap, map } from 'rxjs/operators';
declare var $;

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.css', '../../../styles/validate.css']
})
export class CustomerCreateComponent implements OnInit {

  /* ************ valadition **************** */
  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  passwordPatt: string = '^\\w{6,}$';
  phoneNum: any = '^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})';

  itemsResources$: Observable<{}>;

  /* **************************** */
  createCustomer: FormGroup;
  allowdeactivate: boolean = true;
  customer;
  formMethod: string ="post";

  messages: {};

  constructor(
    private router: Router,
    private http: HttpService,
    private srv: ResourcesService,
    private formInputs: FormProccesorService,
    public formFiles: FormFilesAndInputsProccesorService) { }

  ngOnInit() {
        console.log("called");
        this.itemsResources$ = this.srv.resourcesObsever.pipe(map(items => this.getUsers(items)));

    this.http.isLogedIn.subscribe((isLogged) => {

        this.formInt();
        this.formFiles.initApp(false, this.createCustomer, "post");
        $('.media-placeholder').hide();
        
        if (!isLogged) {

          // this.formInt();
        } else {

          // this.router.navigate(['/']);
        }
      });
  }

  protected getUsers(items){
    let users = items['users'] && items['users'].data? [items['users'].data, ...items['users'].pending][0]: false;
    console.log(users);
    return users;
  }

  inputReset(customer) {
    let comp = customer['id'];
    console.log(this.createCustomer.controls);
    this.createCustomer.controls[comp].reset();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

    let arrFl = this.formFiles.arrayFlies;

    let filesLoggo = arrFl['loggo'].length >= 1;
    let filesGallery = arrFl['gallery'].length >= 1;
    let filesVideo = arrFl['video'].length >= 1;

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
      'owner': new FormControl("", [Validators.required]),
      'company': new FormControl(null, [Validators.required]),
      'businessType': new FormControl("", [Validators.required]),
      'title': new FormControl(null, [Validators.required]),
      'contact': new FormControl(null, [Validators.required]),
      'tel': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required]),
      'address': new FormControl(null, [Validators.required]),
      'descriptions': new FormControl(null, [Validators.required]),
      'deals': new FormControl(null, [Validators.required]),
      'confirmed': new FormControl(null, [Validators.required]),
      'loggo': new FormArray([], [this.valLen.bind(this, 'loggo'), this.binValidators.bind(this)]),
      'video': new FormArray([], [this.valLen.bind(this, 'video'), this.binValidators.bind(this)]),
      'images': new FormArray([], [this.valLen.bind(this, 'images'), this.binValidators.bind(this)]),
    });
  }

  binValidators(formArray): null {

    const currentControl = formArray.controls[formArray.controls.length -1];
    if(! formArray.controls.length || !currentControl) return null;

    currentControl.setValidators([this.validateSize.bind(this), this.validateExsst, this.validateType]);
    currentControl.updateValueAndValidity({onlySelf: true});
    return null;
      // formArray.controls.forEach((control: FormControl) => {
      //   control.setValidators([this.validateSize.bind(this), this.validateExsst, this.validateType]);  //this.validateExsst(co)
      // });
 }

  validateSize(control): { [key: string]: string } | null {//{ [key: string]: string } | null
    // { files_size: "file size " + this.formatBytes(control.value.size) + " to big." }
    // console.log(control);
    return (Math.round(control.value.size / Math.pow(1024, 2)) > 6) ? { files_size: "file size " + this.formatBytes(control.value.size) + " to big." } : null;
  }

  validateExsst(control): { [key: string]: string } | null {
    return control.value.exisst ? { files_exisst: "file exisst in our system." } : null;
  }

  formatBytes(a) {
    if (0 === a) return "0 Bytes";
    var
      c = 1024,
      d = 2,
      e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + e[f];
  }

  validateType(control): { [key: string]: string } | null {
    let videoType = ['video/3gpp', 'video/H261', 'video/H263', 'video/H264', 'video/JPEG', 'video/mp4', 'video/mpeg'];
    let imageType = ['image/jpeg', 'image/png', 'image/gif'];

    let typeName = control.value.type.split('/')[0];
    let typeVal = (typeName == "image") ? imageType.indexOf(control.value.type) :
      (typeName == "video") ? videoType.indexOf(control.value.type) : false;
    let trueOrFalse: boolean = (typeVal == -1);
    let msg: string = "סוג הקובץ לא תקף " + control.value.name + " " + control.value.type;
    return trueOrFalse ? { file_type: msg } : null;
  }

  valLen(target, control): { [key: string]: {} } {
    const validLen = (target == "images") ? (control.value.length >= 3 && control.value.length < 12) : (control.value.length == 1);
    return !validLen ? { 'invalidLength': control.value.length + " length of " + target + " items is invalid" } : null;
  }


  getValidatedItems() {
    let controls = this.createCustomer.controls,
      valItems = { gallery: {}, inputs: {} },
      galleryKeys = ['images', 'video', 'loggo'];

    Object.keys(controls).forEach(keyName => {
      let galObj = (galleryKeys.indexOf(keyName) >= 0) ? this.mapValidated(keyName) : [];
      (galObj.length) ? valItems['gallery'][keyName] = galObj : controls[keyName].valid ? valItems['inputs'][keyName] = controls[keyName].value : '';
    });
    return valItems;
  }

  protected mapValidated(keyName) {
    return (<FormArray>this.createCustomer.get(keyName)).controls.filter(item => item.valid).map(item => item.value);
  }

  onSubmit() {

    /* get validated items */
    let valItems = this.getValidatedItems();

    /* get files to delete */
    let fDel = this.formFiles.extractDelFiles();

    console.log("validate items: ", valItems, " del files: ", fDel , " form: ", this.createCustomer);

    /* get builded form data */
    let fData = this.formFiles.buildSendingFiles(valItems, fDel, this.createCustomer.value);

    /* send files to server */
    this.send(fData);

    /* show messages success || errors */
    // return false;
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
          // window.location.reload();
        }
      });
  }

  close() {
    this.router.navigate(['../']);
  }
}
