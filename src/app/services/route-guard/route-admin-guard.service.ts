import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { find, map } from 'rxjs/operators';
import { UserFields } from 'src/app/types/user-type';
import { AdminUser } from 'src/app/types/admin-type';
import { AuthService } from '../auth-service/auth.service';


@Injectable({
  providedIn: 'root'
})
export class RouteAdminGuardService implements CanActivate, CanActivateChild {

  private autUser: UserFields | AdminUser | boolean;
  private intendedUrl: string;
  private currentUrl: string;

  constructor(private router: Router,
    private auth: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    /** lets defined somes varbs **/
    this.intendedUrl = decodeURIComponent(state.url);
    this.currentUrl = decodeURIComponent(this.router.url);
    this.autUser = this.auth.authUser;

    /** check if exp date is expired then block access **/
    if (! this.auth.authCheck()) {
      return this.goTo(this.currentUrl);
    }

    /** if user is admin allow access **/
    if (this.autUser && this.autUser['type'] == "admin") return true;

    /** if no user and login session not expaired get logged user check match conditions and sallow access **/
    if (! this.auth.authUser) return this.getLoggedUser();

    /**** get log in user whitin http loged in ****/
    return this.goTo(this.currentUrl);//this.userPromise(uEmail, this.currentUrl, join);
  }

  protected getLoggedUser(): Promise<boolean> {

    return this.auth.userObs.pipe(
      find(val => typeof val == "object"),
      map(users => this.auth.getActiveUser(users, 'admin'))
    ).toPromise().then((user) => {
      return (user && user['type'] == "admin")? true: this.goTo();
    });
  }

  goTo(paramId?) {

    console.log("paramId: ", paramId, " >><< this.currentUrl: ", this.currentUrl);
    this.router.navigate([(paramId? paramId: this.currentUrl)]);
    return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
}


