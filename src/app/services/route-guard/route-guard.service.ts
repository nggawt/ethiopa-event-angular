import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { HttpService } from '../http-service/http.service';
import { Observable } from 'rxjs';
import { CustomersDataService } from '../../customers/customers-data-service';
import { find, map, tap, single } from 'rxjs/operators';
import { UserFields } from 'src/app/types/user-type';
import { AdminUser } from 'src/app/types/admin-type';
import { AuthService } from '../auth-service/auth.service';


@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate, CanActivateChild {

  private autUser: UserFields | AdminUser | boolean;
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
        uEmail = this.autUser && this.autUser['email'] ? this.autUser['email']: false,
        join = this.intendedUrl.indexOf('/join') >= 0;

    // let reg = this.intendedUrl.indexOf('/register');

    /** check if exp date is expired then block access **/
    if (! this.auth.authCheck()) {
      return this.goTo(this.currentUrl);
    }
    console.log("this.auth.authCheck()::: ", this.auth.authCheck());
    
    /** if user is admin allow access **/
    if (this.autUser && this.autUser['type'] == "admin") return true;

    /** if our uri is /join and we have auth user, lets check if auth user is already our customer member and let him access join page if false **/
    if (join && uEmail) {
      this.customers.intendedUrl = this.intendedUrl;
      return this.userAlreadyCostumer(uEmail);
    }

    /** if no user and login session not expaired get logged user check match conditions and sallow access **/
    if (!this.auth.authUser) return this.getLoggedUser(uriRecourse);

    let css;
    if (css = this.customers.customerOb ? (this.customers.customerOb['customer']) : false) {
      // console.log("called gurd admin", this.autUser, " custmer: ", css.company);
      if ((!join && uEmail === css['email'])) return true;
    }

    // console.log("authUser: ", this.autUser, " uEmail: ", uEmail, " uriRecourse: ", uriRecourse);
    /**** so if we have auth user lats check if we have customer and let access intended page if user are owner ****/
    if (uEmail && !join) { return this.customerIsOwner(uriRecourse, uEmail); };

    /**** get log in user whitin http loged in ****/
    return this.goTo();//this.userPromise(uEmail, uriRecourse, join);
  }

  protected getLoggedUser(uriRecourse): Promise<boolean> {

    return this.auth.userObs.pipe(
      find(val => typeof val == "object"),
      map(users => this.auth.getActiveUser(users)),
    ).toPromise().then((user) => {

      if (user && user['type'] == "admin") return true;
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
    // console.log("go to");
    return this.goTo(uriRecourse);
  }


  async customerIsOwner(uriRecourse, uEmail): Promise<boolean> {

    uriRecourse = uriRecourse == 'ארמונות-לב' ? 'ארמונות לב' : uriRecourse;

    let getCustomer = await this.customers.getById(uriRecourse),
      customer = getCustomer && getCustomer['customer'] ? getCustomer['customer'] : getCustomer;
    // console.log("customer: ", customer, " ::email::", uEmail);

    if (customer && uEmail === customer['email']) return true;
    return this.goTo(uriRecourse);
  }

  userAlreadyCostumer(param): Promise<boolean> {

    return this.customers.getById(param)
      .then((res) => {
        // console.log("userAlreadyCostumer response: ", res);
        return res ? this.goTo(this.currentUrl) : true;
      });
  }

  allowLogin(url) {
    this.auth.allowLogIn.next(true);
    this.goTo(url);
  }

  goTo(paramId?: string) {

    let goTo: string;
    paramId = paramId && (paramId.indexOf(' ') > -1)? paramId.replace(' ', '-'): paramId;

    if (! paramId) {
      let priefixUrl = (this.intendedUrl.indexOf('customers') >= 0) ? this.intendedUrl.split('customers/')[1] : this.intendedUrl;
      priefixUrl = (priefixUrl.indexOf('/') >= 1) ? priefixUrl.split('/')[0] : priefixUrl;
      goTo = priefixUrl && (this.allawAddress.indexOf(priefixUrl) >= 0) ? "/customers/" + priefixUrl : '/';//"/error-page";
    } else {
      goTo = this.intendedUrl == "/join" ? '/' : this.intendedUrl.split(paramId)[0] + paramId;
    }
    console.log("paramId: ", paramId, " >><< URL: ", goTo);
    this.router.navigate([goTo]);//, { relativeTo: this.active }
    return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
