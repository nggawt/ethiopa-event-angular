import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
import { FormProccesorService } from 'src/app/customers/form-proccesor.service';
import { CalendarDatePickerService } from 'src/app/calendar/calendar-date-picker.service';
declare var $: any;

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css', '../../../styles/date-picker.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EventCreateComponent implements OnInit {

  eventCreate: FormGroup;

  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  passwordPatt: string = '^\\w{6,}$';

  fired = false;
  datePicker: HTMLDivElement;

  constructor(private router: Router,
    private http: HttpService,
    private valForm: FormProccesorService,
    private calendar: CalendarDatePickerService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    /* this.http.isLogedIn.subscribe(
      (logged) => {
        logged? this.router.navigate(['/']): this.formInit();
      }
    ); */
    console.log("Create Events Component called!");

    this.formInit();
  }

  onSubmit() {
    console.log("create user");
    if (this.eventCreate.valid) {
      /****** handel form inputs *****/
      let formInputes = this.eventCreate;
      let details = formInputes.value;
      console.log(this.eventCreate.valid);

      /* let formInputes = this.eventCreate;
      let controls = formInputes.controls;
      
      
      let items = this.valForm.validate(controls, formInputes.value);
      let success = items['status'] ? items['success'] : false; */
      const theUrl = "http://ethio:8080/api/users";
      if (this.eventCreate.valid) {
        const body = new HttpParams()
          .set('name', details['name'])
          .set('email', details['email'])
          .set('password', details['password'])
          .set('passwordConfirm', details['passwordConfirm'])
          .set('city', details['city'])
          .set('area', details['area'])
          .set('tel', details['tel'])
          .set('about', details['about']);

        this.http.store(theUrl, body).
          subscribe(evt => {
            console.log(evt);

            if (evt['access_token']) {
              this.http.nextIslogged(true);
              $(".close").click();
              // location.reload();
              // this.router.navigate(['/']);
            }

          }, (err) => console.log(err));
      } else {
        /* messages errors */
        // console.log(items['errors']);

      }
    }
  }

  get f() { return this.eventCreate.controls; }

  private formInit() {
    this.eventCreate = new FormGroup({
      'date': new FormControl(null, [Validators.required]),
      'name': new FormControl(null, [Validators.required]),
      'eventType': new FormControl(null, [Validators.required]),
      'other': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required]),
      'location': new FormControl(null, [Validators.required]),
      'address': new FormControl(null, [Validators.required]),
      'phone': new FormControl(null, [Validators.required]),
      'description': new FormControl(null, [Validators.required])
    });

    /* $('#forgotPassword').modal();
    let thiz = this;
    $(document).on('hidden.bs.modal','.modal', function () {
      /// TODO EVENTS
      thiz.http.requestUrl? thiz.router.navigate([thiz.http.requestUrl]): thiz.router.navigate(['../'], {relativeTo: this.route});
    }); */
  }

  fire(input: HTMLInputElement) {

    input = input ? input : <HTMLInputElement>document.getElementById("date");

    if (! this.fired && input) {
      this.datePicker = <HTMLDivElement>this.calendar.fire(false, this.eventCreate, input);
      input.parentElement.style.position = "relative";
      
      this.setStyles(this.datePicker);
      this.confCalendar(this.datePicker);

      input.parentElement.appendChild(this.datePicker);
      this.fired = true;
    }
  }

  setStyles(elem){
    elem.classList.add('position-absolute');
    elem.style.right = 50+"%";
    elem.classList.add('w-50');
  }

  confCalendar(calendar: HTMLDivElement){

    $(document).on("click", (e) => {  
      if(calendar.contains(e.target) || e.target.id == "date"){
        if(e.target.id == "date" && $(calendar).is(':hidden')) this.toggleDisplay(calendar);
        e.stopPropagation();
        return false;  
      }
      
      if($(calendar).is(':visible')){
        this.toggleDisplay(calendar);
      } 
    });
    this.toggleDisplay(calendar); 
  }

  toggleDisplay(calendar?: HTMLDivElement){
    calendar = calendar? calendar: this.datePicker;
    (calendar.classList.toggle('open'))? calendar.style.zIndex = '99': calendar.style.zIndex = '0';
  }

  toggleHidden(itemCller, targetInput) {

    if (itemCller.tagName == "SELECT" && itemCller.value == "other") {

        itemCller.parentElement.classList.remove('d-block');
        itemCller.parentElement.classList.add('d-none');
        targetInput.parentElement.classList.remove('d-none');
        targetInput.parentElement.classList.add('d-block');
        // this.eventCreate.controls['eventType'].setValue('');

        targetInput.hidden = ! targetInput.hidden;
        this.eventCreate.controls['other'].setValue('');
    } else if (itemCller.tagName == "INPUT") {
        
        itemCller.parentElement.classList.remove('d-block');
        itemCller.parentElement.classList.add('d-none');
        targetInput.parentElement.classList.remove('d-none');
        targetInput.parentElement.classList.add('d-block');

        itemCller.hidden = ! itemCller.hidden;
        this.eventCreate.controls['eventType'].setValue('');
        this.eventCreate.controls['other'].setValue(null);
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
    // this.eventCreate.reset();
    this.calendarDisplay(false, "open", (el, hasClass) => {
      hasClass ? this.toggleDisplay() : '';
    });
  }

  addEvents(event) {

    this.calendarDisplay(false, "open", (el, hasClass) => {
      hasClass ? this.toggleDisplay() : '';

    });
    // console.log(event['date']);
    // let eventCopy = Object.assign(event, {date: this.tableEvents.dateToStr(event['date'])});
    /* let eventCopy = Object.assign({}, event);
    let eventAdded = Object.assign(eventCopy, { date: this.tableEvents.dateToStr(event['date']) });
    // let dt = this.tableEvents.dateToStr(event['date']);

    for (let ii in this.eventCreate.controls) {
        (eventAdded[ii]) ? this.eventCreate.controls[ii].setValue(eventAdded[ii]) : '';
    } */
  }

  showEvents(arg?) {
    /* let evts = (arg) ? arg : this.eventsOb['events'];

    let parent = $('.add-events')[0],
        // hasEvt = this.eventsOb['hasEvents']() ? true : false,
        monthKey = this.tableEvents.numAppendSero(this.calendar.getCurrentDate().getMonth() + 1),
        key = !arg ? monthKey + "-" + this.calendar.getCurrentDate().getFullYear() : Object.keys(evts)[0];

    if (parent.children.length > 0) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
    // console.log(key);
    // console.log(evts);
    (evts[key]) ? parent.appendChild(evts[key]) : this.tableEvents.noEvents(parent); */
  }

  daily(dateStr: string) {

  }

  weekly(dateStr?) {
    let currentDt = this.calendar.getCurrentDate();
    dateStr = dateStr ? dateStr : currentDt.getDate() + "-" + (currentDt.getMonth() + 1) + "-" + currentDt.getFullYear();

    // this.showEvents(this.tableEvents.weekly(dateStr));
  }

  monthly() {
    this.showEvents();
  }

  yearly() {
    // this.showEvents(this.tableEvents.yearly());
  }
}
