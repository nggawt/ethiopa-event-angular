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
    'halls-events', 'app/halls-events', "hotels", "salons", "app/salons", "app/hotels", "photographers", "app/photographers"
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
    console.log("responseUser");

    /** lets defined somes props **/
    this.intendedUrl = decodeURIComponent(state.url);
    this.currentUrl = decodeURIComponent(this.router.url);

    let costumerUriRecourse = route.parent.params.id ? route.parent.params.id : route.params.id;

    this.autUser = this.http.authUser;
    let uEmail = this.autUser ? this.autUser['email'] : false;
    let join = this.intendedUrl.indexOf('/join');
    // let reg = this.intendedUrl.indexOf('/register');

    /** if our uri is /join, lets check if auth user is already our customer member and let him access join page if false **/
    if (join >= 0 && uEmail) {
      this.customers.intendedUrl = this.intendedUrl;
      return this.userAlreadyCostumer(uEmail);
    }

    /**** so if we have auth user lats check if we have customer and let access intended page if user are owner ****/
    if (uEmail) { return this.checkCustomer(costumerUriRecourse, uEmail); };

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

        /**** so if we have auth user lats check if we have customer and let access intended page if user are owner ****/
        return this.checkCustomer(costumerUriRecourse, uEmail);

      },
        (reject) => {
          /****** if we in /join page and we have no user. lets get user to log in ******/
          if (join >= 0 && !uEmail) {

            this.http.allowLogIn.next(true);
            return this.goTo(this.currentUrl);
          }

          /****** we have no user. lets check customer uri recourse ******/
          if (!costumerUriRecourse) return this.goTo();
          /**** lats check if we have customer and navigate recourse if true and let user log in ****/
          return this.checkCustomer(costumerUriRecourse, uEmail);
        });
  }

  allowLogin(url) {
    this.http.allowLogIn.next(true);
    this.goTo(url);
  }

  goTo(intendedUrl?) {

    let goTo: string;

    if (!intendedUrl) {

      let priefixUrl = (this.intendedUrl.indexOf('customers') >= 0) ? this.intendedUrl.split('customers/')[1] : this.intendedUrl;
      priefixUrl = (priefixUrl.indexOf('/') >= 1) ? priefixUrl.split('/')[0] : priefixUrl;
      goTo = priefixUrl && (this.allawAddress.indexOf(priefixUrl) >= 0) ? "/customers/" + priefixUrl : '/';//"/error-page";

    } else {
      goTo = intendedUrl;
    }
    console.log(goTo);

    this.router.navigate([goTo]);//, { relativeTo: this.active }
    return false;
  }

  checkCustomer(costumerUriRecourse, uEmail) {
    console.log(costumerUriRecourse);

    return this.customers.getById(costumerUriRecourse)
      .then((res) => {
        let customer = res && res['customer'] ? res['customer'] : res;
        console.log(uEmail);

        /****** if we have user and customer. lets check if auth user is owen recourse if true give auth user access ******/
        if (customer && uEmail === customer['email']) { return true; }

        /****** if auth user is not own recourse check one more time if we have auth user if false navigate him to recourse/media with posibility to log in ******/
        if (!uEmail && customer) {
          this.http.allowLogIn.next(true);
          this.http.intendedUri = this.intendedUrl;
        }
        /****** redirect user to recourse/media  ******/
        let goToMedia = customer ? "/customers/" + customer['businessType'] + "/" + costumerUriRecourse : false;


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

}


