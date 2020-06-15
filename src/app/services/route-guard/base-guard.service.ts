import { find, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { CustomersDataService } from './../../customers/customers-data-service';
import { HttpService } from 'src/app/services/http-service/http.service';
import { AdminUser } from 'src/app/types/admin-type';
import { UserFields } from 'src/app/types/user-type';

@Injectable()
export abstract class BaseGuard implements CanActivate, CanActivateChild {
    protected autUser: UserFields | AdminUser | boolean;
    protected intendedUrl: string;
    protected currentUrl: string;
    protected uriId: string;

    protected allawAddress = [
        'halls-events',
        'app/halls-events',
        "hotels", "salons",
        "app/salons",
        "app/hotels",
        "photographers",
        "app/photographers"
    ];

    constructor(protected http: HttpService,
        protected customers: CustomersDataService,
        protected router: Router,
        protected auth: AuthService) { }

    abstract canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean;

    async guardProccesCanActive(user): Promise<any> {

        if (user && user['email']) {

            user = user['user'] ? user['user'] : user;
            this.autUser = user;
            let uEmail = this.autUser['email'];

            if (this.intendedUrl == "/join" && uEmail) {
                this.customers.intendedUrl = this.intendedUrl;
                let isCustomer = await this.userAlreadyCostumer(uEmail);
                return isCustomer;
            }
            let isOwnResource = await this.customerIsOwner(this.autUser['email']);
            return isOwnResource;
        }
        return this.goTo();
    }

    protected getLoggedUser(uType?: string): Promise<boolean> {

        return this.auth.userObs.pipe(
            find(val => typeof val == "object"),
            map(users => this.auth.getActiveUser(users, (uType ? uType : false))),
        ).toPromise().then((user) => {

            if (user && user['type'] == "admin") return true;
            return uType ? this.goTo() : this.guardProccesCanActive(user);
        });
    }

    userAlreadyCostumer(param: string): Promise<boolean> {
        return this.customers.getById(param)
            .then((res) =>  res ? this.goTo(this.currentUrl) : true);
    }

    async customerIsOwner(uEmail): Promise<boolean> {

        let uriRecourse = (this.uriId.indexOf('-') > -1) ? this.uriId.replace('-', ' ') : this.uriId;

        let getCustomer = await this.customers.getById(uriRecourse),
            customer = getCustomer && getCustomer['customer'] ? getCustomer['customer'] : getCustomer;

        if (customer && uEmail === customer['email']) return true;
        return this.goTo();
    }

    goTo(paramId?: string) {

        let goTo: string;
        paramId = paramId && (paramId.indexOf(' ') > -1) ? paramId.replace(' ', '-') : paramId;

        if (!paramId) {
            goTo = (this.intendedUrl.indexOf(this.uriId) > -1 )? this.intendedUrl.split(this.uriId)[0]+"/"+this.uriId : this.currentUrl;
        } else {
            goTo = this.intendedUrl == "/join" ? paramId : 
                    ((this.intendedUrl.indexOf(this.uriId) > -1) 
                    && this.intendedUrl.indexOf('customers') >= 0) ? 
                    this.intendedUrl.split(this.uriId )[0] +"/"+this.uriId: this.currentUrl;
        }
        console.log("this.uriId : ", this.uriId , " ::>>URL<<:: ", goTo, " ::this.currentUrl ", this.currentUrl, " ::this.intendedUrl ", this.intendedUrl);
        this.router.navigate([goTo]);
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.canActivate(route, state);
    }
}