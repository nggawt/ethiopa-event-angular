import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
import { FormProccesorService } from 'src/app/customers/form-proccesor.service';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FormFilesAndInputsProccesorService } from 'src/app/services/form-files-and-inputs/form-files-and-inputs-proccesor.service';
import { ResourcesService } from '../../../services/resources/resources.service';
import { tap, map } from 'rxjs/operators';
import { NgValidateSrvService } from 'src/app/services/validators/ng-validate-srv.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { NotificationService } from 'src/app/services/messages/notification.service';
declare var $;

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.css', '../../../styles/form-inputs.css']
})
export class CustomerCreateComponent implements OnInit, AfterViewInit {

  /* ************ valadition **************** */
  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  passwordPatt: string = '^\\w{6,}$';
  phoneNum: any = '^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})';

  itemData: {};
  users: any;
  /* **************************** */
  createCustomer: FormGroup;
  formMethod: string = "post";
  messages: {};

  quill: {};
  formats: ["align", "right"]//{align: 'right', background: "blue"}];

  constructor(
    private router: Router,
    private http: HttpService,
    private srv: ResourcesService,
    private ngVal: NgValidateSrvService,
    public msgsBag: MessagesService,
    public msgNotify: NotificationService,
    public formFiles: FormFilesAndInputsProccesorService) { }

  ngOnInit() {

      this.formInt();
      this.getUsers()
      this.formFiles.initApp(false, this.createCustomer, "post");
      // $('.media-placeholder').hide();
  }

  protected getUsers() {

    this.srv.getResources('users', false).then(users => {
      console.log(users);
      setTimeout(() => $('.chosen').trigger('chosen:updated'), 200);
      if(users) this.users = users;
    });
  }

  ngAfterViewInit(){
    let thiz = this;
    $(".chosen").chosen({
      disable_search_threshold: 5,
      no_results_text: "אופפס!, משתמש לא קיים!",
      placeholder_text_single: "בחר משתמש"
    }).on('change', function(evt, params) {
      console.log(this, ' : ',evt , params);
      thiz.setOwnerUser(+(params.selected));
    });
  }

  setOwnerUser(userId){
    let user = this.users.find(user => user.id == userId);
    console.log(user);

    user? this.createCustomer.patchValue({
      email: user.email,
      owner: user.id,
      contact: user.name,
      tel: user.tel,
    }, {onlySelf: true}): '';
  }

  userIsCustomer(user: any, customers: any) {
    return customers.every(customer => customer['customer'].user_id != user.id);
  }

  inputReset(customer) {
    let comp = customer['id'];
    console.log(this.createCustomer.controls);
    this.createCustomer.controls[comp].reset();
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

    let arrFl = this.formFiles.arrayFlies;

    let filesLoggo = arrFl['loggo'].length >= 1;
    let filesGallery = arrFl['images'].length >= 1;
    let filesVideo = arrFl['video'].length >= 1;

    let haveFiles = filesGallery || filesLoggo || filesVideo;

    if ((this.createCustomer.dirty || this.createCustomer.touched || haveFiles)) {
      return confirm("לא שמרתה את הפרטים. תרצה לעזוב דף זה בכל זאת?")
    } else {
      return true;
    }
  }

  get f() { return this.createCustomer.controls; }

  private formInt() {

    this.createCustomer = new FormGroup({
      'owner': new FormControl(""),
      'company': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'businessType': new FormControl("", [Validators.required, Validators.minLength(3)]),
      'title': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'contact': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'tel': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required]),
      'address': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      // 'descriptions': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'content': new FormControl(null, [Validators.required]),
      'deals': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      'confirmed': new FormControl(false),
      'loggo': new FormArray([], [Validators.required, this.ngVal.valLen.bind(this, 'loggo'), this.binValidators.bind(this)]),
      'video': new FormArray([], [Validators.required, this.ngVal.valLen.bind(this, 'video'), this.binValidators.bind(this)]),
      'images': new FormArray([], [Validators.required, this.ngVal.valLen.bind(this, 'images'), this.binValidators.bind(this)]),
    });
  }

  binValidators(formArray): null {

    const currentControl = formArray.controls[formArray.controls.length - 1];
    if (!formArray.controls.length || !currentControl) return null;

    currentControl.setValidators([this.ngVal.validateSize.bind(this), this.ngVal.validateExisst, this.ngVal.validateType]);
    currentControl.updateValueAndValidity({ onlySelf: true });
    return null;
  }

  configEditor(evt) {
    // evt.theme.modules.toobar
    this.quill = evt;
    evt.format('direction', 'rtl');
    evt.format('align', 'right', 'user');
    evt.format('size', 'normal', 'user');
    evt.format('header', 3, 'user');

    let container: HTMLDivElement = evt.container;
    container.style.minHeight = "90px";
    // container.classList.add('h-100');
    console.log(evt);

    // var toolbar = evt.getModule('toolbar');
    // console.log(toolbar);
  }

  onSubmit() {

    // if (!this.createCustomer.valid) {
    //   let msgBag = this.msgsBag.initMessages(this.createCustomer);
    //   this.messages = {
    //     errors: msgBag['errors'],
    //     success: msgBag['success']
    //   };
    //   this.msgNotify.showErrors('נא לתקן את השגיאות', "פרטים שגויים", {positionClass: "toast-center-center"});
    //   console.log("messages: ", this.messages, " form not validated: ", this.createCustomer);
    //   return;
    // }
    /* get validated items */
    let valItems = this.formFiles.getValidatedItems(this.createCustomer);

    /* get files to delete */
    let fDel = this.formFiles.extractDelFiles();

    console.log("validate items: ", valItems, " del files: ", fDel, " form: ", this.createCustomer);

    /* get builded form data */
    let fData = this.formFiles.buildSendingFiles(valItems, fDel, this.createCustomer.value);

    /* send files to server */
    this.send(fData);

    /* show messages success || errors */
    // return false;
  }

  logIt(msg){
    console.log(msg);
    
  }
  send(body, customer?) {

    let url = "customers";

    this.http.postData(url, body)
      .subscribe(response => {
        localStorage.setItem('success_server', JSON.stringify(response));
        this.sync(body, response);
        
        console.log(response);
        /**** send new customer to his own page *****/

      }, (err) => {
        localStorage.setItem('errors_server', JSON.stringify(err));
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
    this.msgNotify.showSuccess('קליינט', "חשבון קליינט נוצר בהצלחה", {positionClass: "toast-bottom-center"});
  }

  private galItems() {
    return ['loggo', 'video', 'images'];
  }

  clear(item, itemId) {
    console.log(item, itemId);
    (this.galItems().indexOf(itemId) >= 0) ? this.formFiles.galReset(itemId) : item.reset();
  }

  close() {
    this.router.navigate(['../']);
  }
}
