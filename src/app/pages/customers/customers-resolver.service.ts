import { Injectable, Inject } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { HallType } from '../../customers/hall-type';
import { Observable } from 'rxjs';
import { ResourcesService } from 'src/app/services/resources/resources.service';

@Injectable()

export class CustomersResolver implements Resolve<HallType> {

    constructor(private srv: ResourcesService, private router:Router){}

    resolve(): Observable<HallType[]> | Promise<HallType[]> | HallType[] | any {
        // let loc = decodeURIComponent(location.pathname);
        // let router = decodeURIComponent(this.router.url);
        // let url: string = decodeURIComponent(location.pathname).split('/')[1];
        
        //let customers = this.srv.getResources('customers', false);//.then(customers => {
        //     return customers? customers: [];
        // });
        return this.srv.getResources('customers', false); 
    }
}