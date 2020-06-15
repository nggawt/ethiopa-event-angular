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
import { NgValidateSrvService } from 'src/app/services/validators/ng-validate-srv.service';
import { NotificationService } from 'src/app/services/messages/notification.service';

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
    private http: HttpService,
    private msgNotify: NotificationService,
    public formFiles: FormFilesAndInputsProccesorService,
    private ngVal: NgValidateSrvService) { }

  ngOnInit() {

    
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
      'company': new FormControl(customer.company, [Validators.required, this.ngVal.unchange.bind(this, customer.company)]),
      'businessType': new FormControl(customer.businessType, [Validators.required, this.ngVal.unchange.bind(this, customer.businessType)]),
      'title': new FormControl(customer.title, [Validators.required, this.ngVal.unchange.bind(this, customer.title)]),
      'contact': new FormControl(customer.contact, [Validators.required, this.ngVal.unchange.bind(this, customer.contact)]),
      'tel': new FormControl(customer.tel, [Validators.required, this.ngVal.unchange.bind(this, customer.tel)]),
      'email': new FormControl(customer.email, [Validators.required, this.ngVal.unchange.bind(this, customer.email)]),
      'address': new FormControl(customer.address, [Validators.required, this.ngVal.unchange.bind(this, customer.address)]),
      // 'descriptions': new FormControl(customer.descriptions, [Validators.required, this.ngVal.unchange.bind(this, customer.descriptions)]),
      'content': new FormControl(customer.content, [Validators.required, this.ngVal.unchange.bind(this, customer.content)]),
      'deals': new FormControl(customer.deals, [Validators.required, this.ngVal.unchange.bind(this, customer.deals)]),
      'confirmed': new FormControl(customer.confirmed, [Validators.required, this.ngVal.unchange.bind(this, customer.confirmed)]),
      'loggo': new FormArray([], [this.ngVal.valLen.bind(this, 'loggo'), this.binValidators.bind(this)]),
      'video': new FormArray([], [this.ngVal.valLen.bind(this, 'video'), this.binValidators.bind(this)]),
      'images': new FormArray([], [this.ngVal.valLen.bind(this, 'images'), this.binValidators.bind(this)]),
    });
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

    currentControl.setValidators([this.ngVal.validateSize.bind(this), this.ngVal.validateExisst, this.ngVal.validateType]);
    currentControl.updateValueAndValidity({ onlySelf: true });
    return null;
    // formArray.controls.forEach((control: FormControl) => {
    //   control.setValidators([this.validateSize.bind(this), this.validateExisst, this.validateType]);  //this.validateExisst(co)
    // });
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
    
    let container: HTMLDivElement = evt.container;
    container.style.minHeight = "90px";
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
      fDel = this.formFiles.filesDl[itemId].length? { [itemId]: this.formFiles.filesDl[itemId] }: false;
    } else {/* input items */
      valItems['inputs'] = itemId == 'content'? this.setContent(formItem, itemId): {[itemId]: formItem.value};
    }
    console.log('item id: ', itemId,' del file: ', fDel,' validate items to send: ', valItems);
    
    /* get builded form data */
    let fData = this.formFiles.buildSendingFiles(valItems, fDel, this.editeCustomer.value);

    /* send files to server */
    this.send(fData, "PATCH");
  }

  onSubmit() {

    /* get validated items */
    let valItems = this.formFiles.getValidatedItems(this.editeCustomer);

    /* get files to delete */
    let fDel = this.formFiles.extractDelFiles();

    console.log("validate items: ", valItems, " del files: ", fDel, " form: ", this.editeCustomer);

    /* get builded form data */
    let fData = this.formFiles.buildSendingFiles(valItems, fDel, this.editeCustomer.value);

    /* send files to server */
    this.send(fData, "PUT");

    /* show messages success || errors */
    //return false;
  }

  send(body, method?: string) {

    let url = "customers/" + this.itemData['customer'].id + "? _method=" + (method || "PUT");
    //return false;
    this.http.postData(url, body)
      .subscribe(response => {
        localStorage.setItem('success_server', JSON.stringify(response));
        this.sync(body, response);
        // if(response['errors']){
        console.log(response);
        
        /**** send new customer to his own page *****/

      }, (err) => {
        // localStorage.setItem('errors_server', JSON.stringify(err));
        console.log(err);
        if (err["status"] === 401) {
          // console.log(err['status']);

          // this.http.nextIslogged(false);
          // window.localStorage.removeItem('user_key');
          // window.location.reload();
        }
      });
  }

  sync(items, response?) {

    Object.keys(items).forEach(item => {
      this.itemData[item] = items[item];
    });
    this.msgNotify.success(response.message, "קליינט");
    /* this.message = "קליינט עודכן בהצלחה";// "אדמין עודכן בהצלחה"; //response.messages.success.update[0];
    setTimeout(() => {
      $('#' + this.id).click();
      this.message = false;
    }, 3000) */
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
