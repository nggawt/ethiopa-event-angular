import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
import { FormProccesorService } from 'src/app/customers/form-proccesor.service';
import { NotificationService } from 'src/app/services/messages/notification.service';
import { CalendarDatePickerService } from 'src/app/calendar/calendar-date-picker.service';
import { ResourcesService } from 'src/app/services/resources/resources.service';
declare var $: any;

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css', '../../../styles/date-picker.component.css', '../../../styles/form-inputs.css'],
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
      placeholder_text_single: "בחר משתמש",
    }).on('change', function(evt, params) {
      console.log(this, ' : ',evt , params);
      thiz.setOwnerUser(+(params.selected));
    });
  }

  setOwnerUser(userId){
    let user = this.users.find(user => user.id == userId);
    console.log(user);

    user? this.postCreate.patchValue({
      email: user.email,
      name: user.name,
      phone: user.tel,
      location: user.city,
    }, {onlySelf: true}): '';
  }

  get f() { return this.postCreate.controls; }

  private formInit() {

    this.postCreate = new FormGroup({
      owner: new FormControl(null),
      name: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [Validators.required]),
      body: new FormControl(null, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      confirmed: new FormControl(false, [Validators.required])
    });
  }
  
  reverseDate(dt: string){
    let time =  (dt.indexOf(" ") > 0)? dt.split(" ")[1]: false;
    let dtText = time? dt.split(" ")[0].split('-').reverse().join('-')+" "+ time: dt.split('-').reverse().join('-');
    return dtText;
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
      let valItems = this.postCreate.value;
      if(valItems['date']) valItems['date'] = this.reverseDate(valItems['date']);
      this.send(valItems);
    }
  }

  send(body) {

    let url = "articles";
    console.log(body);
    this.http.postData(url, body)
      .subscribe(response => {
        localStorage.setItem('success_server', JSON.stringify(response));
        // this.sync(body, response);
        // this.msgs(body, response);
        // if(response['errors']){
        console.log(response);
        this.msgNotify.success('פוסט\\מאמר', "פוסט\\מאמר  נוצר בהצלחה", { positionClass: "toast-top-left" });
        /**** send new customer to his own page *****/

      }, (err) => {
        localStorage.setItem('errors_server', JSON.stringify(err));
        console.log(err);
        this.msgNotify.errors('פוסט\\מאמר', "פרטים שגויים!", { positionClass: "toast-top-left" });

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

  monthly() { this.showEvents(); }

  yearly() {  }
}
