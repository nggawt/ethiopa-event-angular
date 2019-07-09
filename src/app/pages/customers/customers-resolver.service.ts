import { Injectable, Inject } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { HallType } from '../../customers/hall-type';
import { Observable } from 'rxjs';
import { CustomersDataService } from '../../customers/customers-data-service';
import { map } from 'rxjs/operators';

@Injectable()

export class CustomersResolver implements Resolve<HallType> {

    constructor(private halls: CustomersDataService, private router:Router){}

    resolve(): Observable<HallType[]> | Promise<HallType[]> | HallType[] | any {
        let loc = decodeURIComponent(location.pathname);
        let router = decodeURIComponent(this.router.url);
        let url: string = decodeURIComponent(location.pathname).split('/')[1];

        /* if(url == 'photographers') console.log(url);
        if(url == 'halls-events') console.log(url);
        console.log(loc);
        console.log(router); */
        
        return this.halls.getCustomers('customers');
    }
}