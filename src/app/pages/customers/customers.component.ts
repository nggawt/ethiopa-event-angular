import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { first } from 'rxjs/operators';
import { HallType } from '../../customers/hall-type';
import { Observable, of, Subscription } from 'rxjs';
import { HttpService } from 'src/app/services/http-service/http.service';
import { MessageModel } from 'src/app/types/message-model-type';
import { AuthService } from 'src/app/services/auth-service/auth.service';

import { Customer } from 'src/app/types/customers-type';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
  providers: []
})

export class CustomersComponent implements OnInit, OnDestroy {

  sendingMail: Observable<{ [key: string]: boolean } | boolean>;
  path: boolean = true;
  modelProps: Customer;

  showPath: boolean;
  urlUnsubscribe: Subscription;
  csubs: Subscription;

  hallsProps: Observable<HallType[]> | boolean;

  customerMessage: MessageModel;

  private address: string;
  private allawAddress = [
    'halls-events', 'salons', 'app/salons', 'app/halls-events', "hotels", "app/hotels", "photographers",
    "app/photographers", "djs", "app/djs", , "kyses", "app/kyses", , "car-rents", "app/car-rents",
    "transportation", "app/transportation", , "printing", "app/printing", , "fireworks", "app/fireworks"
  ];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private http: HttpService,
    private auth: AuthService) { }

  ngOnInit() {

    this.csubs = this.route.data.pipe().subscribe(data => { 
      console.log(":::data::: ", data);

      this.hallsProps = data && data['ctype'] ? of(data['ctype']) : false;//  && customerData[addr] ? of(customerData[addr]) : false;
      this.path = this.hallsProps ? true : this.timesNavigated();

    }); 
  }

  contactModel(evt, el: HTMLAnchorElement, customer: Customer) {
    this.modelProps = customer;
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

  msgModel(paramCustomer) {

    this.customerMessage = {
      id: 'contact_customer',
      url: decodeURIComponent(location.pathname),
      modalSize: "modal-lg",
      nameTo: paramCustomer.company,
      nameFrom: paramCustomer.name,
      emailFrom: (this.auth.authUser && this.auth.authUser['email']) ? this.auth.authUser['email'] : false,
      emailTo: paramCustomer.email,
      title: 'שלח הודעה',
      inputs: {
        email_from: true,
        email_to: true,
        name: true,
        area: true,
        phone: true,
        city: true,
        subject: true,
        message: true
      }
    };

    this.http.sendingMail.next({ ['contact_customer']: true });
    this.sendingMail = this.http.sendingMail;
  }

  ngOnDestroy() {
    if (this.urlUnsubscribe) this.urlUnsubscribe.unsubscribe();
    if (this.csubs) this.csubs.unsubscribe();
  }

}
