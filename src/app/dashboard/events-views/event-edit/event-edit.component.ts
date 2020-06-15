import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service/http.service';
import { NotificationService } from 'src/app/services/messages/notification.service';
import { CalendarDatePickerService } from 'src/app/calendar/calendar-date-picker.service';
import { NgValidateSrvService } from 'src/app/services/validators/ng-validate-srv.service';

declare var $: any;
@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css', '../../../styles/date-picker.component.css', '../../../styles/form-inputs.css'],
  encapsulation: ViewEncapsulation.None
})
export class EventEditComponent implements OnInit {

  eventEdit: FormGroup;
  formMethod: string = "update";

  @Input() itemData: {
    id: number, eventType: string, name: string, date: string, 
    email: string, other: string, location: string, address: string, 
    phone: string, confirmed: boolean, descriptions: string
  };

  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  quill: {};

  fired = false;
  datePicker: HTMLDivElement;

  constructor(private http: HttpService,
    private msgNotify: NotificationService,
    private calendar: CalendarDatePickerService,
    private ngVal: NgValidateSrvService) { }

  ngOnInit() {
    if(this.itemData) this.itemForm();
  }

  get f() : {} {
    return this.eventEdit.controls;
  }
  
  itemForm(){
    this.eventEdit = new FormGroup({
      'date': new FormControl(this.reverseDate(this.itemData.date), [Validators.required, this.ngVal.unchange.bind(this, this.reverseDate(this.itemData.date))]),
      'name': new FormControl(this.itemData.name, [Validators.required, this.ngVal.unchange.bind(this, this.itemData.name)]),
      'eventType': new FormControl(this.itemData.eventType, [Validators.required, this.ngVal.unchange.bind(this, this.itemData.eventType)]),
      'other': new FormControl(this.itemData.other, [Validators.required, this.ngVal.unchange.bind(this, this.itemData.other)]),
      'email': new FormControl(this.itemData.email, [Validators.required, this.ngVal.unchange.bind(this, this.itemData.email)]),
      'location': new FormControl(this.itemData.location, [Validators.required, this.ngVal.unchange.bind(this, this.itemData.location)]),
      'address': new FormControl(this.itemData.address, [Validators.required, this.ngVal.unchange.bind(this, this.itemData.address)]),
      'phone': new FormControl(this.itemData.phone, [Validators.required, this.ngVal.unchange.bind(this, this.itemData.phone)]),
      'confirmed': new FormControl(this.itemData.confirmed, [this.ngVal.unchange.bind(this, this.itemData.confirmed)]),
      'descriptions': new FormControl(this.itemData.descriptions, [Validators.required, this.ngVal.unchange.bind(this, this.itemData.descriptions)])
    });
  }
  
  reverseDate(dt: string){
    let time =  (dt.indexOf(" ") > 0)? dt.split(" ")[1]: false;
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

    let valItems = this.ngVal.getValidatedItems(this.eventEdit)['inputs'];

    /* send files to server */
    if(Object.keys(valItems).length){
      if(valItems['date']) valItems['date'] = this.reverseDate(valItems['date']);
      this.send(valItems, "PATCH");
    }
  }

  configEditor(evt) {
    // evt.theme.modules.toobar
    this.quill = evt;
    evt.format('direction', 'rtl');
    evt.format('align', 'right', 'user');
    evt.format('size', 'normal', 'user');
    evt.format('header', 3, 'user');
    console.log(evt);

    // var toolbar = evt.getModule('toolbar');
    // console.log(toolbar);
  }

  onSubmit(){
    let valItems = this.ngVal.getValidatedItems(this.eventEdit)['inputs'];
    console.log("the form: ", this.eventEdit, " validate items: ", valItems);
    if(Object.keys(valItems).length){

      if(valItems['date']) valItems['date'] = this.reverseDate(valItems['date']);
      this.send(valItems, "PUT");
    }
  }

  send(body, method?) {

    let url = "events/"+this.itemData.id+"?_method=PUT";
    // body['buzi'] ="me";
    console.log(body);
    
    this.http.postData(url, body)
      .subscribe(response => {
        localStorage.setItem('success_server', JSON.stringify(response));
        // this.sync(body, response);
        // this.msgs(body, response);
        // if(response['errors']){
        console.log(response);
        this.msgNotify.success('פוסט\\מאמר', "פוסט\\מאמר  עודכן בהצלחה", {positionClass: "toast-top-left"});
        /**** send new customer to his own page *****/

      }, (err) => {
        localStorage.setItem('errors_server', JSON.stringify(err));
        console.log(err);
        this.msgNotify.errors('פוסט\\מאמר', "פרטים שגויים!", {positionClass: "toast-top-left"});

        if (err["status"] === 401) {
          // console.log(err['status']);

          // this.http.nextIslogged(false);
          // window.localStorage.removeItem('user_key');
          // window.location.reload();
        }
      });
  }

  fire(input: HTMLInputElement) {

    input = input ? input : <HTMLInputElement>document.getElementById("date");

    if (!this.fired && input) {
      this.datePicker = <HTMLDivElement>this.calendar.fire(false, this.eventEdit, input);
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
    elem.style.top = parentHeight + "px";
    // elem.style.right = 50 + "%";
    elem.classList.add('shadow-sm');
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

  toggleHidden(itemCller, targetInput) {

    if (itemCller.tagName == "SELECT" && itemCller.value == "other") {

      itemCller.parentElement.classList.remove('d-block');
      itemCller.parentElement.classList.add('d-none');
      targetInput.parentElement.classList.remove('d-none');
      targetInput.parentElement.classList.add('d-block');

      targetInput.hidden = !targetInput.hidden;
      this.eventEdit.controls['other'].setValue('');
    } else if (itemCller.tagName == "INPUT") {

      itemCller.parentElement.classList.remove('d-block');
      itemCller.parentElement.classList.add('d-none');
      targetInput.parentElement.classList.remove('d-none');
      targetInput.parentElement.classList.add('d-block');

      itemCller.hidden = !itemCller.hidden;
      this.eventEdit.controls['eventType'].setValue('');
      this.eventEdit.controls['other'].setValue(null);
    }
  }

  calendarDisplay(elem?: HTMLElement | boolean, className?: string, cBFn?) {
    elem = elem ? elem : this.datePicker;
    className = className ? className : "open";

    if (cBFn && typeof elem == "object") {
      cBFn(elem, this.hasClass(elem, className));
    } else {
      return (typeof elem == "object") ? this.hasClass(elem, className) : "Error";
    }
  }

  hasClass(elem: HTMLElement, className: string): boolean {
    return elem.classList.contains(className);
  }

  createEvents() {
    this.calendarDisplay(false, "open", (el, hasClass) => {
      hasClass ? this.toggleDisplay() : '';
    });
  }

  addEvents(event) {
    this.calendarDisplay(false, "open", (el, hasClass) => {
      hasClass ? this.toggleDisplay() : '';
    });
  }

  showEvents(arg?) { }

  daily(dateStr: string) { }

  weekly(dateStr?) {
    let currentDt = this.calendar.getCurrentDate();
    dateStr = dateStr ? dateStr : currentDt.getDate() + "-" + (currentDt.getMonth() + 1) + "-" + currentDt.getFullYear();
  }

  monthly() {
    this.showEvents();
  }

  yearly() { }

}
