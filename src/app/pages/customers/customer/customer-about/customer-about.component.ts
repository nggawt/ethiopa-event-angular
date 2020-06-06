import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CustomersDataService } from '../../../../customers/customers-data-service';
import { of, Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { ResourcesService } from 'src/app/services/resources/resources.service';

@Component({
  selector: 'app-customer-about',
  templateUrl: './customer-about.component.html',
  styleUrls: ['./customer-about.component.css']
})
export class CustomerAboutComponent implements OnInit, OnDestroy {
  customer$: Observable<{}>;
  constructor(private hall: CustomersDataService, private srv: ResourcesService) { }
  customerDt:Subscription;
  
  ngOnInit() {

    /* this.srv.getItemResource('customers', uri, routeName, false).then(cust => {
      console.log(cust)
      let customer = (cust && cust['customer']) ? cust['customer'] : false;
      let urlCompare = this.urlCompare(this.router.url);

      this.accessPage = (urlCompare == this.pathUrl);
      if (customer && loggedUser && (customer["user_id"] == loggedUser['id'])) {
        this.canAccess = of(true);
        this.auth.authUser = loggedUser;
      } else {
        this.canAccess = of(false);
        this.auth.authUser = loggedUser;
      }
      if (customer && customer["email"]) {
        this.customer = of(cust);
      }
    }); */
    
    this.customerDt = this.hall.customerObsever.subscribe(
      (dt) => {
        this.customer$ = of(dt['customer']);
        // console.log(dt['customer']);
      });
  }

  ngOnDestroy(){
    if(this.customerDt) this.customerDt.unsubscribe();
  }
}
