import { Component, OnInit, Input } from '@angular/core';
import { Observable, of, Subscription, pipe } from 'rxjs';

@Component({
  selector: 'app-customer-temp',
  templateUrl: './customer-temp.component.html',
  styleUrls: ['./customer-temp.component.css']
})
export class CustomerTempComponent implements OnInit {
  
  @Input()  costumerProps: Observable<any>;
  @Input()  ownerLogged: Observable<any> | boolean;

  constructor() { }

  ngOnInit() {
  //  console.log(this.costumerProps);
  }

}
