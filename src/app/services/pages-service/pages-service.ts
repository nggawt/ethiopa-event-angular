import { OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()

export class PagesService implements OnDestroy {

    // public data = new BehaviorSubject<{}>({});

    private previousUrl: any = undefined;
    private currentUrl: any = undefined;
    private evtObj: any;
    
    constructor(private router: Router) {

        this.currentUrl = {
            id: this.router["id"],
            prevUrl: this.router["url"]
        };

        this.evtObj = router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        )
        .subscribe(evt => {

            this.previousUrl = this.currentUrl;
            this.currentUrl = {
                id: evt["id"],
                currUrl: evt["url"]
            };
        });
    }

    public getPreviousUrl() {
        return this.previousUrl;
    }
    public getCurrentUrl() {
        return this.currentUrl;
    }

    ngOnDestroy(){
       this.evtObj.unsubscribe();
    }
}




