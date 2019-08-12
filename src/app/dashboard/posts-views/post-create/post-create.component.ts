import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
import { FormProccesorService } from 'src/app/customers/form-proccesor.service';
import { NotificationService } from 'src/app/services/messages/notification.service';
import { CalendarDatePickerService } from 'src/app/calendar/calendar-date-picker.service';
declare var $: any;

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css', '../../../styles/date-picker.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class PostCreateComponent implements OnInit {

  postCreate: FormGroup;
  mdProps = {
    id: 'create_post',
    modalSize: "modal-lg",
    name: "פוסט",
    emailTo: "",
    title: 'צור פוסט'
  };

  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  passwordPatt: string = '^\\w{6,}$';
  quill: {};

  fired = false;
  datePicker: HTMLDivElement;

  constructor(private http: HttpService,
    private msgNotify: NotificationService,
    private calendar: CalendarDatePickerService) { }

  ngOnInit() { this.formInit(); }

  get f() { return this.postCreate.controls; }

  private formInit() {

    this.postCreate = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [Validators.required]),
      body: new FormControl(null, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      confirmed: new FormControl(false, [Validators.required])
    });
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

  onSubmit() {
    console.log(this.postCreate);

    if (true) {// this.postCreate.valid
      /****** handel form inputs *****/
      this.send(this.postCreate.value);
    }
  }

  send(body, customer?) {

    let url = "blog";
    body['buzi'] = "me";
    console.log(body);

    this.http.postData(url, body)
      .subscribe(response => {
        localStorage.setItem('success_server', JSON.stringify(response));
        // this.sync(body, response);
        // this.msgs(body, response);
        // if(response['errors']){
        console.log(response);
        this.msgNotify.showSuccess('פוסט\\מאמר', "פוסט\\מאמר  נוצר בהצלחה", { positionClass: "toast-top-left" });
        /**** send new customer to his own page *****/

      }, (err) => {
        localStorage.setItem('errors_server', JSON.stringify(err));
        console.log(err);
        this.msgNotify.showErrors('פוסט\\מאמר', "פרטים שגויים!", { positionClass: "toast-top-left" });

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
      this.datePicker = <HTMLDivElement>this.calendar.fire(false, this.postCreate, input);
      input.parentElement.style.position = "relative";

      this.setStyles(this.datePicker);
      this.confCalendar(this.datePicker);

      input.parentElement.appendChild(this.datePicker);
      this.fired = true;
    }
  }

  setStyles(elem) {
    elem.classList.add('position-absolute');
    elem.style.right = 50 + "%";
    elem.classList.add('w-50');
  }

  confCalendar(calendar: HTMLDivElement) {

    $(document).on("click", (e) => {
      if (calendar.contains(e.target) || e.target.id == "date") {
        if (e.target.id == "date" && $(calendar).is(':hidden')) this.toggleDisplay(calendar);
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
      this.postCreate.controls['other'].setValue('');
    } else if (itemCller.tagName == "INPUT") {

      itemCller.parentElement.classList.remove('d-block');
      itemCller.parentElement.classList.add('d-none');
      targetInput.parentElement.classList.remove('d-none');
      targetInput.parentElement.classList.add('d-block');

      itemCller.hidden = !itemCller.hidden;
      this.postCreate.controls['eventType'].setValue('');
      this.postCreate.controls['other'].setValue(null);
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

  showEvents(arg?) {
  }

  daily(dateStr: string) {
  }

  weekly(dateStr?) {
    let currentDt = this.calendar.getCurrentDate();
    dateStr = dateStr ? dateStr : currentDt.getDate() + "-" + (currentDt.getMonth() + 1) + "-" + currentDt.getFullYear();
  }

  monthly() {
    this.showEvents();
  }

  yearly() {
  }
}
