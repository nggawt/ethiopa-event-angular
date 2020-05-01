import { User } from 'src/app/types/user-type';
import { Admin } from 'src/app/types/admin-type';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, CanActivateChild, ActivatedRoute } from '@angular/router';
import { HttpService } from '../http-service/http.service';
import { Observable } from 'rxjs';
import { CustomersDataService } from '../../customers/customers-data-service';
// import { map, last, filter, first, skip, tap, find } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate, CanActivateChild {

  private autUser = {};
  private intendedUrl: string;
  private currentUrl: string;

  private allawAddress = [
    'halls-events', 
    'app/halls-events', 
    "hotels", "salons", 
    "app/salons", 
    "app/hotels", 
    "photographers", 
    "app/photographers"
  ];


  constructor(private http: HttpService,
    private customers: CustomersDataService,
    private router: Router,
    private active: ActivatedRoute) { }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    /****** 
     * if costumr recourse is true else ->> return false and redirect to main path recourse
     * then check if user authenticated is true else ->> rediract to recourse/customer/media and ask to Log-in
     * then check if customer recourse blong to user authenticated true else ->> rediract to recourse/customer/media 
     * then user is owner and return true
    ******/

    /** lets defined somes props **/
    this.intendedUrl = decodeURIComponent(state.url);
    this.currentUrl = decodeURIComponent(this.router.url);

    let customerUriRecourse = route.parent.params.id ? route.parent.params.id : route.params.id;

    this.autUser = this.http.authUser;
    let uEmail = this.autUser ? this.autUser['email'] : false;
    let join = this.intendedUrl.indexOf('/join');
    // let reg = this.intendedUrl.indexOf('/register');
      
    if(! this.http.authUser){
      return this.http.userPromise().then((user) =>{
        console.log("user: ", user, " this.currentUrl : ", this.currentUrl, " this.intendedUrl: ", this.intendedUrl, " customerUriRecourse: ", customerUriRecourse);
        if(user && user['status']){
          
          this.autUser = user['user'];
          return this.checkCustomer(customerUriRecourse, this.autUser['email']);
        }else if(user && user['authority'] && user['authority'].name == "Admin"){
          console.log("its admin");
          return true;
        }else {
         this.goTo(customerUriRecourse);
        }
        return false;
      });
    }

    /** if our uri is /join, lets check if auth user is already our customer member and let him access join page if false **/
    if (join >= 0 && uEmail) {
      this.customers.intendedUrl = this.intendedUrl;
      return this.userAlreadyCostumer(uEmail);
    }
    
    let css;
    if(css = this.customers.customerOb? (this.customers.customerOb['customer']): false){
      console.log("called gurd admin", this.autUser, " custmer: ", css.company);
      if (uEmail === css['email'] || (this.autUser && this.autUser['authority'] && this.autUser['authority'].name == "Admin")) return true; 
      console.log("called Again gurd admin", this.autUser);
      return false;
    }
    console.log("authUser: ", this.autUser," uEmail: ", uEmail, " customerUriRecourse: ", customerUriRecourse);
    /**** so if we have auth user lats check if we have customer and let access intended page if user are owner ****/
    if (uEmail) { return this.checkCustomer(customerUriRecourse, uEmail); };
    
    /**** get log in user whitin http loged in ****/
    return this.userPromise(uEmail, customerUriRecourse, join);
  }

  allowLogin(url) {
    this.http.allowLogIn.next(true);
    this.goTo(url);
  }

  goTo(paramId?) {

    let goTo: string;

    if (!paramId) {
      let priefixUrl = (this.intendedUrl.indexOf('customers') >= 0) ? this.intendedUrl.split('customers/')[1] : this.intendedUrl;
      priefixUrl = (priefixUrl.indexOf('/') >= 1) ? priefixUrl.split('/')[0] : priefixUrl;
      goTo = priefixUrl && (this.allawAddress.indexOf(priefixUrl) >= 0) ? "/customers/" + priefixUrl : '/';//"/error-page";
    } else {
      goTo =  this.intendedUrl.split(paramId)[0]+paramId;
    }
    console.log(goTo);
    this.router.navigate([goTo]);//, { relativeTo: this.active }
    return false;
  }

  checkCustomer(customerUriRecourse, uEmail) {
    customerUriRecourse = customerUriRecourse == 'ארמונות-לב'? 'ארמונות לב': customerUriRecourse;
    

    return this.customers.getById(customerUriRecourse)
      .then((res) => {
        let customer = res && res['customer'] ? res['customer'] : res;
        console.log(uEmail, res, customerUriRecourse);

        /****** if we have user and customer. lets check if auth user is owen recourse if true give auth user access ******/
        if (customer && uEmail === customer['email']) return true; 
        console.log("passssssssssssssssssssssssssssssssssssssssssssssss");

        /****** if auth user is not own recourse check one more time if we have auth user if false navigate him to recourse/media with posibility to log in ******/
        if (!uEmail && customer) {
          this.http.allowLogIn.next(true);
          this.http.intendedUri = this.intendedUrl;
        }

        /****** redirect user to recourse/media  ******/
        let goToMedia = customer ? "/customers/" + customer['businessType'] + "/" + customerUriRecourse : false;
        goToMedia ? this.goTo(goToMedia) : this.goTo();
        return false;
      },
        (rej) => {
          console.log("rejected");
          /****** redirect user to main page or main recourse if exisist else go to home page******/
          return this.goTo();
        });
  }

  userAlreadyCostumer(param) {
    return this.customers.getById(param)
      .then((res) => {
        console.log(res);

        return res ? this.goTo(this.currentUrl) : true;

      });
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }

  userPromise(uEmail, customerUriRecourse, join){

    this.http.userObs.subscribe(user => {
      console.log(user);
      
    });

    return this.http.userPromise()
      .then((responseUser) => {

        let user = responseUser && responseUser['status'] ? responseUser['user'] : false;
        /*** attach auth user props ***/
        uEmail = !uEmail && user ? user['email'] : uEmail;
        this.autUser = user ? responseUser : false;

        /** if our uri is /join, lets check if auth user is already our customer member and let him access join page if false **/
        if (join >= 0 && responseUser['email']) {
          this.customers.intendedUrl = this.intendedUrl;
          return this.userAlreadyCostumer(uEmail);
        }
        if (join >= 0 && !uEmail) {

          this.allowLogin(this.currentUrl);
          return false;
        }
        console.log(customerUriRecourse, uEmail);
        
        /**** so if we have auth user lats check if we have customer and let access intended page if user are owner ****/
        return this.checkCustomer(customerUriRecourse, uEmail);

      },
        (reject) => {
          /****** if we in /join page and we have no user. lets get user to log in ******/
          if (join >= 0 && !uEmail) {

            this.http.allowLogIn.next(true);
            return this.goTo(this.currentUrl);
          }

          /****** we have no user. lets check customer uri recourse ******/
          if (!customerUriRecourse) return this.goTo();
          /**** lats check if we have customer and navigate recourse if true and let user log in ****/
          return this.checkCustomer(customerUriRecourse, uEmail);
        });
  }

}


