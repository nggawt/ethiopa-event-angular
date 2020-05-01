import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersDataService } from '../../../../../customers/customers-data-service';
import { Observable, of } from 'rxjs';
import { HallType } from '../../../../../customers/hall-type';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service/http.service';
import { first, find, tap } from 'rxjs/operators';
import { CanDeactivateComponent } from '../../../../../services/can-deactivate-guard/can-deactivate-guard.service';
/* import { CanDeactivateComponent } from '../../../../../can-deactivate-guard.service';
import { FormProccesorService } from 'src/app/customers/form-proccesor.service';
import { FormFilesProccesorService } from 'src/app/customers/form-files-proccesor.service'; */

declare var $: any;


@Component({
  selector: 'app-all-edit',
  templateUrl: './all-edit.component.html',
  styleUrls: ['../../../../../styles/style.component.css']

})
export class AllEditComponent implements OnInit, CanDeactivateComponent {

  /*************** customer and form group ********************/
  customer: HallType;
  addCostumerForm: FormGroup;
  cus;

  /* ************ valadition **************** */
  phoneNum: any = '^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})';
  emailPatteren: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';

  /* **************************** */
  isTrue: Observable<boolean>;
  childInstans:{} | any = {};


  constructor(private router: Router,
    private halls: CustomersDataService,
    private http: HttpService) { }

  ngOnInit() {
    console.log("all edit");
    
    this.halls.customerObsever.pipe(
      find((val) => { return val['customer']['id'] })
    ).subscribe(cost => {
      let co = cost['customer'];

      let cId = (co && co["user_id"]) ? co["user_id"] : false;
      let authUser: any = this.http.authUser;
      let uId = authUser ? authUser["id"] : false;

      if(cId === uId || authUser['authority'].name == "Admin"){

        this.customer = cost;
        this.cus = co;
        this.isTrue = of(true);
        this.formInt();
      } else {
        this.isTrue = of(false);
      }
    });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    let basicConfirm = this.childInstans['basic'].canLeaveThePage();
    let mediaConfirm = this.childInstans['media'].canLeaveThePage();

    return (basicConfirm || mediaConfirm)? confirm("לא שמרתה את הפרטים. תרצה לעזוב דף זה בכל זאת?"): true;
  }

  childIns(evt){

    let key = Object.keys(evt);
    if(key[0]) this.childInstans[key[0]] = evt[key[0]];
    
  }
  
  private formInt() {

    this.addCostumerForm = new FormGroup({
      'company': new FormControl(this.cus.company, [Validators.required]),
      // 'businessType': new FormControl(this.cus.businessType, [Validators.required]),
      'title': new FormControl(this.cus.title, [Validators.required]),
      'contact': new FormControl(this.cus.contact, [Validators.required]),
      'tel': new FormControl(this.cus.tel, [Validators.required, Validators.pattern(this.phoneNum)]),
      'email': new FormControl(this.cus.email, [Validators.required, Validators.pattern(this.emailPatteren)]),
      'address': new FormControl(this.cus.address, [Validators.required]),
      'descriptions': new FormControl(this.cus.descriptions, [Validators.required]),
      'deals': new FormControl(this.customer.deals, [Validators.required])
    });
  }

  onSubmit(){
    
    for(let ii in this.childInstans){
      this.childInstans[ii].onSubmit(function(backOb){
        console.log(backOb);
        
        console.log("hiii ther im callbnack function from all edit component");
      });
    }
  }

  reset(){
    for(let ii in this.childInstans){
      this.childInstans[ii].reset();
    }
  }
  close(){
    for(let ii in this.childInstans){
      this.childInstans[ii].close();
    }
  }
  allTodefault(){
    for(let ii in this.childInstans){
      this.childInstans[ii].allTodefault();
    }
  }

  /* get childIns(){
    
    for(let ii in this.childInstans){
      this.childInstans[ii].allTodefault();
    }
  } */

}
