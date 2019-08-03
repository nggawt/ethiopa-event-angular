import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, Subscription, pipe } from 'rxjs';
import { ResourcesService } from '../../../services/resources/resources.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { tap, map } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http-service/http.service';
import { FormProccesorService } from 'src/app/customers/form-proccesor.service';
import { FormFilesAndInputsProccesorService } from 'src/app/services/form-files-and-inputs/form-files-and-inputs-proccesor.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ValidationService } from 'src/app/services/validation/validation.service';
import { CustomValidator } from 'src/app/shared/directives/custom-validators/custom-validators-fn-factory';

declare var $: any;
@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css', '../../../styles/validate.css']
})
export class CustomerEditComponent implements OnInit, OnDestroy {

  /* ************ valadition **************** */
  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  passwordPatt: string = '^\\w{6,}$';
  phoneNum: any = '^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})';

  editeCustomer: FormGroup;
  customerSubsripion: Subscription;
  @Input() itemData: {};
  formMethod: string = "update";
  savedId: { prevElemId: string | boolean } = { ['prevElemId']: false };
  messages: {};
  quill: {};



  toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
  ];

  config = {
    toolbar: this.toolbarOptions,
    // handlers: {
    //   'text-right': (arg) => console.log(arg),
    // }
    // placeholder: 'Compose an epic...',
    // readOnly: true,
    // theme: 'bubble'
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpService,
    private httpCli: HttpClient,
    private srv: ResourcesService,
    private formInputs: FormProccesorService,
    public formFiles: FormFilesAndInputsProccesorService,
    private validator: ValidationService) { }

  ngOnInit() {

    
    console.log(this.itemData);
    
    if (this.itemData) {
      this.formInt(this.itemData);
      this.formFiles.initApp(this.itemData, this.editeCustomer, 'update');
    } 
    
    this.localStorageTest();

    /* this.httpCli.get('https://api.ipify.org?format=json')
      .pipe(tap(res => console.log(res)))
      .toPromise().catch(this.handleError); */
  }

  localStorageTest(){
    let serverErr = localStorage.getItem('errors_server');
    let serverSuccess = localStorage.getItem('success_server');

    if (serverErr) {
      console.log(JSON.parse(serverErr));
      localStorage.removeItem('errors_server')
    }
    if (serverSuccess) {
      console.log(JSON.parse(serverSuccess));
      localStorage.removeItem('success_server')
    }
  }
  private handleError(error: HttpErrorResponse) {
    //Log error in the browser console
    console.error('observable error: ', error);

  }
  /* 
    updateChange(evt, el){
      console.log(evt, " elem:", el);
      
    } */

  get f() { return this.editeCustomer.controls; }

  private formInt(items) {

    let customer = items['customer'];
    console.log(customer);
    
    /*
    let formItems = {};
      Object.keys(customer).forEach(item => {
      if (item != "id" && item != "created_at" && item != "user_id" && item != "loggo") formItems[item] = new FormControl(customer[item], [Validators.required]);
    }); 
    this.editeCustomer = new FormGroup(formItems);
    */


    this.editeCustomer = new FormGroup({
      'company': new FormControl(customer.company, [Validators.required, this.unchange.bind(this, customer.company)]),
      'businessType': new FormControl(customer.businessType, [Validators.required, this.unchange.bind(this, customer.businessType)]),
      'title': new FormControl(customer.title, [Validators.required, this.unchange.bind(this, customer.title)]),
      'contact': new FormControl(customer.contact, [Validators.required, this.unchange.bind(this, customer.contact)]),
      'tel': new FormControl(customer.tel, [Validators.required, this.unchange.bind(this, customer.tel)]),
      'email': new FormControl(customer.email, [Validators.required, this.unchange.bind(this, customer.email)]),
      'address': new FormControl(customer.address, [Validators.required, this.unchange.bind(this, customer.address)]),
      'descriptions': new FormControl(customer.descriptions, [Validators.required, this.unchange.bind(this, customer.descriptions)]),
      'content': new FormControl(customer.content, [Validators.required, this.unchange.bind(this, customer.content)]),
      'deals': new FormControl(customer.deals, [Validators.required, this.unchange.bind(this, customer.deals)]),
      'confirmed': new FormControl(customer.confirmed, [Validators.required, this.unchange.bind(this, customer.confirmed)]),
      'loggo': new FormArray([], [this.valLen.bind(this, 'loggo'), this.binValidators.bind(this)]),
      'video': new FormArray([], [this.valLen.bind(this, 'video'), this.binValidators.bind(this)]),
      'images': new FormArray([], [this.valLen.bind(this, 'images'), this.binValidators.bind(this)]),
    });
  }

  unchange(iteVal: string, control: FormGroup) {
    return (control.value === iteVal) ? { ['unchane']: true } : null;
  }

  public getLengthCustomValidator(value: string) {
    // console.log(value);
    return new CustomValidator(
      () => value != "buzzi",
      'buzzi'
    );
  }

  binValidators(formArray): null {

    const currentControl = formArray.controls[formArray.controls.length - 1];
    if (!formArray.controls.length || !currentControl) return null;

    currentControl.setValidators([this.validateSize.bind(this), this.validateExsst, this.validateType]);
    currentControl.updateValueAndValidity({ onlySelf: true });
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

  inputReset(customer, id) {
    let comp = customer['id'];
    console.log(this.editeCustomer.controls[comp]);
    this.editeCustomer.controls[comp].reset();
  }

  default(formItem: FormGroup, itemId) {
    (this.galItems().indexOf(itemId) >= 0) ? this.formFiles.galDefault(itemId) : formItem.setValue(this.itemData['customer'][itemId]);
  }

  configEditor(evt) {
    console.log(evt);
    // evt.theme.modules.toobar
    this.quill = evt;
    evt.format('direction', 'rtl');
    evt.format('align', 'right', 'user');
    evt.format('size', 'normal', 'user');
    evt.format('header', 3, 'user');

    // var toolbar = evt.getModule('toolbar');
    // console.log(toolbar);

  }

  getValidatedItems() {
    let controls = this.editeCustomer.controls,
      valItems = { gallery: {}, inputs: {} },
      galleryKeys = ['images', 'video', 'loggo'];

    Object.keys(controls).forEach(keyName => {
      let galObj = (galleryKeys.indexOf(keyName) >= 0) ? this.mapValidated(keyName) : [];
      (galObj.length) ? valItems['gallery'][keyName] = galObj : controls[keyName].valid ? valItems['inputs'][keyName] = controls[keyName].value : '';
    });
    return valItems;
  }

  protected mapValidated(keyName) {
    return (<FormArray>this.editeCustomer.get(keyName)).controls.filter(item => item.valid).map(item => item.value);
  }

  protected setContent(formItem, itemId){
    let text = this.quill['getText'](0, 70);
    return {
      [itemId]: formItem.value,
      ['descriptions']: text
    };
  }

  update(formItem: FormGroup, itemId) {

    let valItems: {} = { gallery: {}, inputs: {} }, fDel;

    /* check if gallery items or input items */
    if (this.galItems().indexOf(itemId) >= 0) {/* gallery items */
      valItems = { ['gallery']: { [itemId]: this.mapValidated(itemId) } };
      fDel = { [itemId]: this.formFiles.filesDl[itemId] };
    } else {/* input items */
      valItems['inputs'] = itemId == 'content'? this.setContent(formItem, itemId): {[itemId]: formItem.value};
    }
    console.log(itemId, valItems);
    
    /* get builded form data */
    let fData = this.formFiles.buildSendingFiles(valItems, fDel, this.editeCustomer.value);
    /* send files to server */
    this.send(fData, "PATCH");
  }

  onSubmit() {

    /* get validated items */
    let valItems = this.getValidatedItems();

    /* get files to delete */
    let fDel = this.formFiles.extractDelFiles();

    console.log("validate items: ", valItems, " del files: ", fDel, " form: ", this.editeCustomer);

    /* get builded form data */
    let fData = this.formFiles.buildSendingFiles(valItems, fDel, this.editeCustomer.value);

    /* send files to server */
    this.send(fData, "PUT");

    /* show messages success || errors */
    return false;
  }


  send(body, method?: string) {

    let url = "customers/" + this.itemData['customer'].id + "? _method=" + (method || "PUT");
    //return false;
    this.http.postData(url, body)
      .subscribe(evt => {
        localStorage.setItem('success_server', JSON.stringify(evt));
        // if(evt['errors']){
        console.log(evt);
        let msgs = this.formInputs.getMassages(evt);
        this.messages = msgs;
        console.log(msgs);

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
        localStorage.setItem('errors_server', JSON.stringify(err));
        console.log(err);
        if (err["status"] === 401) {
          //console.log(err['status']);

          //this.http.nextIslogged(false);
          // window.localStorage.removeItem('user_key');
          //window.location.reload();
        }
      });
  }

  close() {
    this.router.navigate(['../']);
  }

  private galItems() {
    return ['loggo', 'video', 'images'];
  }

  clear(item, itemId) {
    (this.galItems().indexOf(itemId) >= 0) ? this.formFiles.galReset(itemId) : item.reset();
  }

  reset() {

    this.galItems().forEach((el) => {
      this.formFiles.galReset(el);
    });
    this.editeCustomer.reset();
  }

  posElem(elem) {
    elem.style.height = '0px';     //Reset height, so that it not only grows but also shrinks
    elem.style.height = (elem.scrollHeight + 10) + 'px';
    // this.attachEvents(elem)
    elem.setSelectionRange(0, 0);
    elem.focus();
  }

  ngOnDestroy() {
    // this.customerSubsripion.unsubscribe();
  }
}
