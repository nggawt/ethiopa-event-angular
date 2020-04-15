import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { CustomersDataService } from 'src/app/customers/customers-data-service';
import { HttpService } from 'src/app/services/http-service/http.service';
import { FormProccesorService } from 'src/app/customers/form-proccesor.service';
import { find } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'edit-basic-temp',
  templateUrl: './edit-basic-temp.component.html',
  styleUrls: ['../../../../../../styles/style.component.css']
})
export class EditBasicTempComponent implements OnInit {
  
  
  @Input() cus:any;
  @Input('formInstans') addCostumerForm:FormGroup;
  @Output() ins: EventEmitter<any> = new EventEmitter<any>();
  customer;

  /***************  ********************/
  
  /***************  ********************/

  /* **************************** */

  messages:any = [];

  private input: FormData = new FormData();

  constructor(private router: Router,
              private http: HttpService,
              private valForm: FormProccesorService) { }

  ngOnInit() {
    this.customer = this.cus['id']? this.cus: this.cus['customer']? this.cus['customer']:false;

    let customerId = this.customer['user_id'];
    let userId = this.http.authUser['id'];
    
    if(customerId == userId){
      this.ins.emit({basic: this});
    }
  }

  canLeaveThePage(): Observable<boolean> | Promise<boolean> | boolean {
    
    if((this.addCostumerForm.dirty || this.addCostumerForm.touched) && this.addCostumerForm.invalid){
      return true
    }else{
      return false;
    }
  }

 update(customer) {
  
  let input: FormData = new FormData();
  let comp = customer['id'];
  if (this.addCostumerForm.controls[comp].status) {
    let controls = this.addCostumerForm.controls[comp];
    let items = this.valForm.validate(controls, this.customer, comp);
    console.log(items);
    
    if (items['status']) {
      input.append('formInputs', JSON.stringify(items['success']));
      this.send(input, 'PATCH');
    } else {
      this.messages = items['errors'];
      this.valForm.resetMessages().then(res => {

        this.messages = res;
      });

    }
  }
}

inputReset(customer) {
  let comp = customer['id'];
  this.addCostumerForm.controls[comp].reset();
}

default(customer) {
  let comp = customer.id;
  this.addCostumerForm.controls[comp].setValue(this.customer[comp])
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

  get f() { return this.addCostumerForm.controls; }

  allTodefault(){

    let controls = this.addCostumerForm.controls;
    
    for(let ii in controls){
      if(controls.hasOwnProperty(ii)){
        if(controls[ii].value !== this.customer[ii]){
          if(this.customer[ii]) controls[ii].setValue(this.customer[ii]);
        }
      }
    }
  }

  async resetMessages(){
    let response = await this.valForm.resetMessages();
    this.messages = await response;
    
    /* await this.valForm.resetMessages().then(res => {
      this.messages = res;
    }); */
  }

  reset() {
    this.addCostumerForm.reset();
  }

  
  close() {
    this.router.navigate(['../']);
  }

  onSubmit(clllback) {

    // this.messages = [];
    let controls = this.addCostumerForm.controls;
    
    let items = this.valForm.validate(controls,this.customer);
    //if(items['status'] === false) this.messages.push(items['errors']);
    console.log(items);
    let success = items['success'];

    if(clllback) return clllback(items);
    
    if(success){
      console.log("sending to server basic media comp");
      
      this.send(success, "PUT");
    }else if(! items['status'] && ! success){
      this.messages = items['errors'];

      this.valForm.resetMessages().then(res => {
        this.messages = res;
      });
    } 
  }



  send(body, method) {

    let updaterUrl = "http://lara.test/api/customers/" + this.customer["id"] + "? _method=" + method;

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
}
