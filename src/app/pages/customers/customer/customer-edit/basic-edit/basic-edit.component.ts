import { Component, OnInit, ViewChild } from '@angular/core';
import {  Router, ActivatedRoute, CanDeactivate } from '@angular/router';
import { CustomersDataService } from '../../../../../customers/customers-data-service';
import { Observable, of } from 'rxjs';
import { HallType } from '../../../../../customers/hall-type';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { HttpService } from '../../../../../services/http-service/http.service';
import { find, tap } from 'rxjs/operators';
import { CanDeactivateComponent } from '../../../../../services/can-deactivate-guard/can-deactivate-guard.service';
import { AuthService } from 'src/app/services/http-service/auth.service';

@Component({
  selector: 'app-basic-edit',
  templateUrl: './basic-edit.component.html',
  styleUrls: ['./basic-edit.component.css']
})
export class BasicEditComponent implements OnInit,  CanDeactivateComponent{

  phoneNum: any = '^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})';
  emailPatteren: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  /***************  ********************/
  customer;
  cust;

  /* **************************** */
  addCostumerForm: FormGroup;

  isTrue: Observable<boolean>;
  childInstans:{} | any;
  constructor(private halls: CustomersDataService, 
    private auth: AuthService) { }

  ngOnInit() {
    console.log("basic edit");
    
    this.halls.customerObsever.pipe(
      find((val) => val && val['customer'] && val['customer']['id']))
      .subscribe(cost => {
        let co = cost['customer'];
    
        let cId = (co && co["user_id"]) ? co["user_id"] : false;
        let authUser:any = this.auth.authUser;
        let uId = authUser? authUser["id"] : false;

      console.log('costumerId: '+ cId + " userId "+ uId);
      if(cId === uId || (authUser && authUser['authority']?.name == "Admin")){
        this.customer = co;
        this.formInt();
        this.isTrue = of(true);
        // this.childInstans({basic: this});
      }else{
        // let state = decodeURIComponent(this.router.url).split("/");
        // let media = "/"+state[1]+"/"+cost["company"]+"/media";
        this.isTrue = of(false);
      }

    });
  }
  
  childIns(evt){
    let key = Object.keys(evt);
    this.childInstans = evt[key[0]];
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

    return (this.childInstans.canLeaveThePage())? confirm("לא שמרתה את הפרטים. תרצה לעזוב דף זה בכל זאת?"):  true;

  }

  private formInt() {

    this.addCostumerForm = new FormGroup({
      'company': new FormControl(this.customer.company, [Validators.required]),
      // 'businessType': new FormControl(this.customer.businessType, [Validators.required]),
      'title': new FormControl(this.customer.title, [Validators.required]),
      'contact': new FormControl(this.customer.contact, [Validators.required]),
      'tel': new FormControl(this.customer.tel, [Validators.required, Validators.pattern(this.phoneNum)]),
      'email': new FormControl(this.customer.email, [Validators.required, Validators.pattern(this.emailPatteren)]),
      'address': new FormControl(this.customer.address, [Validators.required]),
      'descriptions': new FormControl(this.customer.descriptions, [Validators.required]),
      'deals': new FormControl(this.customer.deals, [Validators.required])
    });
  }
}
