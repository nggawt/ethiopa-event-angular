import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
import { CalendarDatePickerService } from 'src/app/calendar/calendar-date-picker.service';
import { NotificationService } from 'src/app/services/messages/notification.service';
import { ResourcesService } from 'src/app/services/resources/resources.service';
import { NgValidateSrvService } from 'src/app/services/validators/ng-validate-srv.service';
declare var $: any;

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css', '../../../styles/date-picker.component.css', '../../../styles/form-inputs.css'],
  encapsulation: ViewEncapsulation.None
})
export class EventCreateComponent implements OnInit, AfterViewInit {

  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  passwordPatt: string = '^\\w{6,}$';

  formMethod = "post";
  messages:any = false;

  eventCreate: FormGroup;
  users: {id: number, name: string, email: string, about: string, area: string, address: string, eventType:string, city:string, tel: string}[];

  fired = false;
  datePicker: HTMLDivElement;

  constructor(private http: HttpService,
    private msgNotify: NotificationService,
    private calendar: CalendarDatePickerService,
    private rsrv: ResourcesService) { }

  ngOnInit() {
    this.formInit();
    this.getUsers();
  }

  protected getUsers() {

    this.rsrv.getResources('users', false).then(users => {
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

  get f() { return this.eventCreate.controls; }

  setOwnerUser(userId){
    let user = this.users.find(user => user.id == userId);
    console.log(user);

    user? this.eventCreate.patchValue({
      email: user.email,
      name: user.name,
      phone: user.tel,
      location: user.city,
    }, {onlySelf: true}): '';
  }

  private formInit() {
    this.eventCreate = new FormGroup({
      'date': new FormControl(null, [Validators.required]),
      'name': new FormControl(null, [Validators.required]),
      'owner': new FormControl(null),
      'eventType': new FormControl(null, [Validators.required]),
      'other': new FormControl(null),
      'email': new FormControl(null, [Validators.required]),
      'location': new FormControl(null, [Validators.required]),
      'address': new FormControl(null, [Validators.required]),
      'phone': new FormControl(null, [Validators.required]),
      'descriptions': new FormControl(null, [Validators.required]),
      'confirmed': new FormControl(false)
    });
  }

  onSubmit() {
    console.log(this.eventCreate);

    if (this.eventCreate.valid) {
      /****** handel form inputs *****/
      // let dt = this.eventCreate.value['date'];
      let valItems = this.eventCreate.value;
      valItems['date'] = valItems['date'].split('-').reverse().join("-");
      this.send(valItems);
    }
  }

  send(body) {

    let url = "events";
    console.log(body);
    this.http.postData(url, body)
      .subscribe(response => {
        console.log(response);
        this.msgNotify.success('אירוע', "אירוע נוצר בהצלחה", { positionClass: "toast-top-left" });
      }, (err) => {
        localStorage.setItem('errors_server', JSON.stringify(err));
        this.msgNotify.errors('אירוע', "פרטים שגויים!", { positionClass: "toast-top-left" });
        if (err["status"] === 401) {
        }
      });
  }

  fire(input: HTMLInputElement) {

    input = input ? input : <HTMLInputElement>document.getElementById("date");

    if (!this.fired && input) {
      this.datePicker = <HTMLDivElement>this.calendar.fire(false, this.eventCreate, input);
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

  toggleHidden(itemCller, targetInput) {
    console.log(itemCller, targetInput);
    
    if (itemCller.tagName == "SELECT" && itemCller.value == "other") {

      itemCller.parentElement.parentElement.classList.remove('d-block');
      itemCller.parentElement.parentElement.classList.add('d-none');
      targetInput.parentElement.parentElement.classList.remove('d-none');
      targetInput.parentElement.parentElement.classList.add('d-block');
      // this.eventCreate.controls['eventType'].setValue('');

      targetInput.hidden = !targetInput.hidden;
      this.eventCreate.controls['other'].setValue('');
    } else if (itemCller.tagName == "INPUT") {

      itemCller.parentElement.parentElement.classList.remove('d-block');
      itemCller.parentElement.parentElement.classList.add('d-none');
      targetInput.parentElement.parentElement.classList.remove('d-none');
      targetInput.parentElement.parentElement.classList.add('d-block');

      itemCller.hidden = !itemCller.hidden;
      this.eventCreate.controls['eventType'].setValue('');
      this.eventCreate.controls['other'].setValue(false);
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

  showEvents(arg?) {  }

  daily(dateStr: string) {

  }

  weekly(dateStr?) {
    let currentDt = this.calendar.getCurrentDate();
    dateStr = dateStr ? dateStr : currentDt.getDate() + "-" + (currentDt.getMonth() + 1) + "-" + currentDt.getFullYear();
  }

  monthly() {
    this.showEvents();
  }

  yearly() { }

  inputReset(customer) {
    let comp = customer['id'];
    console.log(this.eventCreate.controls);
    this.eventCreate.controls[comp].reset();
  }

  reset(){
    alert("reset fn need implementation");
  }

  close(){
    alert("close fn need implementation");
  }

  allTodefault(){
    alert("allTodefault fn need implementation");
  }
}
