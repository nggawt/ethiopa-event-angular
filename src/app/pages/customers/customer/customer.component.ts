
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomersDataService } from '../../../customers/customers-data-service';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Observable, of, Subscription } from 'rxjs';
import { HttpService } from '../../../services/http-service/http.service';
import { MessageModel } from 'src/app/types/message-model-type';
import { AuthService } from 'src/app/services/http-service/auth.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  providers: []
})

export class CustomerComponent implements OnInit, OnDestroy {

  customer: Observable<any>;
  canAccess: Observable<any> | boolean;
  pathId: string;
  accessPage: boolean = true;
  pageObs: Subscription;
  userSubs: Subscription;
  num: number = 0;

  sendingMail: Observable<{[key: string]: boolean} | boolean>;

  customerMessage: MessageModel;


  constructor(private halls: CustomersDataService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpService,
    private auth: AuthService) { }

  ngOnInit() {

    this.pathId = this.route.snapshot.params['id'];
    this.cusromerActiveState();

    this.userSubs = this.auth.userObs.subscribe((loggedUser) => { this.checkCustomer(this.pathId, loggedUser); });
  }

  cusromerActiveState(){
    this.pageObs = this.router.events
    .pipe(filter((param) => (param instanceof NavigationStart && !!param.url)))
    .subscribe((uriParam) => {
      const currentUrl = decodeURIComponent(uriParam['url']),
            changedpathId = currentUrl.indexOf('customers') ? currentUrl.split("/")[3] : false;
            
      this.pathId = changedpathId && changedpathId.length? changedpathId: this.route.snapshot.params['id'];
      if(this.halls.customerOb && this.http.isAuth()) this.accessPage = this.urlCompare(uriParam['url']); 
    });
  }

  urlCompare(uriParam): boolean {
    let decodedUrl = decodeURIComponent(uriParam),
        pgIdExisst = decodedUrl.indexOf(this.pathId)? decodedUrl.split('/' + this.pathId): false,
        compare = pgIdExisst && pgIdExisst.length >= 1 && (! pgIdExisst[1] || pgIdExisst[1].length === 0)? true: false;
    
    //console.warn(decodedUrl, " << pathId: ", this.pathId, " compareLen: ", decodedUrl[1].length);
    return compare;
  }

  checkCustomer(urlId, loggedUser) {
    urlId = urlId == 'ארמונות-לב' ? 'ארמונות לב' : urlId;
    let routeName = this.route.snapshot.paramMap.get('name');

    console.warn("Route Name: ", routeName, " id: ", urlId, " loggedUser: ", loggedUser);

    this.halls.getCustomers().then(customersData => {

      if ('customers' in customersData) customersData = customersData['customers'];

      let fields = this.halls.getFieldType(urlId),
          customers = customersData && customersData[routeName] ? customersData[routeName] : false;

      if (!customers) return this.goTo(urlId);

      let customerWithGall = customers.find(cs => cs['customer'][fields[urlId]] == urlId);
      if (! customerWithGall) return this.goTo(urlId); 

      this.halls.customerOb = customerWithGall;
      this.halls.CustomerEmit(customerWithGall);

      let customer = customerWithGall['customer'];
      if (!customer) return this.goTo(urlId);

      this.accessPage = this.urlCompare(this.router.url);
      
      // console.log(customer, " loggedUser: ", loggedUser, " <" + urlCompare, " <:::> ", this.pathId + "> ", (urlCompare == this.pathId), " fields: ", fields);
      if (customer && loggedUser && (customer["user_id"] == loggedUser['id'])) {
        this.canAccess = of(true);
        this.auth.authUser = loggedUser;
        this.customer = of(customerWithGall);

      }else if(customer && this.auth.authUser && this.auth.authUser['authority']?.name == "Admin"){
        // alert("ffff");
        this.canAccess = of(true);
        this.customer = of(customerWithGall);
        // this.accessPage = true;
        
      } else if(customer && customer['email']){
        this.customer = of(customerWithGall);
        console.log("called");
        return;
      }else {
        if (!customer) return this.goTo(urlId);
        this.canAccess = of(false);
        this.auth.authUser = loggedUser;
      }
      // console.log(customers, customerWithGall);
    }); 
  }

  goTo(urlId) {
    
    let path = this.router.url.split("/"+urlId)[0];
    this.router.navigate(['/customers/halls-events']);
    console.log("urlId: ", urlId, " path: ", path, " this.router.url: ", this.router.url);
    return false;
  }

  contactModel(paramCustomer) {
    
    this.customerMessage = {
      id:'contact_customer', 
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
    this.http.sendingMail.next({['contact_customer']: true});
    this.sendingMail = this.http.sendingMail;
  }

  ngOnDestroy() {
    if(this.pageObs) this.pageObs.unsubscribe();
    if(this.userSubs) this.userSubs.unsubscribe();
  }
}