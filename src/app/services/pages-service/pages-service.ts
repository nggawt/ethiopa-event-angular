import { OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Injectable()

export class PagesService {

    // public data = new BehaviorSubject<{}>({});

    private previousUrl: any = undefined;
    private currentUrl: any = undefined;

    public pagesSubscription: Subscription;
    
    constructor(private router: Router) {

        this.currentUrl = {
            id: this.router["id"],
            prevUrl: this.router["url"]
        };

        this.pagesSubscription = router.events.pipe(
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
}




