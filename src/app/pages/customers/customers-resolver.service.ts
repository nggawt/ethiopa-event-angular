import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ResourcesService } from 'src/app/services/resources/resources.service';
import { Customers } from 'src/app/types/customers-type';

@Injectable()

export class CustomersResolver implements Resolve<Customers> {

    constructor(private srv: ResourcesService){}

    resolve(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<Customers> | Promise<Customers> | Customers {
        // let loc = decodeURIComponent(location.pathname);
        // let router = decodeURIComponent(this.router.url);
        // let url: string = decodeURIComponent(location.pathname).split('/')[1];
        
        //let customers = this.srv.getResources('customers', false);//.then(customers => {
        //     return customers? customers: [];
        // });
        let r = route.paramMap.get('name');
        return this.srv.getResources('customers', false).then(customers => customers[r]); 
    }
}