import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, CanDeactivate } from '@angular/router';
import { CustomersDataService } from '../../../../../customers/customers-data-service';
import { Observable, of } from 'rxjs';
import { HallType } from '../../../../../customers/hall-type';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { HttpService } from '../../../../../services/http-service/http.service';
import { find, tap } from 'rxjs/operators';
import { CanDeactivateComponent } from '../../../../../services/can-deactivate-guard/can-deactivate-guard.service';
import { CalendarDatePickerService } from 'src/app/calendar/calendar-date-picker.service';
import { CreateDateTableService } from 'src/app/services/create-date-table/create-date-table.service';
declare var $: any;

@Component({
  selector: 'app-events-edit',
  templateUrl: './events-edit.component.html',
  styleUrls: ['./events-edit.component.css', '../../../../../styles/style.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class EventsEditComponent implements OnInit, CanDeactivateComponent {

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

  eventsOb: Object = {};

  isTrue: Observable<boolean> = of(false);
  childInstans: {} | any;
  formMethod: string = 'create';

  constructor(
    private halls: CustomersDataService,
    private http: HttpService,
    private calendar: CalendarDatePickerService,
    private tableEvents: CreateDateTableService) { }

  ngOnInit() {

    this.halls.customerObsever.pipe(
      find((val) => val['customer']['id'])
    ).subscribe(cost => {

      let customer = cost['customer'];
      let cId = (customer && customer["user_id"]) ? customer["user_id"] : false;
      let authUser: any = this.http.authUser;
      let uId = authUser ? authUser["id"] : false;

      (cId === uId) ? this.initApp(customer) : '';

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

    this.http.getData().subscribe((eventsList: Array<{}>) => {
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
    let updaterUrl = "http://ethio:8080/api/events/" + event["id"] + "? _method=delete";

    this.http.postData(updaterUrl, event).subscribe((response) => {
      console.log(response);

    });
  }

  createEvents() {
    this.formEvents.reset();
    this.calendar.calendarDisplay(false, "open", (el, hasClass) => {
      hasClass ? this.calendar.toggleDisplay() : '';
    });

    this.formMethod = "create";
    this.childInstans.formMethod = this.formMethod;
  }

  addEvents(event) {

    this.childInstans.formMethod = this.formMethod;

    this.calendar.calendarDisplay(false, "open", (el, hasClass) => {
      hasClass ? this.calendar.toggleDisplay() : '';

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
      this.calendar.createHtms(input);
      this.calendar.fire(this, this.formEvents);
      this.fired = true;
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
}
