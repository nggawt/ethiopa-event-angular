import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RoutesRecognized, ActivatedRoute, Data, ParamMap } from '@angular/router';
import { map, filter, tap, first } from 'rxjs/operators';
import { HallType } from '../../customers/hall-type';
import { Observable, of, Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http-service/http.service';

declare var $: any;
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
  providers: []
})

export class CustomersComponent implements OnInit, OnDestroy {

  sendingMail: Observable<{[key: string]: boolean} | boolean>;
  path: boolean = true;

  showPath: boolean;
  urlUnsubscribe: Subscription;
  hallsProps: Observable<HallType[]> | boolean;
  
  customerMessage: {
    id:string | boolean, 
    url: string,
    modalSize: string, 
    nameTo: string | boolean, 
    emailTo: string | boolean, 
    title: string
  };

  private address: string;
  private allawAddress = [
    'halls-events', 'salons', 'app/salons', 'app/halls-events', "hotels", "app/hotels", "photographers",
    "app/photographers", "djs", "app/djs", , "kyses", "app/kyses", , "car-rents", "app/car-rents",
    "transportation", "app/transportation", , "printing", "app/printing", , "fireworks", "app/fireworks"
  ];

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpService) { }

  ngOnInit() {

    // let urSnapShut = this.route.snapshot.paramMap.get('name'), urlExist = this.allawAddress.indexOf(urSnapShut) >= 0;
    this.urlUnsubscribe = this.route.paramMap.subscribe((routeName: ParamMap) => {
      let urSnapShut = routeName.get('name'),
      urlExist = this.allawAddress.indexOf(urSnapShut) >= 0;
      (urlExist) ? this.getCustomerResources(urSnapShut) : this.timesNavigated();
    });

    // console.log(this.router.url, urlExist);
    // (urlExist) ? this.getCustomerResources(urSnapShut) : this.timesNavigated();
  }

  contactModel(paramCustomer) {
    console.log("customers called");

    this.customerMessage = {
      id:'contact_customer', 
      url: decodeURIComponent(location.pathname),
      modalSize: "modal-lg", 
      nameTo: paramCustomer.company, 
      emailTo: paramCustomer.email, 
      title: 'שלח הודעה'
    };

    this.http.sendingMail.next({['contact_customer']: true});
    this.sendingMail = this.http.sendingMail;

    // this.sendingMail.subscribe(item => console.log(item) )
  }

  private getCustomerResources(url) {
    
    if (this.allawAddress.indexOf(url) >= 0) {

      this.route.data.pipe(first()).subscribe(data => {
        let customerData = data['customers']? data['customers']: false;
        let addr = this.allawAddress.find(item => { return item == url; });
        this.address = addr;
        console.log(data);
        // console.log(addr);

        this.hallsProps = customerData && customerData[addr] ? of(customerData[addr]) : false;
        this.path = this.hallsProps ? true : this.timesNavigated();

      });
    } else {
      this.path = false;
      this.timesNavigated('errors-page');
    }
  }

  private timesNavigated(link?) {
    link = link ? link : '/';
    setTimeout(() => {
      this.router.navigate([link]);
    }, 100);
    return false;
  }

  onSelectedLink(customer: HallType) {
    //this.halls.costumerEmit(customer);
  }

  ngOnDestroy() {
    this.urlUnsubscribe ? this.urlUnsubscribe.unsubscribe() : "";
  }

}
