import { Users, UserFields } from 'src/app/types/user-type';
import { AdminUser } from 'src/app/types/admin-type';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomersDataService } from '../../../customers/customers-data-service';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { filter, map, tap, find } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { HttpService } from '../../../services/http-service/http.service';
import { MessageModel } from 'src/app/types/message-model-type';
import { AuthService } from 'src/app/services/auth-service/auth.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  providers: []
})

export class CustomerComponent implements OnInit, OnDestroy {

  customer: Observable<any>;
  canAccess: Observable<any> | boolean;
  uriId: string;
  accessPage: boolean = true;
  pageObs: Subscription;
  userSubs$: Subscription;
  num: number = 0;
  loggedUser: UserFields | AdminUser | {};
  sendingMail: Observable<{ [key: string]: boolean } | boolean>;

  customerMessage: MessageModel;


  constructor(private halls: CustomersDataService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpService,
    private auth: AuthService) { }

  ngOnInit() {

    this.uriId = this.route.snapshot.params['id'];

    this.route.paramMap.subscribe(urlParam => {
      console.log(urlParam);
      this.checkCustomer();
    });

    this.customerActiveState();

    this.userSubs$ = this.auth.userObs.pipe(
      find(user => typeof user == "object"),
      map((users: Users) => (<UserFields | AdminUser>this.auth.getActiveUser(users))),
      tap(user => console.log("tap: ", user)))
      .subscribe((loggedUser) => { this.checkCustomer(loggedUser); });
  }

  customerActiveState() {

    this.pageObs = this.router.events
      .pipe(filter((param) => (param instanceof NavigationStart && !!param.url)))
      .subscribe((uriParam) => {

        const currentUrl = decodeURIComponent(uriParam['url']),
          changedpathId = currentUrl.indexOf('customers') ? currentUrl.split("/")[3] : false;

        this.uriId = changedpathId && changedpathId.length ? changedpathId : this.route.snapshot.params['id'];
        //if (this.halls.customerOb && this.auth.authCheck()) 
        this.accessPage = this.urlCompare(uriParam['url']);
    });
  }


  urlCompare(uriParam): boolean {
    let decodedUrl = decodeURIComponent(uriParam),
      pgIdExisst = decodedUrl.indexOf(this.uriId) ? decodedUrl.split('/' + this.uriId) : false,
      compare = pgIdExisst && pgIdExisst.length >= 1 && (!pgIdExisst[1] || pgIdExisst[1].length === 0) ? true : false;
    return compare;
  }

  async checkCustomer(loggedUser?: UserFields | AdminUser) { 

    let co = await this.halls.getById(this.uriId),
    customer = co['customer'];
    this.accessPage = this.urlCompare(this.uriId);
    console.log("ppppppppp ", co);
    
    this.customer = of(customer);
    this.allowAccess(loggedUser);
    this.halls.customerOb = customer;
    this.halls.CustomerEmit(customer);
    this.accessPage = this.urlCompare(this.router.url);
    console.log(co);
  }

  allowAccess(user){

    console.log(this.customer['email']);
    if (user && (this.customer["user_id"] == user['id'])) {
      this.canAccess = of(true);
    } else if (this.auth.authUser && this.auth.authUser['authority']?.name == "Admin") {
      this.canAccess = of(true);
    } else if (this.customer['email']) {
      this.canAccess = of(false);
      // this.goTo(this.uriId);
    }else{
      this.canAccess = of(false);
      // this.goTo(this.uriId);
    }
  }

  getCustomer(customers) {
    let fieldForSearch = (this.uriId.indexOf('-') > -1) ? this.uriId.replace('-', ' ') : this.uriId,
        routeName = this.route.snapshot.paramMap.get('name'),
        fields = this.halls.getFieldType(fieldForSearch);

    customers = customers && customers[routeName] ? customers[routeName] : false;

    if (!customers) return this.goTo(this.uriId);
    let customerWithGall = customers.find(cs => cs['customer'][fields[fieldForSearch]] == fieldForSearch);

    this.customer = of(customerWithGall);
    this.halls.customerOb = customerWithGall;
    this.halls.CustomerEmit(customerWithGall);
    return customerWithGall;
  }

  goTo(urlId) {

    let path = decodeURIComponent(this.router.url).split("/" + decodeURIComponent(urlId))[0] + "/" + urlId;

    this.router.navigate([path]);
    console.log("urlId: ", urlId, " path: ", path, " this.router.url: ", this.router.url);
    this.canAccess = of(false);
    return false;
  }

  contactModel(paramCustomer) {

    this.customerMessage = {
      id: 'contact_customer',
      url: decodeURIComponent(location.pathname),
      modalSize: "modal-lg",
      nameTo: paramCustomer.company,
      nameFrom: paramCustomer.name,
      emailTo: paramCustomer.email,
      emailFrom: false,
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
    if (this.pageObs) this.pageObs.unsubscribe();
    if (this.userSubs$) this.userSubs$.unsubscribe();
  }
}