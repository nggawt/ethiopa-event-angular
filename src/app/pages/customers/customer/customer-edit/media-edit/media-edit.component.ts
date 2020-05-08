
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CustomersDataService } from '../../../../../customers/customers-data-service'; 
import { find } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { CanDeactivateComponent } from '../../../../../services/can-deactivate-guard/can-deactivate-guard.service';
import { AuthService } from 'src/app/services/http-service/auth.service';

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

  constructor(private halls: CustomersDataService, private auth: AuthService) { }

  ngOnInit() {
    
    this.halls.customerObsever.pipe(
      find((val) => { return val['customer']['id'] })
    ).subscribe(cost => {
      let co = cost['customer'];
      
      let cId = (co && co["user_id"]) ? co["user_id"] : false,
          authUser = this.auth.authUser,
          uId = authUser["id"];

      if(cId === uId || authUser['authority'].name == "Admin"){

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
