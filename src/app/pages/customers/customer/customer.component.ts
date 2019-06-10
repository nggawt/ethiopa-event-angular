
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomersDataService } from '../../../customers/customers-data-service';
import { Router, ActivatedRoute, NavigationStart, RouterStateSnapshot } from '@angular/router';
// import { HallType } from '../../../../customers/hall-type';
import { first, single, filter, tap, skipWhile, take} from 'rxjs/operators';
import { Observable, of, Observer, Subscriber, Subscribable, Subscription } from 'rxjs';
import { HttpService } from '../../../services/http-service/http.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  providers: []
})

export class CustomerComponent implements OnInit, OnDestroy {

  customer: Observable<any>;
  canAccess: Observable<any> | boolean;
  pathUrl:string | boolean;
  accessPage: boolean = true;
  pageObs: Subscription;
  userSubs: Subscription;
  num: number = 0;
  constructor(private halls: CustomersDataService, 
              private router: Router, 
              private route: ActivatedRoute, 
              private http: HttpService) { }

  ngOnInit() {

    // let pathUrl = this.route.url["value"][0].path;this.route.snapshot.params['id']
    this.pathUrl = this.route.snapshot.params['id'];

      //this.router.events
      
    this.pageObs = this.router.events.pipe(filter(
      (param) => (param instanceof NavigationStart && !! param.url))
      ).subscribe((uriParam) => {

      const currentUrl = decodeURIComponent(uriParam['url']);
      this.pathUrl = currentUrl.indexOf('customers')? currentUrl.split("/")[3]:false;
      
      if(this.pathUrl) this.userSubs = this.http.userObs.subscribe((loggedUser) => { this.checkCustomer(this.pathUrl,loggedUser); });
    });

    this.userSubs = this.http.userObs.subscribe((loggedUser) => { this.checkCustomer(this.pathUrl,loggedUser); });
  }

  urlCompare(uriParam){
    return decodeURIComponent(uriParam).split('/'+this.pathUrl)[1] + this.pathUrl;
  }

  checkCustomer(uri,loggedUser){
    // console.log(uri);
    
    this.halls.getById(uri).then(
      (cust)=> {
        // (typeof param === "object") || param === 1)
          let customer = (cust && cust['customer'])? cust['customer']: false;
          let urlCompare = this.urlCompare(this.router.url);//decodeURIComponent(this.router.url.split("/"+this.pathUrl)[1]);
          // console.log(urlCompare == this.pathUrl);
          console.log(customer);
          
          this.accessPage = (urlCompare == this.pathUrl);
          if(customer && loggedUser && (customer["user_id"] == loggedUser['id'])){
            this.canAccess = of(true);
            this.http.authUser = loggedUser;
          }else{
            this.canAccess = of(false);
            this.http.authUser = loggedUser;
          }
          if(customer && customer["email"]){
            this.customer = of(customer);
          }else{
            let goTo = this.router.url.split(uri)[0];
              this.goTo(goTo);
            setTimeout(() => {
              
              
              
            },200);
          }
    });
  }

  goTo(path){
    this.router.navigate([path]);
  }

  ngOnDestroy(){
    this.pageObs.unsubscribe();
    this.userSubs.unsubscribe();
  }
}
