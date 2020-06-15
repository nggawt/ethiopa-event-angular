import { HelpersService } from 'src/app/services/helpers/helpers.service';
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
  accessPage: boolean = true;

  uriId: string;
  snapShot: { name: string, id: number };

  pageObs: Subscription;
  userSubs$: Subscription;

  sendingMail: Observable<{ [key: string]: boolean } | boolean>;
  customerMessage: MessageModel;


  constructor(private halls: CustomersDataService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpService,
    private auth: AuthService,
    private helper: HelpersService) { }

  ngOnInit() {

    this.uriId = decodeURIComponent(this.route.snapshot.params['id']);
    this.route.paramMap.subscribe(urlParam => {
      this.snapShot = <{ name: string, id: number }>this.route.snapshot.params;
      this.handel();
    });

    this.UrlState();
  }

  async handel() {

    let customers = await this.halls.getCustomers(),
      customerWithGall = await this.getCustomer(customers);

    if (customerWithGall) {

      this.userSubs$ = await this.auth.userObs.pipe(
        // find(user => typeof user == "object"),
        map((users: Users) => (<UserFields | AdminUser>this.auth.getActiveUser(users))),
        tap(user => console.log("tap: ", user)))
        .subscribe((loggedUser) => {

          console.log(customers, " ::this.uriId ", this.uriId, " :::await::: ", customerWithGall, " :::loggedUser::: ", loggedUser);
          let customer = customerWithGall['customer'];
          this.customer = of(customerWithGall);
          this.halls.CustomerEmit(customerWithGall);

          this.accessPage = this.urlCompare(this.uriId);
          if (loggedUser && (customer["user_id"] == loggedUser['id'])) {

            this.canAccess = of(true);
          } else if (loggedUser && loggedUser['authority']) {

            this.canAccess = of(true);
          } else { 
            console.warn("called");
            (! this.accessPage) ? this.goTo(true, this.uriId): '';
          }
        });

    } else {
      this.goTo(false, this.uriId); 
    }
  }

  getCustomer(customers) {
    customers = customers['customers'] ? customers['customers'] : customers;
    let param = this.helper.isNumber(this.uriId) ? "id" : "company",
        paramId = this.helper.slugToWithSpace(this.uriId);

    return customers ? customers[this.snapShot['name']].find(customer => customer['customer'][param] == paramId) : false;
  }

  UrlState() {

    this.pageObs = this.router.events
      .pipe(filter((param) => (param instanceof NavigationStart && !!param.url)))
      .subscribe((uriParam) => {

        const currentUrl = decodeURIComponent(uriParam['url']),
          changedpathId = currentUrl.indexOf('customers') ? currentUrl.split("/")[3] : false;

        this.uriId = changedpathId && changedpathId.length ? 
                      decodeURIComponent(changedpathId) : 
                      decodeURIComponent(this.route.snapshot.params['id']);

        this.accessPage = this.urlCompare(currentUrl);
      });
  }

  urlCompare(uriParam): boolean {
    let decodedUrl = decodeURIComponent(this.router.url),
      pageurlMatch = decodedUrl.indexOf(uriParam) > -1 ? decodedUrl.split('/' + uriParam) : decodedUrl,

      // let isMatch = pageurlMatch[]
      compare = pageurlMatch && pageurlMatch.length >= 1 && (!pageurlMatch[1] || pageurlMatch[1].length === 0) ? true : false;

    console.log(":::::::::uriParam:::: ", uriParam, " ::::pageurlMatch:::: ", pageurlMatch, " ::::::compare::::, ", compare, " ::decodedUrl:: ", decodedUrl);
    return compare;
  }

  goTo(hasCustomer: boolean, urlId: string) {

    let  expPath = decodeURIComponent(this.router.url).split("/" + urlId),
      url = hasCustomer? expPath[0] + "/" + this.uriId : expPath[0];

    this.router.navigate([url]);
    console.log("urlId: ", urlId, " path: ", url, " this.router.url: ", decodeURIComponent(this.router.url), " ::expPath:: ", expPath);
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