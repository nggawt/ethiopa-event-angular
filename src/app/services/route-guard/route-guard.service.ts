import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseGuard } from './base-guard.service';


@Injectable({
  providedIn: 'root'
})
export class RouteGuardService extends BaseGuard {


  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    /** lets defined somes props **/
    this.intendedUrl = decodeURIComponent(state.url);
    this.currentUrl = decodeURIComponent(this.router.url);
    this.autUser = this.auth.authUser;
    this.uriId = route.parent.params.id ? decodeURIComponent(route.parent.params.id) : decodeURIComponent(route.params.id);

    
    let uEmail = this.autUser && this.autUser['email'] ? this.autUser['email']: false,
        join = this.intendedUrl.indexOf('/join') >= 0;

    // let reg = this.intendedUrl.indexOf('/register');
      console.log("uriRecourse::::: ", this.uriId);
      
    /** check if exp date is expired then block access **/
    if (! this.auth.authCheck()) {
      return this.goTo(this.currentUrl);
    }
    
    /** if user is admin allow access **/
    if (this.autUser && this.autUser['type'] == "admin") return true;
    console.log("this.auth.authCheck()::: ", this.auth.authCheck(), " ::autUser:: ", this.autUser);

    /** if our uri is /join and we have auth user, lets check if auth user is already our customer member and let him access join page if false **/
    if (join && uEmail) {
      this.customers.intendedUrl = this.intendedUrl;
      return this.userAlreadyCostumer(uEmail);
    }

    /** if no user and login session not expaired get logged user check match conditions and sallow access **/
    if (! this.auth.authUser) return this.getLoggedUser();

    let css;
    if (css = this.customers.customerOb ? (this.customers.customerOb['customer']) : false) {
      // console.log("called gurd admin", this.autUser, " custmer: ", css.company);
      if ((!join && uEmail === css['email'])) return true;
    }

    // console.log("authUser: ", this.autUser, " uEmail: ", uEmail, " uriRecourse: ", uriRecourse);
    /**** so if we have auth user lats check if we have customer and let access intended page if user are owner ****/
    if (uEmail && !join) { return this.customerIsOwner(uEmail); };

    /**** get log in user whitin http loged in ****/
    return this.goTo();//this.userPromise(uEmail, uriRecourse, join);
  }
}
