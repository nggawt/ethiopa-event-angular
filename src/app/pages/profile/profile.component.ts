import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';
import { CalendarDatePickerService } from 'src/app/calendar/calendar-date-picker.service';
import { CreateDateTableService } from 'src/app/services/create-date-table/create-date-table.service';
import { HttpService } from 'src/app/services/http-service/http.service';
import { ValidationService } from 'src/app/services/validation/validation.service';
import { User } from 'src/app/types/user-type';
import { MessagesService } from 'src/app/services/messages/messages.service';
import { AuthService } from 'src/app/services/http-service/auth.service';

declare var $;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
  phoneNum: RegExp = /^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})/;
  emailPatteren: string = '^[a-z]+[a-zA-Z_\\d\\.]*@[A-Za-z]{2,10}\\.[A-Za-z]{2,3}(?:\\.?[a-z]{2})?$';
  // emailPatteren: RegExp = /^[a-z]+[a-zA-Z_\d\.]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$/;
  datePattern: RegExp = /^\b((?=0)0[1-9]|(?=[1-9])[1-9]|(?=[1-2])[1-2][0-9]|(?=3)3[0-1])\-((?=0)0[1-9]|(?=[1-9])[1-9]|(?=1)1[0-2]?)\-20((?=1)19|(?=2)2[0-5])$/;//\d{2}\-\d{2}\-\d{4}
  timePattern: RegExp = /^\b((?=0)0[0-9]|(?=1)1[0-9]|(?=2)2[0-3])\:((?=0)0[0-9]|(?=1)1[0-9]|(?=[0-5])[0-5][0-9])$/;
  /***************  ********************/
  formSetting: FormGroup;

  user: User | boolean;
  show: boolean = true;
  messages: {} | boolean;
  eventsOb: Object = {};
  currentEvt;
  date: Date = new Date();
  datePicker: HTMLDivElement;

  private itemsRule: object = {
    name: "required|string|min:3|max:30",
    eventType: "required|string|min:3",
    date: "required",//|numric|exact:10
    email: "required",
    phone: "required",
    location: "required|string|min:3",
    time: "required|string|min:4|max:5",
    address: "required|string|min:6",
    description: "required|string|min:12",
    other: "required|string|min:3",
  };

  fired: boolean = false;
  /* **************************** */
  formEvents: FormGroup;
  allowFormSetting: Observable<boolean> = of(false);
  formMethod: string = this.eventsOb['hasEvents'] && this.eventsOb['hasEvents']() ? "update" : 'create';
  hasClassShow = false;

  constructor(private http: HttpService,
    private calendar: CalendarDatePickerService,
    private tableEvents: CreateDateTableService,
    private valForm: ValidationService,
    private msgSrv: MessagesService,
    private router: Router,
    private auth: AuthService) { }

  ngOnInit() {

    this.getUser();
  }

  logItem(item) {
    console.log(item);
  }

  getUser() {
    this.auth.userObs.pipe(
      first((user) => user['id'])
    ).subscribe((user) => {
      console.log(user);
      this.user = typeof user == "number" ? false : user;// typeof user == "number"? of(false): of(user);
      // this.initApp();

      if (this.user['events']) this.initEvents();

      this.formInt();
      this.initFormSetting();
    });
  }

  initEvents() {

    if (!this.fired && this.user['events']) {
      let tablesEvents = this.tableEvents.initEvents(this.user['events'], this, "advanced");
      this.eventsOb['events'] = tablesEvents;
      console.log(this.user['events']);

      setTimeout(() => {
        // this.showEvents();
        this.fire(document.getElementById('date'));
        this.showEvents();
        let thiz = this;
        $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
          e.target // newly activated tab
          e.relatedTarget // previous active tab
          console.log(e.target.id == 'nav-settings-tab');
          // thiz.allowFormSetting = of(e.target.id == 'nav-settings-tab');
          // console.log(thiz);

          thiz.hasClassShow = (e.target.id == 'nav-settings-tab');
        });
      }, 1000);
    }
  }

  get f() { return this.formEvents.controls; }

  // hasShowClass(divTag: HTMLDivElement) {
  //   return divTag.classList.contains('show');
  // }

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

  createEvents() {
    this.formEvents.reset();
    this.calendarDisplay(false, "open", (el, hasClass) => {
      hasClass ? this.toggleDisplay() : '';
    });

    this.formMethod = "create";
  }

  addEvents(event) {

    this.calendarDisplay(false, "open", (el, hasClass) => {
      hasClass ? this.toggleDisplay() : '';

    });

    let hours = event['date'].getHours().toString().length < 2 ?
      "0" + event['date'].getHours().toString() : event['date'].getHours().toString(),
      minutes = event['date'].getMinutes().toString().length < 2 ? event['date'].getMinutes() > 6 ?
        "0" + event['date'].getMinutes().toString() : event['date'].getMinutes().toString() + "0" : event['date'].getMinutes().toString(),
      eventCopy = Object.assign({}, event),
      dt = { date: this.tableEvents.dateToStr(event['date']), time: hours + ":" + minutes },
      eventAdded = Object.assign(eventCopy, dt);

    this.formMethod = "update";
    this.formEvents.reset();
    (this.messages && Object.keys(this.messages).length) ? this.messages = {} : '';
    for (let ii in this.formEvents.controls) {
      (eventAdded[ii]) ? this.formEvents.controls[ii].setValue(eventAdded[ii]) : '';
    }
    console.log(eventAdded);
    this.currentEvt = eventAdded;
  }

  showEvents(arg?) {
    let evts = (arg) ? arg : this.eventsOb['events'];

    let parent = $('.add-events')[0],
      // hasEvt = this.eventsOb['hasEvents']() ? true : false,
      monthKey = this.tableEvents.numAppendSero(this.calendar.getCurrentDate().getMonth() + 1),
      key = !arg ? monthKey + "-" + this.calendar.getCurrentDate().getFullYear() : Object.keys(evts)[0];

    if (parent && parent.children.length > 0) {
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

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    console.log("can leave the page");

    return true;
    // return (this.canLeaveThePage()) ? confirm("לא שמרתה את הפרטים. תרצה לעזוב דף זה בכל זאת?") : true;
  }

  private formInt() {

    this.formEvents = new FormGroup({
      'date': new FormControl(null, [Validators.required]),
      'name': new FormControl(null, [Validators.required]),
      'eventType': new FormControl(null, [Validators.required]),
      'other': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required]),
      'location': new FormControl(null, [Validators.required]),
      'address': new FormControl(null, [Validators.required]),
      'time': new FormControl(null, [Validators.required]),
      'phone': new FormControl(null, [Validators.required]),
      'description': new FormControl(null, [Validators.required])
    });

    // this.formEvents.valueChanges.subscribe((data) => {
    //     // this.formEvents.patchValue({ firstName: data.firstName, lastName: data.lastName }, { emitEvent: false });
    //     console.log(data);
    // });
  }

  initFormSetting() {

    this.formSetting = new FormGroup({
      'changePassword': new FormGroup({
        'currentPassword': new FormControl(null, [Validators.required]),
        'newPassword': new FormControl(null, [Validators.required]),
        'passwordConf': new FormControl(null, [Validators.required]),
      }),
      'changeEmail': new FormGroup({
        'currentEmail': new FormControl(null, [Validators.required]),
        'newEmail': new FormControl(null, [Validators.required]),
        'passwordEmail': new FormControl(null, [Validators.required]),
      }),
      'deleteAccount': new FormGroup({
        'delAccountEmail': new FormControl(null, [Validators.required]),
        'accountPassword': new FormControl(null, [Validators.required]),
        'feedback': new FormControl(null, [Validators.required]),
      })
    });
  }

  displayMessages(item) {

    let joinedKeys: RegExp = new RegExp(Object.keys(this.formSetting.controls[item.id].value).join('|'), "g");
    return this.messages ? (joinedKeys.test(Object.keys(this.messages).join())) ? true : false : false;
  }

  inputReset(event) {
    console.log(event);
    (event['id'] && this.formEvents.controls[event['id']]) ? this.formEvents.controls[event['id']].reset() : '';
  }

  default(event) {
    let comp = event.id;
    this.formEvents.controls[comp].setValue(this.currentEvt[comp]);
    // console.log(this.currentEvt);
  }

  allTodefault() {

    let controls = this.formEvents.controls;

    for (let ii in controls) {
      if (controls.hasOwnProperty(ii)) {
        if (controls[ii].value !== this.currentEvt[ii]) {
          if (this.currentEvt[ii]) controls[ii].setValue(this.currentEvt[ii]);
        }
      }
    }
  }

  async resetMessages() {
    let response = await this.msgSrv.resetMessages();
    this.messages = await response;

    /* await this.valForm.resetMessages().then(res => {
      this.messages = res;
    }); */
  }

  reset() {
    this.formEvents.reset();
  }

  close() {
    this.router.navigate(['../../']);
  }

  selectedText(item) {
    this.formEvents.controls.eventType.setValue(item.options[item.selectedIndex].text);
  }

  toggleHidden(itemCller, targetInput) {

    if (itemCller.tagName == "SELECT" && itemCller.value == "other") {
      console.log("called");

      itemCller.parentElement.classList.remove('d-block');
      itemCller.parentElement.classList.add('d-none');
      targetInput.hidden = !targetInput.hidden;
      // this.formEvents.controls['eventType'].setValue('');
      this.formEvents.controls['other'].setValue('');
    } else if (itemCller.tagName == "INPUT") {

      targetInput.parentElement.classList.remove('d-none');
      targetInput.parentElement.classList.add('d-block');
      itemCller.hidden = !itemCller.hidden;
      this.formEvents.controls['eventType'].setValue('');
      this.formEvents.controls['other'].setValue(null);
    }
  }

  update(input) {
    console.log(this.formEvents.controls[input.id]);
    let control = { [input.id]: this.formEvents.controls[input.id] },
      rules: object = this.getUpdateItemsRule(control),
      // items = (Object.keys(rules['items']).length >= 1)? this.valForm.validate(control, rules['items']): [];
      items = this.valForm.validate(control, rules['items']);
    console.log(Object.keys(rules).length);
    console.log(rules);
    console.log(items);

    (this.messages && Object.keys(this.messages).length) ? this.messages = false : '';

    if (rules['errors']) {
      this.messages = rules['errors'];
      return false;
    }

    let success = items['success'];
    // let success = Array.isArray(items) ? items.length: items['success'];
    if (success && items['status']) {
      console.log("sending params to server!");
      // input.append('formInputs', JSON.stringify(items['success']));
      this.send(items['success'], 'PATCH');
    } else {
      // this.messages = items['errors'];
      this.setMsgs(items, rules);

      /* 
      this.valForm.resetMessages().then(res => {
    
            this.messages = res;
      });
      */
    }
    // return false;
    // let input: FormData = new FormData();

  }

  delEvents(event) {
    console.log(event);
    let updaterUrl = "http://lara.test/api/events/" + event["id"] + "?_method=delete";

    this.http.postData(updaterUrl, event).subscribe((response) => {
      console.log(response);

    });
  }

  onSubmit(clllback) {

    let controls = this.formEvents.controls;
    (this.formEvents.controls['eventType'].value == "other") ? this.formEvents.controls['eventType'].setValue(this.formEvents.controls['other'].value) : '';
    (this.messages && Object.keys(this.messages).length) ? this.messages = false : '';

    /* form method is equal create */
    // all fields require
    // all fields must pass vlidation

    // let controlCopy = Object.assign(controls, {name:["buzz"]});
    let rules: object = (this.formMethod == "update") ? this.getUpdateItemsRule(controls) : this.itemsRule;
    let itemRules = rules['items'] ? rules['items'] : rules;
    console.log(this.formEvents);
    /* form method is equal update */
    // only current fields must pass vlidation

    // validation: type, event-exist, min-max min-max-len-char, same

    if (rules['errors']) {
      this.messages = rules['errors'];
      return false;
    }

    let items = this.valForm.validate(controls, itemRules, this.currentEvt);
    console.log(items);
    console.log(controls);
    //if(items['status'] === false) this.messages.push(items['errors']);
    let status = items['status'];

    if (clllback && typeof clllback == 'object') return clllback(items);
    let success = items['success'];

    if (status && Object.keys(success).length) {
      console.log("sending to server basic media comp");
      if (success['date'] || success['time']) success['date'] = this.strDateReverse(controls['date'].value) + " " + controls['time'].value;
      // items['success']['buzzi'] = "ngga";
      if (success['time']) delete success['time'];
      console.log(success);

      let method = (this.formMethod == "update") ? "PUT" : false;
      this.send(success, method);
    } else {//if (/* ! items['status'] &&  */!status) 
      this.setMsgs(items, rules);
      /* if(items['errors'] && rules['warning']) Object.keys(rules['warning']).forEach((item)=> {
        items['errors'][item]? items['errors'][item].pus(rules['warning'][item]): items['errors'][item] = rules['warning'][item];
      });

      this.messages = items['errors']? items['errors']: rules['warning']? rules['warning']: false;
      console.log("im not validated");
      console.log(rules);

      this.msgSrv.resetMessages(9000).then(res => {
        // this.messages = res;
      }); */
    }
  }

  setMsgs(items, rules?) {

    if (items['errors'] && rules && rules['warning']) Object.keys(rules['warning']).forEach((item) => {
      items['errors'][item] ? items['errors'][item].pus(rules['warning'][item]) : items['errors'][item] = rules['warning'][item];
    });
    console.log(items);

    this.messages = items['errors'] ? items['errors'] : rules && rules['warning'] ? rules['warning'] : items['warning'] ? items['warning'] : false;
    console.log("im not validated");
    console.log(rules);

    this.msgSrv.resetMessages(9000).then(res => {
      // this.messages = res;
    });
  }

  formSt(formGroups) {

    const theUrl = "http://lara.test/api/users/" + this.user["id"];
    const act: string | boolean = (formGroups.id == "changeEmail") ? "change_email" : (formGroups.id == "changePassword") ? "change_password" : false;
    let url = act ? theUrl + "/" + act : theUrl;
    let method = act ? 'PATCH' : (formGroups.id == "deleteAccount") ? "DELETE" : false;

    let rules: object = {
      email: "required",
      password: "required|string|min:6|max:30",
      passwordConf: "required|string|password|same|min:6|max:30",
      feedback: "string|min:6|max:30"
    };

    // console.log(this.formSetting.controls[formGroups.id]['controls']);
    let itemsGroup = this.formSetting.controls[formGroups.id];
    let items = itemsGroup['controls'];
    let bindedItemsRules = this.bindItemsRules(items, rules);
    console.log(bindedItemsRules);

    // let bindedItemsRules = (formGroups.id != "deleteAccount")? this.bindItemsRules(items, rules): false;
    let validatedItems = this.valForm.validate(items, bindedItemsRules);
    console.log(validatedItems);

    if (itemsGroup.valid && validatedItems && validatedItems['status']) {
      let itemsToSend = itemsGroup.value;
      console.log(itemsToSend);
      if (formGroups.id == "changePassword") itemsToSend['email'] = this.user['email'];
      this.send(itemsToSend, method, url);
    } else {
      this.setMsgs(validatedItems);
    }
  }

  bindItemsRules(items, rules) {

    let itemsRules: {} = {};
    Object.keys(items).forEach((itemName) => {

      switch (itemName) {
        case "currentPassword":
          itemsRules[itemName] = rules['password'];
          break;
        case "newPassword":
          itemsRules[itemName] = rules['password'];
          break;
        case "passwordConf":
          itemsRules[itemName] = rules['passwordConf'];
          break;
        case "currentEmail":
          itemsRules[itemName] = rules['email'];
          break;
        case "newEmail":
          itemsRules[itemName] = rules['email'];
          break;
        case "passwordEmail":
          itemsRules[itemName] = rules['password'];
          break;

        case "delAccountEmail":
          itemsRules[itemName] = rules['email'];
          break;
        case "accountPassword":
          itemsRules[itemName] = rules['password'];
          break;
        case "feedback":
          itemsRules[itemName] = rules['feedback'];
          break;
        default:
          break;
      }
    });
    return itemsRules;
  }

  private strDateReverse(strDate: string) {
    let str: string;
    let strSlipt = strDate.split('-').reverse();

    (strSlipt.length) ? strSlipt.forEach(spStr => {
      str = str ? str += "-" + spStr : spStr;
    }) : str = strDate;
    return str;
  }

  getUpdateItemsRule(controls) {
    let itemsObj: {} = {
      items: {}
    }, msg;

    for (let ii in controls) {
      if (!this.itemsRule[ii]) {
        msg = "invalid attribute, you have beean blocked from our site";

        itemsObj['errors'] = { violation: [] };
        itemsObj['errors'].violation.push({ [ii]: msg, type: 'danger' });
        break;
      } else {//(controls[ii].valid && controls[ii].dirty) || 
        if (controls[ii].valid && controls[ii].dirty && controls[ii].value == this.currentEvt[ii]) {
          msg = "לא ביצעת שינויים כל שהם.";
          if (!itemsObj['warning']) itemsObj['warning'] = {};
          if (!itemsObj['warning'][ii]) itemsObj['warning'][ii] = [];
          itemsObj['warning'][ii].push({
            [ii]: msg,
            type: 'warning'
          });
        }
        if (controls[ii].value != this.currentEvt[ii]) itemsObj['items'][ii] = this.itemsRule[ii];//controls[ii].value != this.currentEvt[ii]
      }
    }
    return itemsObj;
  }

  send(body, method?: string | boolean, urlArg?: string) {
    let url = urlArg ? urlArg : "http://lara.test/api/events";
    let requestUrl = method ? (!urlArg) ? url + "/" + this.currentEvt["id"] + "?_method=" + method : urlArg + "?_method=" + method : url;
    console.log(requestUrl);

    this.http.postData(requestUrl, body)
      .subscribe(evt => {

        console.log(evt);
        let msgs = this.msgSrv.proccesMessages(evt);
        console.log(msgs);
        this.messages = msgs;
        //this.resetMessages();

      }, (err) => {

        console.log(err);
        if (err["status"] === 401) {
          // this.http.nextIslogged(false);
          window.localStorage.removeItem('user_key');
          window.location.reload();
        }
      });
  }
}
