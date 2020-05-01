
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomersDataService } from '../../../customers/customers-data-service';
import { Router, ActivatedRoute, NavigationStart, RouterStateSnapshot } from '@angular/router';
// import { HallType } from '../../../../customers/hall-type';
import { first, single, filter, tap, skipWhile, take } from 'rxjs/operators';
import { Observable, of, Observer, Subscriber, Subscribable, Subscription } from 'rxjs';
import { HttpService } from '../../../services/http-service/http.service';
import { ResourcesService } from 'src/app/services/resources/resources.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  providers: []
})

export class CustomerComponent implements OnInit, OnDestroy {

  customer: Observable<any>;
  canAccess: Observable<any> | boolean;
  pathUrl: string | boolean;
  accessPage: boolean = true;
  pageObs: Subscription;
  userSubs: Subscription;
  num: number = 0;

  constructor(private halls: CustomersDataService,
    private router: Router,
    private srv: ResourcesService,
    private route: ActivatedRoute,
    private http: HttpService) { }

  ngOnInit() {

    // let pathUrl = this.route.url["value"][0].path;this.route.snapshot.params['id']
    this.pathUrl = this.route.snapshot.params['id'];

    this.pageObs = this.router.events.pipe(filter((param) => (param instanceof NavigationStart && !!param.url))
    ).subscribe((uriParam) => {

      const currentUrl = decodeURIComponent(uriParam['url']);
      this.pathUrl = currentUrl.indexOf('customers') ? currentUrl.split("/")[3] : false;
      if (this.pathUrl) this.userSubs = this.http.userObs.subscribe((loggedUser) => { this.checkCustomer(this.pathUrl, loggedUser); });
    });
    this.userSubs = this.http.userObs.subscribe((loggedUser) => { this.checkCustomer(this.pathUrl, loggedUser); });
  }

  urlCompare(uriParam) {
    let url = decodeURIComponent(uriParam).split('/' + this.pathUrl)[1] + this.pathUrl;
    console.log("url param: ", url, " this.pathUrl: ", this.pathUrl, " this.router.url: ", this.router.url);
    
    return url;
  }

  checkCustomer(urlId, loggedUser) {
    urlId = urlId == 'ארמונות-לב' ? 'ארמונות לב' : urlId;
    let routeName = this.route.snapshot.paramMap.get('name');

    console.log("Route Name: ", routeName, " id: ", urlId);

    this.halls.getCustomers().then(customersData => {

      if ('customers' in customersData) customersData = customersData['customers'];

      let fields = this.halls.getFieldType(urlId),
          customers = customersData && customersData[routeName] ? customersData[routeName] : false;

      if (!customers) this.goTo(urlId);

      let customerWithGall = customers.find(cs => cs['customer'][fields[urlId]] == urlId);
      if (! customerWithGall){
        this.goTo(urlId);
        return;
      } 

      this.halls.customerOb = customerWithGall;
      this.halls.CustomerEmit(customerWithGall);

      let customer = customerWithGall['customer'];
      if (!customer) this.goTo(urlId);

      let urlCompare = this.urlCompare(this.router.url);
      this.accessPage = (urlCompare == this.pathUrl);
      
      // console.log(customer, " loggedUser: ", loggedUser, " <" + urlCompare, " <:::> ", this.pathUrl + "> ", (urlCompare == this.pathUrl), " fields: ", fields);
      if (customer && loggedUser && (customer["user_id"] == loggedUser['id'])) {
        this.canAccess = of(true);
        this.http.authUser = loggedUser;
        this.customer = of(customerWithGall);

      }else if(customer && this.http.authUser && this.http.authUser['authority']?.name == "Admin"){
        // alert("ffff");
        this.canAccess = of(true);
        this.customer = of(customerWithGall);
        // this.accessPage = true;
        
      } else if(customer && customer['email']){
        this.customer = of(customerWithGall);
        
      }else {
        if (!customer) this.goTo(urlId);
        this.canAccess = of(false);
        this.http.authUser = loggedUser;
      }
      console.log(customers, customerWithGall);
    });

    /* this.srv.getItemResource('customers', urlId, routeName, false).then(cust => {
      console.log(cust)
      let customer = (cust && cust['customer']) ? cust['customer'] : false;
      let urlCompare = this.urlCompare(this.router.url);

      this.accessPage = (urlCompare == this.pathUrl);
      if (customer && loggedUser && (customer["user_id"] == loggedUser['id'])) {
        this.canAccess = of(true);
        this.http.authUser = loggedUser;
      } else {
        this.canAccess = of(false);
        this.http.authUser = loggedUser;
      }
      if (customer && customer["email"]) {
        this.customer = of(cust);
      }
    }); */

    /* this.halls.getById(urlId).then(
      (cust)=> {

        let customer = (cust && cust['customer'])? cust['customer']: false;
          let urlCompare = this.urlCompare(this.router.url);
          
          this.accessPage = (urlCompare == this.pathUrl);
          if(customer && loggedUser && (customer["user_id"] == loggedUser['id'])){
            this.canAccess = of(true);
            this.http.authUser = loggedUser;
          }else{
            this.canAccess = of(false);
            this.http.authUser = loggedUser;
          }
          if(customer && customer["email"]){
            this.customer = of(cust);
          }else{
            let goTo = this.router.url.split(urlId)[0];
            this.goTo(goTo);
          }
    }); */
  }

  goTo(urlId) {
    let path = this.router.url.split(urlId)[0];
    this.router.navigate([path]);
  }

  ngOnDestroy() {
    this.pageObs.unsubscribe();
    this.userSubs.unsubscribe();
  }
}
