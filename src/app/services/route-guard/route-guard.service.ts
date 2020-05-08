import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { HttpService } from '../http-service/http.service';
import { Observable } from 'rxjs';
import { CustomersDataService } from '../../customers/customers-data-service';
import { find } from 'rxjs/operators';
import { User } from 'src/app/types/user-type';
import { Admin } from 'src/app/types/admin-type';
import { AuthService } from '../http-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate, CanActivateChild {

  private autUser: User | Admin | boolean;
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
    private auth: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    /** lets defined somes props **/
    this.intendedUrl = decodeURIComponent(state.url);
    this.currentUrl = decodeURIComponent(this.router.url);
    this.autUser = this.auth.authUser;

    let uriRecourse = route.parent.params.id ? route.parent.params.id : route.params.id,
      uEmail = this.autUser && this.autUser['email'] ? this.autUser['email'] : 
                this.autUser && this.autUser['user']? this.autUser['user']['email']: false,
      join = this.intendedUrl.indexOf('/join') >= 0;

    // let reg = this.intendedUrl.indexOf('/register');

    /** check if exp date is expired then block access **/
    if (this.http.isExpiredToken()) {
      return this.goTo(this.currentUrl);
    }

    /** if user is admin allow access **/
    if (this.userIsAdmin(this.autUser)) return true;

    /** if our uri is /join and we have auth user, lets check if auth user is already our customer member and let him access join page if false **/
    if (join && uEmail) {
      this.customers.intendedUrl = this.intendedUrl;
      return this.userAlreadyCostumer(uEmail);
    }

    /** if no user and login session not expaired get logged user check match conditions and sallow access **/
    if (! this.auth.authUser) return this.getLoggedUser(uriRecourse);

    let css;
    if (css = this.customers.customerOb ? (this.customers.customerOb['customer']) : false) {
      console.log("called gurd admin", this.autUser, " custmer: ", css.company);
      if ((! join && uEmail === css['email']) || this.userIsAdmin(this.autUser)) return true;
    }

    console.log("authUser: ", this.autUser, " uEmail: ", uEmail, " uriRecourse: ", uriRecourse);
    /**** so if we have auth user lats check if we have customer and let access intended page if user are owner ****/
    if (uEmail && ! join) { return this.customerIsOwner(uriRecourse, uEmail); };

    /**** get log in user whitin http loged in ****/
    return this.goTo();//this.userPromise(uEmail, uriRecourse, join);
  }

  protected getLoggedUser(uriRecourse): Promise<boolean> {

    return this.auth.userObs.pipe(
      find(val => typeof val == "object"),
    ).toPromise().then((user) => {
      
      if (this.userIsAdmin(user)) return true;
      return this.guardProccesCanActive(user, uriRecourse);

    });
  }

  async guardProccesCanActive(user, uriRecourse): Promise<any> {

    if (user && user['email']) {

      user = user['user'] ? user['user'] : user;
      this.autUser = user;
      let uEmail = this.autUser['email'];

      if (this.intendedUrl == "/join" && uEmail) {
        this.customers.intendedUrl = this.intendedUrl;
        let isCustomer = await this.userAlreadyCostumer(uEmail);
        return isCustomer;
      }

      let isOwnResource = await this.customerIsOwner(uriRecourse, this.autUser['email']);
      return isOwnResource;
    }
    console.log("go to");
    return this.goTo(uriRecourse);
  }

  protected userIsAdmin(user) {
    return (user && user['authority'] && user['authority'].name == "Admin");
  }

  allowLogin(url) {
    this.auth.allowLogIn.next(true);
    this.goTo(url);
  }

  goTo(paramId?) {

    let goTo: string;
    paramId = paramId == 'ארמונות לב'? 'ארמונות-לב': paramId;

    if (! paramId) {
      let priefixUrl = (this.intendedUrl.indexOf('customers') >= 0) ? this.intendedUrl.split('customers/')[1] : this.intendedUrl;
      priefixUrl = (priefixUrl.indexOf('/') >= 1) ? priefixUrl.split('/')[0] : priefixUrl;
      goTo = priefixUrl && (this.allawAddress.indexOf(priefixUrl) >= 0) ? "/customers/" + priefixUrl : '/';//"/error-page";
    } else {
      goTo = this.intendedUrl == "/join" ? paramId : this.intendedUrl.split(paramId)[0] + paramId;
    }
    console.log("paramId: ", paramId, " >><< URL: ", goTo);
    this.router.navigate([goTo]);//, { relativeTo: this.active }
    return false;
  }

  async customerIsOwner(uriRecourse, uEmail): Promise<boolean> {

    uriRecourse = uriRecourse == 'ארמונות-לב' ? 'ארמונות לב' : uriRecourse;

    let getCustomer = await this.customers.getById(uEmail),
        customer = getCustomer && getCustomer['customer'] ? getCustomer['customer'] : getCustomer;

    if (customer && uEmail === customer['emails']) return true;
    return this.goTo(uriRecourse);
  }

  userAlreadyCostumer(param): Promise<boolean> {
    console.log("called");

    return this.customers.getById(param)
      .then((res) => {
        console.log("userAlreadyCostumer response: ", res);
        return res ? this.goTo(this.currentUrl) : true;
      });
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
}


