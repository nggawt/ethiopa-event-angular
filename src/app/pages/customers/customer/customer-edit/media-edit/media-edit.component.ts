
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HallType } from '../../../../../customers/hall-type';
import { CustomersDataService } from '../../../../../customers/customers-data-service';
import { HttpService } from '../../../../../services/http-service/http.service';
import { find } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { CanDeactivateComponent } from '../../../../../services/can-deactivate-guard/can-deactivate-guard.service';
declare var $: any;

@Component({
  selector: 'app-media-edit',
  templateUrl: './media-edit.component.html',
  // styleUrls: ['../../../../../styles/style.component.css']
  styleUrls: ['./media-edit.component.css']
})
export class MediaEditComponent implements OnInit, CanDeactivateComponent {

  /* *********** gallery ***************** */
  customer;

  addCostumerForm: FormGroup;
  isTrue: Observable<boolean>;
  childInstans:{} | any;

  constructor(private halls: CustomersDataService, private http: HttpService) { }

  ngOnInit() {

    this.halls.customerObsever.pipe(
      find((val) => { return val['customer']['id'] })
    ).subscribe(cost => {
      let co = cost['customer'];
      
      let cId = (co && co["user_id"]) ? co["user_id"] : false;
      let uId = this.http.authUser["id"];

      if (cId === uId) {

        this.customer = cost;
        this.isTrue = of(true);

        this.addCostumerForm = new FormGroup({});
      } else {
        this.isTrue = of(false);
      }

    });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

    return (this.childInstans.canLeaveThePage())? confirm("לא שמרתה את הפרטים. תרצה לעזוב דף זה בכל זאת?"): true;

  }

  childIns(evt){
    let key = Object.keys(evt);
    this.childInstans = evt[key[0]];
  }
}
