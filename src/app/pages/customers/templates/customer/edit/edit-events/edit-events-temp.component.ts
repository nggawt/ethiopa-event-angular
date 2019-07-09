import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { CustomersDataService } from 'src/app/customers/customers-data-service';
import { HttpService } from 'src/app/services/http-service/http.service';
import { FormProccesorService } from 'src/app/customers/form-proccesor.service';
import { find } from 'rxjs/operators';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { CalendarDatePickerService } from 'src/app/calendar/calendar-date-picker.service';
import { ValidationService } from 'src/app/services/validation/validation.service';
import { MessagesService } from 'src/app/services/messages/messages.service';
declare var $: any;

@Component({
  selector: 'edit-events-temp',
  templateUrl: './edit-events-temp.component.html',
  styleUrls: ['../../../../../../styles/style.component.css'],
})
export class EditEventsTempComponent implements OnInit {
  
  
  @Input() cus:any;
  @Input('formInstans') formEvents:FormGroup;
  @Output() ins: EventEmitter<any> = new EventEmitter<any>();
  customer;
  formMethod: string;
  messages:{} = {};
  eventObj;

  private itemsRule: object = {
    name: "required|string|min:3|max:30",
    eventType: "required|string|min:3",
    date: "required",
    email: "required",
    phone: "required",
    location: "required|string|min:3",
    address: "required|string|min:6",
    description: "required|string|min:12",
    other: "required|string|min:3",
  };

  private input: FormData = new FormData();
  constructor(private router: Router,
              private http: HttpService,
              private route: ActivatedRoute,
              private msgSrv: MessagesService,
              private valForm: ValidationService) { }

  ngOnInit() {

    this.customer = this.cus['id']? this.cus: this.cus['customer']? this.cus['customer']:false;

    let customerId = this.customer['user_id'];
    let userId = this.http.authUser['id'];
    
    if(customerId == userId){
      this.ins.emit({events: this});
    }
  }
 
  canLeaveThePage(): Observable<boolean> | Promise<boolean> | boolean {
    
    if((this.formEvents.dirty || this.formEvents.touched) && this.formEvents.invalid){
      return true
    }else{
      return false;
    }
  }

 update(input) {
  console.log(this.formMethod);
  let ctl = {[input.id]:this.formEvents.controls[input.id]},
      rulse: object = this.getUpdateItemsRule(ctl),
      items = this.valForm.validate(ctl, rulse);

  console.log(ctl);
  console.log(rulse);
  console.log(items);
  if(rulse['errors']){
    this.messages = rulse['errors'];
    return false;
  }
let success = items['success'];
if(success){
  console.log("sending params to server!");
  Object.keys(this.messages).length? this.messages = {}:'';
  //input.append('formInputs', JSON.stringify(items['success']));
  //this.send(input, 'PATCH');
}else{
  this.messages = items['errors'];
  /* 
  this.valForm.resetMessages().then(res => {

        this.messages = res;
  });
  */
}
  return false;
  // let input: FormData = new FormData();
 
}

inputReset(event) {
  console.log(event);
  (event['id'] && this.formEvents.controls[event['id']]) ?this.formEvents.controls[event['id']].reset():'';
}

default(event) {
  let comp = event.id;
  this.formEvents.controls[comp].setValue(this.eventObj[comp])
}

  textAreaAdjust(o) {
    let target = o.target;
    target.style.height = "1px";
    target.style.height = (25 + target.scrollHeight) + "px";
  }

  textAreamouseleave(o) {
    let target = o.target;
    target.style.height = "1px";
    target.style.height = ((target.scrollHeight) - 50 + '%') + "px";
  }

  get f() { return this.formEvents.controls; }

  allTodefault(){

    let controls = this.formEvents.controls;
    
    for(let ii in controls){
      if(controls.hasOwnProperty(ii)){
        if(controls[ii].value !== this.eventObj[ii]){
          if(this.eventObj[ii]) controls[ii].setValue(this.eventObj[ii]);
        }
      }
    }
  }

  async resetMessages(){
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
    this.router.navigate(['../../'], {relativeTo: this.route});
  }

  selectedText(item){
    this.formEvents.controls.eventType.setValue(item.options[item.selectedIndex].text);
  }

  toggleHidden(itemCller, targetInput){

    if(itemCller.tagName == "SELECT" && itemCller.value == "other"){
      console.log("called");
      
      itemCller.parentElement.classList.remove('d-block');
      itemCller.parentElement.classList.add('d-none');
      targetInput.hidden = !targetInput.hidden;
      // this.formEvents.controls['eventType'].setValue('');
      this.formEvents.controls['other'].setValue('');
    }else if(itemCller.tagName == "INPUT"){
      
      targetInput.parentElement.classList.remove('d-none');
      targetInput.parentElement.classList.add('d-block');
      itemCller.hidden = ! itemCller.hidden;
      this.formEvents.controls['eventType'].setValue('');
      this.formEvents.controls['other'].setValue(null);
    }
  }

  onSubmit(clllback) {

    let controls = this.formEvents.controls;
    (this.formEvents.controls['eventType'].value != "other")? this.formEvents.controls['other'].setValue(this.formEvents.controls['eventType'].value):'';

    console.log(controls);
    /* form method is equal create */
    // all fields require
    // all fields must pass vlidation

    // let controlCopy = Object.assign(controls, {name:["buzz"]});
    let rulse: object = (this.formMethod == "update")? this.getUpdateItemsRule(controls): this.itemsRule;
    /* form method is equal update */
    // only current fields must pass vlidation

    // validation: type, event-exist, min-max min-max-len-char, same

    if(rulse['errors']){
      this.messages = rulse['errors'];
      return false;
    }
    
    let items = this.valForm.validate(controls, rulse);
    //if(items['status'] === false) this.messages.push(items['errors']);
    let success = items['success'];

    if(clllback && typeof clllback == 'object') return clllback(items);
    
    if(success){
      console.log("sending to server basic media comp");
      
      Object.keys(this.messages).length? this.messages = {}:'';
      //this.send(success, "PUT");
    }else if(/* ! items['status'] &&  */! success){
      this.messages = items['errors'];
      console.log("im not validated");
      console.log(items);
      
      this.msgSrv.resetMessages(9000).then(res => {
        // this.messages = res;
      });
    } 
  }

  getUpdateItemsRule(controls){
    let itemsObj: {} = {}, message: {} = {};

      for(let ii in controls){
        if(! this.itemsRule[ii]){
          let msg = "invalid attribute, you have beean blocked from our site";
          
          message['errors'] = {violation:[]};
          message['errors'].violation.push({[ii]: msg});
          break;
        }else{
          if((controls[ii].touched && controls[ii].dirty) || controls[ii].value != this.eventObj[ii]) itemsObj[ii] = this.itemsRule[ii];
        }
      }
      return message['errors']? message:itemsObj;
  }

  send(body, method) {

    let updaterUrl = "http://ethio:8080/api/customers/" + this.customer["id"] + "? _method=" + method;

    this.http.postData(updaterUrl, body)
      .subscribe(evt => {

        console.log(evt);
        let msgs = this.msgSrv.getMassages(evt);
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
}
