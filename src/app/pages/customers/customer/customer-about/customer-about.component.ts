import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CustomersDataService } from '../../../../customers/customers-data-service';
import { of, Observable, Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-customer-about',
  templateUrl: './customer-about.component.html',
  styleUrls: ['./customer-about.component.css']
})
export class CustomerAboutComponent implements OnInit, OnDestroy {
  customer$: Observable<{}>;
  constructor(private hall: CustomersDataService) { }
  customerDt:Subscription;
  
  ngOnInit() {
    
    this.customerDt = this.hall.customerObsever.subscribe(
      (dt) => {
        this.customer$ = of(dt['customer']);
        console.log(dt['customer']);
        
      });
  }

  ngOnDestroy(){
    this.customerDt.unsubscribe();
  }
}
