import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import { BaseGuard } from './base-guard.service';


@Injectable({
  providedIn: 'root'
})
export class RouteAdminGuardService extends BaseGuard{

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    /** lets defined somes varbs **/
    this.intendedUrl = decodeURIComponent(state.url);
    this.currentUrl = decodeURIComponent(this.router.url);
    this.autUser = this.auth.authUser;
    this.uriId = route.parent.params.id ? decodeURIComponent(route.parent.params.id) : decodeURIComponent(route.params.id);

    /** check if exp date is expired then block access **/
    if (! this.auth.authCheck()) {
      return this.goTo(this.currentUrl);
    }

    /** if user is admin allow access **/
    if (this.autUser && this.autUser['type'] == "admin") return true;

    /** if no user and login session not expaired get logged user check match conditions and sallow access **/
    if (! this.auth.authUser) return this.getLoggedUser('admin');

    /**** get log in user whitin http loged in ****/
    return this.goTo(this.currentUrl);//this.userPromise(uEmail, this.currentUrl, join);
  }
}