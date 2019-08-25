import { Component, OnInit, Input, ViewEncapsulation, ViewChild, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/messages/notification.service';
import { HttpService } from 'src/app/services/http-service/http.service';
import { CalendarDatePickerService } from 'src/app/calendar/calendar-date-picker.service';
import { NgValidateSrvService } from 'src/app/services/validators/ng-validate-srv.service';
import { AddComponentDirective } from 'src/app/shared/directives/add-component.directive';
import { LogInComponent } from 'src/app/auth/log-in/log-in.component';
import { Observable } from 'rxjs';
import { ErrorsHandler } from 'src/app/services/errors-exeption/errors-handler.service';
import { QuillConfig } from 'ngx-quill';

declare var $: any;
@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css', '../../../styles/date-picker.component.css', '../../../styles/form-inputs.css'],
  encapsulation: ViewEncapsulation.None
})
export class PostEditComponent implements OnInit {

  articleEdit: FormGroup;
  formMethod ="update";
  allowLogIn:Observable<boolean>;

  @Input() itemData: {id: number, name: string, title: string, body: string, date: string, confirmed: boolean};

  quill: QuillConfig;

  fired = false;
  datePicker: HTMLDivElement;

  constructor(private msgNotify: NotificationService, 
    private http: HttpService,
    private ngVal: NgValidateSrvService,
    private calendar: CalendarDatePickerService,
    private esrv: ErrorsHandler) { }

  ngOnInit() {
    if(this.itemData) this.itemForm();
  }

  get f() : {} {
    return this.articleEdit.controls;
  }
  
  configEditor(evt: any) {

    let container = evt.container;
    // container.classList.add('h-75');
    // console.log(evt);
    // evt.theme.modules.toobar
    this.quill = evt;
    evt.format('direction', 'rtl');
    evt.format('align', 'right', 'user');
    evt.format('size', 'normal', 'user');
    evt.format('header', 3, 'user');

    // var toolbar = evt.getModule('toolbar');
    // console.log(toolbar);
  }


  itemForm(){
    console.log(this.itemData);
    
    this.articleEdit = new FormGroup({
      name: new FormControl(this.itemData.name, [Validators.required, this.ngVal.unchange.bind(this, this.itemData.name)]),
      title: new FormControl(this.itemData.title, [Validators.required, this.ngVal.unchange.bind(this, this.itemData.title)]),
      body: new FormControl(this.itemData.body, [Validators.required, this.ngVal.unchange.bind(this, this.itemData.body)]),
      date: new FormControl(this.reverseDate(this.itemData.date), [Validators.required, this.ngVal.unchange.bind(this, this.reverseDate(this.itemData.date))]),
      confirmed: new FormControl(this.itemData.confirmed, [Validators.required, this.ngVal.unchange.bind(this, this.itemData.confirmed)]),
    });
  }

  reverseDate(dt: string){
    let time =  (dt.indexOf(":") > 0)? dt.split(" ")[1]: false;
    let dtText = time? dt.split(" ")[0].split('-').reverse().join('-')+" "+ time: dt.split('-').reverse().join('-');
    return dtText;
  }

  default(formItem: FormGroup, itemId) {
    formItem.setValue(this.itemData[itemId]);
  }

  clear(item) {
    item.reset();
  }

  update(formItem: FormGroup, itemId) {

    let valItems = this.ngVal.getValidatedItems(this.articleEdit)['inputs'];

    /* send files to server */
    if(Object.keys(valItems).length){
      if(valItems['date']) valItems['date'] = this.reverseDate(valItems['date']);
      this.send(valItems, "PATCH");
    }
  }

  onSubmit(){
    let valItems = this.ngVal.getValidatedItems(this.articleEdit)['inputs'], len;
    console.log("the form: ", this.articleEdit, " validate items: ", valItems);
    if(len = Object.keys(valItems).length){

      if(valItems['date']) valItems['date'] = this.reverseDate(valItems['date']);
      let method = len > 1? "PUT": "PATCH";
      this.send(valItems, method);
    }
  }

  send(body, method?) {
    let baseUrl ="articles/";
    let url = method? baseUrl+ +this.itemData.id+"?_method="+method: baseUrl+this.itemData.id+"?_method=PUT";

    this.http.postData(url, body)
      .subscribe(response => {
        this.sync(response);
        // this.msgs(body, response);
        // if(response['errors']){
        console.log("url: ", url, " body data: ", body, " response: ", response);
        this.msgNotify.showSuccess('פוסט\\מאמר', "פוסט\\מאמר  עודכן בהצלחה", {positionClass: "toast-top-left"});
        /**** send new customer to his own page *****/

      }, (err) => {
        this.esrv.handleError(err);
        // console.log(err);
        this.msgNotify.showErrors('פוסט\\מאמר', "פרטים שגויים!", {positionClass: "toast-top-left"});

        if (err["status"] === 401) {
          // console.log(err['status']);
          this.http.requestUrl = location.pathname;
          // this.http.allowLogIn.
          // this.http.nextIslogged(false);
          this.http.allowLogIn.next(true);
          this.allowLogIn = this.http.allowLogIn;
          // window.localStorage.removeItem('user_key');
          // window.location.reload();
        }
      });
  }

  sync(response){

    let items = response['items'];
    if(items['date']) items['date'] = this.reverseDate(items['date']);
    for(let item in items){

      this.itemData[item] = items[item];
      
      this.articleEdit.get(item).setValidators(this.ngVal.unchange.bind(this, items[item]));
      this.articleEdit.get(item).updateValueAndValidity({onlySelf: true});
    }
    console.log(this.articleEdit);
    
  }

  fire(input: HTMLInputElement) {

    input = input ? input : <HTMLInputElement>document.getElementById("date");

    if (!this.fired && input) {
      this.datePicker = <HTMLDivElement>this.calendar.fire(false, this.articleEdit, input);
      input.parentElement.style.position = "relative";

      this.setStyles(this.datePicker, input.parentElement.clientHeight);
      this.confCalendar(this.datePicker);

      input.parentElement.appendChild(this.datePicker);
      this.fired = true;
    }else{
      this.toggleDisplay();
    }
  }

  setStyles(elem, parentHeight) {
    elem.classList.add('position-absolute');
    elem.style.top = (parentHeight + 2) + "px";
    elem.classList.add('shadow-sm');
    // elem.style.right = 50 + "%";
    // elem.classList.add('w-50');
  }

  confCalendar(calendar: HTMLDivElement) {

    $(document).on("click", (e) => {
      if (calendar.contains(e.target) || e.target.id == "date") {
        // if (e.target.id == "date" && $(calendar).is(':hidden')) this.toggleDisplay(calendar);
        e.stopPropagation();
        return false;
      }

      if ($(calendar).is(':visible')) {
        this.toggleDisplay(calendar);
      }
    });
    this.toggleDisplay(calendar);
  }

  toggleDisplay(calendar?: HTMLDivElement) {
    calendar = calendar ? calendar : this.datePicker;
    (calendar.classList.toggle('open')) ? calendar.style.zIndex = '99' : calendar.style.zIndex = '0';
  }
}
