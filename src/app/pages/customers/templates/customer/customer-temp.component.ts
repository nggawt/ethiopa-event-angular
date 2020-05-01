import { Component, OnInit, Input } from '@angular/core';
import { Observable, of, Subscription, pipe } from 'rxjs';

@Component({
  selector: 'app-customer-temp',
  templateUrl: './customer-temp.component.html',
  styleUrls: ['./customer-temp.component.css']
})
export class CustomerTempComponent implements OnInit {
  
  @Input()  costumerProps: Observable<any>;
  @Input()  ownerLogged: Observable<any>;

  constructor() { }

  ngOnInit() {
    console.log("customer temp");
    
    if(this.ownerLogged) this.ownerLogged.subscribe(boll => console.log(boll))
  }

}
