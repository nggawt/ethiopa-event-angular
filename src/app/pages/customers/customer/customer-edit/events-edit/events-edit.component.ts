import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core'; 
import { CustomersDataService } from '../../../../../customers/customers-data-service';
import { Observable, of, Subscription } from 'rxjs'; 
import { FormGroup, FormControl, Validators } from '@angular/forms'; 
import { HttpService } from '../../../../../services/http-service/http.service';
import { find } from 'rxjs/operators';
import { CanDeactivateComponent } from '../../../../../services/can-deactivate-guard/can-deactivate-guard.service';
import { CalendarDatePickerService } from 'src/app/calendar/calendar-date-picker.service';
import { CreateDateTableService } from 'src/app/services/create-date-table/create-date-table.service';
import { AuthService } from 'src/app/services/http-service/auth.service';
import { Evt } from 'src/app/types/event-type';
declare var $: any;

@Component({
  selector: 'app-events-edit',
  templateUrl: './events-edit.component.html',
  styleUrls: ['./events-edit.component.css', '../../../../../styles/style.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class EventsEditComponent implements OnInit, OnDestroy, CanDeactivateComponent {

  phoneNum: RegExp = /^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})/;
  emailPatteren: RegExp = /^[a-z]+[a-zA-Z_\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$/;
  datePattern: RegExp = /^\b((?=0)0[1-9]|(?=[1-9])[1-9]|(?=[1-2])[1-2][0-9]|(?=3)3[0-1])\-((?=0)0[1-9]|(?=[1-9])[1-9]|(?=1)1[0-2]?)\-20((?=1)19|(?=2)2[0-5])$/;//\d{2}\-\d{2}\-\d{4}
  /***************  ********************///((?=0)0[1-9]|(?=[1-9])[1-9]|(?=[1-2])[1-2][1-9]|(?=3)3[0-1])   |(?=[1-2])[1-2][1-9]?|(?=3)3[0-1])
  /* **************************** *///((?=0)0[1-9]|(?=1)1[0-2])
  /***************  ********************/
  customer;
  cust;
  fired: boolean = false;
  tableIncrement: number = 1;
  /* **************************** */
  formEvents: FormGroup;
  datePicker: HTMLDivElement;

  eventsOb: Object = {};
  evt$: Subscription;

  isTrue: Observable<boolean> = of(false);
  childInstans: {} | any;
  formMethod: string = 'create';

  constructor(
    private halls: CustomersDataService,
    private http: HttpService,
    private calendar: CalendarDatePickerService,
    private tableEvents: CreateDateTableService,
    private auth: AuthService) { }

  ngOnInit() {

    this.halls.customerObsever.pipe(
      find((val) => val['customer']['id'])
    ).subscribe(cost => {

      let customer = cost['customer'];
      let cId = (customer && customer["user_id"]) ? customer["user_id"] : false;
      let authUser: any = this.auth.authUser;
      let uId = authUser ? authUser["id"] : false;

      if(cId === uId || authUser['authority'].name == "Admin"){
        this.initApp(customer);
      } 
    });
  }

  async initApp(customer) {
    this.customer = customer;
    this.formInt();

    this.isTrue = of(true);
    await this.initEvents();
    // await 
  }

  initEvents() {

    this.evt$ = this.http.getData("events").subscribe((eventsList: Array<{}>) => {
      if (eventsList) {
        let tablesEvents = this.tableEvents.initEvents(eventsList, this, "advanced");
        // this.eventsOb = tablesEvents;
        this.eventsOb['events'] = tablesEvents;

        this.showEvents();
        this.fire(document.getElementById('date'));
      }
    });// END SUBSCRIBEr FN
  }

  delEvents(event) {
    console.log(event);
    let updaterUrl = "http://lara.test/api/events/" + event["id"] + "? _method=delete";

    this.http.postData(updaterUrl, event).subscribe((response) => {
      console.log(response);

    });
  }

  createEvents() {
    this.formEvents.reset();
    this.calendarDisplay(false, "open", (el, hasClass) => {
      hasClass ? this.toggleDisplay() : '';
    });

    this.formMethod = "create";
    this.childInstans.formMethod = this.formMethod;
  }

  addEvents(event) {

    this.childInstans.formMethod = this.formMethod;

    this.calendarDisplay(false, "open", (el, hasClass) => {
      hasClass ? this.toggleDisplay() : '';

    });
    console.log(event['date']);

    // let eventCopy = Object.assign(event, {date: this.tableEvents.dateToStr(event['date'])});
    let eventCopy = Object.assign({}, event);
    let eventAdded = Object.assign(eventCopy, { date: this.tableEvents.dateToStr(event['date']) });
    // let dt = this.tableEvents.dateToStr(event['date']);
    this.formMethod = "update";
    this.childInstans.formMethod = this.formMethod;
    this.childInstans.eventObj = eventAdded;

    for (let ii in this.formEvents.controls) {
      (eventAdded[ii]) ? this.formEvents.controls[ii].setValue(eventAdded[ii]) : '';
    }
  }

  showEvents(arg?) {
    let evts = (arg) ? arg : this.eventsOb['events'];

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
    (evts[key]) ? parent.appendChild(evts[key]) : this.tableEvents.noEvents(parent);
  }

  daily(dateStr: string) {
    let currentDt = this.calendar.getCurrentDate();
    dateStr = dateStr ? dateStr : currentDt.getDate() + "-" + (currentDt.getMonth() + 1) + "-" + currentDt.getFullYear();

    this.showEvents(this.tableEvents.daily(dateStr));
  }

  weekly(dateStr?) {
    let currentDt = this.calendar.getCurrentDate();
    dateStr = dateStr ? dateStr : currentDt.getDate() + "-" + (currentDt.getMonth() + 1) + "-" + currentDt.getFullYear();

    this.showEvents(this.tableEvents.weekly(dateStr));
  }

  monthly() {
    this.showEvents();
  }

  yearly() {
    this.showEvents(this.tableEvents.yearly());
  }
  
  fire(input) {

    input = input ? input : document.getElementById("date");

    if (!this.fired && input) {
      // this.calendar.createHtms(input, {append: true});
      this.datePicker = this.calendar.fire(this, this.formEvents, input);

      input.parentElement.parentElement.appendChild(this.datePicker);
      this.toggleDisplay();
      this.setEvents(input);
      this.fired = true;
    }
  }

  setEvents(input): void {
    let thiz = this;

    input.addEventListener('click', () => {
      thiz.toggleDisplay();
    }, false);

    /* this.closeBtn.addEventListener('click', (e) => {

      let spanEl: HTMLSpanElement = <HTMLSpanElement>e.target;
      if (spanEl.tagName === "SPAN") {
        //createCalendar.updateItems(e.target.innerHTML);
        // thiz.divChild["style"].display = "none";
        // thiz.toggleDisplay();
      }
    }, false); */
  }

  toggleDisplay() {
    let divChildHasOpen = this.hasClass(this.datePicker, "open"),
      divChildHasClose = this.hasClass(this.datePicker, "close"),
      formDiv = $("#customGroup")[0],
      formDivHassClassOpen = this.hasClass(formDiv, "open"),
      formDivHassClassClose = this.hasClass(formDiv, "close");

    if (divChildHasOpen) {
      this.datePicker.classList.remove('open');
      (divChildHasClose) ? "" : this.datePicker.classList.add('close');

      if (formDivHassClassClose) formDiv.classList.remove('close');
      (formDivHassClassOpen) ? "" : formDiv.classList.add('open');
    } else {
      this.datePicker.classList.add('open');
      if (divChildHasClose) this.datePicker.classList.remove('close');

      (formDivHassClassClose) ? "" : formDiv.classList.add('close');
      if (formDivHassClassOpen) formDiv.classList.remove('open');
    }
  }

  hasClass(elem: HTMLElement, className: string): boolean {
    return elem.classList.contains(className);
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

  childIns(evt) {
    let key = Object.keys(evt);
    this.childInstans = evt[key[0]];
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

    return (this.childInstans.canLeaveThePage()) ? confirm("לא שמרתה את הפרטים. תרצה לעזוב דף זה בכל זאת?") : true;
  }

  get f() { return this.formEvents.controls; }

  private formInt() {

    this.formEvents = new FormGroup({
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
    // this.formEvents.valueChanges.subscribe((data) => {
    //     // this.formEvents.patchValue({ firstName: data.firstName, lastName: data.lastName }, { emitEvent: false });
    //     console.log(data);
    // });
  }

  ngOnDestroy(){
    this.evt$? this.evt$.unsubscribe(): '';
  }
}
