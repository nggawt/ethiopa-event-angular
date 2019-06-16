import { Component, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
import { CalendarDatePickerService } from 'src/app/calendar/calendar-date-picker.service';
import { CreateDateTableService } from 'src/app/services/create-date-table/create-date-table.service';
import { ValidationService } from 'src/app/services/validation/validation.service';
import { tap, map, filter } from 'rxjs/operators';
declare var $: any;

@Component({
    selector: 'app-events-schedul',
    templateUrl: './events-schedul.component.html',
    styleUrls: ['./events-schedul.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class EventsSchedulComponent implements OnInit {
    phoneNum: RegExp = /^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})/;
    emailPatteren: RegExp = /^[a-z]+[a-zA-Z_\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$/;
    datePattern: RegExp = /^\b((?=0)0[1-9]|(?=[1-9])[1-9]|(?=[1-2])[1-2][0-9]|(?=3)3[0-1])\-((?=0)0[1-9]|(?=[1-9])[1-9]|(?=1)1[0-2]?)\-20((?=1)19|(?=2)2[0-5])$/;//\d{2}\-\d{2}\-\d{4}
    /***************  ********************///((?=0)0[1-9]|(?=[1-9])[1-9]|(?=[1-2])[1-2][1-9]|(?=3)3[0-1])   |(?=[1-2])[1-2][1-9]?|(?=3)3[0-1])
    /* **************************** *///((?=0)0[1-9]|(?=1)1[0-2])

    private itemsRule: object = {
        name: "required|string|min:3|max:7",
        eventType: "required|string|min:3",
        date: "required|numric|exact:10",
        email: "required",
        phone: "required",
        location: "required|string|min:3",
        address: "required|string|min:6",
        description: "required|string|min:12",
        other: "required|string|min:3",
    };
    formEvents: FormGroup;

    messages: object | boolean = {};
    private date: Date = new Date();

    fired: boolean = false;
    dayOfYear: number = 0;

    eventsOb: Object = {
        events: [
            //object with all details events go here
        ],
        hasEvents: () => {
            return this.eventsOb['events'].length;
        }
    };

    run: boolean = false;
    constructor(private http: HttpService,
        private calendar: CalendarDatePickerService,
        private tableEvents: CreateDateTableService,
        private valForm: ValidationService,
        private router: Router) { }

    ngOnInit() {
        this.formInt();
        this.initEvents();

    }

    get f() { return this.formEvents.controls; }

    fire(input) {

        input = input ? input : document.getElementById("date");

        if (!this.fired && input) {
            this.calendar.createHtms(input);
            this.calendar.fire(this, this.formEvents);
            this.fired = true;
        }
    }

    itemsMaper(item){
        item['date'] = new Date(item['date']);
        return item;
    }

    initEvents() {

        this.http.getData("events").pipe(
            map(items => Array.prototype.map.call(items, this.itemsMaper).filter(item => item['date'] >= this.date).sort((itemA, itemB) => itemA['date'] - itemB['date'])),
            // sort(items => items['date'] > this.date),.some(item => item['date'] >= this.date)
            tap(items => console.log(items))
            ).subscribe((eventsList: Array<{}>) => {
            if (eventsList) {
                let tablesEvents = this.tableEvents.initEvents(eventsList, this, "default");
                
                this.eventsOb['events'] = tablesEvents;

                setTimeout(() => {
                    // this.showEvents();
                    this.fire(document.getElementById('date'));
                    this.showEvents();
                }, 500);
            }
        });// END SUBSCRIBEr FN
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
            console.log("called");

            targetInput.parentElement.classList.remove('d-none');
            targetInput.parentElement.classList.add('d-block');
            itemCller.hidden = !itemCller.hidden;
            this.formEvents.controls['eventType'].setValue('');
            this.formEvents.controls['other'].setValue(null);
        }
    }

    onSubmit(clllback) {

        let controls = this.formEvents.controls;
        (this.formEvents.controls['eventType'].value == "other") ? this.formEvents.controls['eventType'].setValue(this.formEvents.controls['other'].value) : '';

        console.log(controls);
        /* form method is equal create */
        // all fields require
        // all fields must pass vlidation

        // let controlCopy = Object.assign(controls, {name:["buzz"]});
        let rulse: object = this.itemsRule;
        /* form method is equal update */
        // only current fields must pass vlidation

        // validation: type, event-exist, min-max min-max-len-char, same

        if (rulse['errors']) {
            this.messages = rulse['errors'];
            return false;
        }

        let items = this.valForm.validate(controls, rulse);
        //if(items['status'] === false) this.messages.push(items['errors']);
        let status = items['status'];

        if (clllback && typeof clllback == 'object') return clllback(items);

        if (status) {
            console.log("sending to server basic media comp");

            Object.keys(this.messages).length ? this.messages = {} : '';
            //this.send(success, "PUT");
        } else if (/* ! items['status'] &&  */!status) {
            this.messages = items['errors'];
            console.log("im not validated");
            console.log(items);

            this.valForm.resetMessages(9000).then(res => {
                // this.messages = res;
            });
        }
    }
    send(body) {

        let updaterUrl = "http://ethio:8080/api/customers";

        this.http.postData(updaterUrl, body)
            .subscribe(evt => {

                console.log(evt);
                let msgs = this.valForm.getMassages(evt);
                console.log(msgs);
                this.messages = msgs;
                this.resetMessages();

            }, (err) => {

                console.log(err);
                if (err["status"] === 401) {
                    this.http.nextIslogged(false);
                    window.localStorage.removeItem('user_key');
                    window.location.reload();
                }
            });
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
    }

    addEvents(event) {

        this.calendar.calendarDisplay(false, "open", (el, hasClass) => {
            hasClass ? this.calendar.toggleDisplay() : '';

        });
        // console.log(event['date']);
        // let eventCopy = Object.assign(event, {date: this.tableEvents.dateToStr(event['date'])});
        let eventCopy = Object.assign({}, event);
        let eventAdded = Object.assign(eventCopy, { date: this.tableEvents.dateToStr(event['date']) });
        // let dt = this.tableEvents.dateToStr(event['date']);

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

    inputReset(event) {
        console.log(event);
        (event['id'] && this.formEvents.controls[event['id']]) ? this.formEvents.controls[event['id']].reset() : '';
    }

    async resetMessages() {
        let response = await this.valForm.resetMessages();
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

}
