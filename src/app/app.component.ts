import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, RoutesRecognized, Event, NavigationError, NavigationCancel } from '@angular/router';
import { Location } from '@angular/common';
// import { PagesService } from './pages-service';
// import { UrlServiceService } from './url-service.service';
import { Observable, of, Subject, Subscription, Subscriber } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

// import { map, filter, tap, first, debounceTime, distinctUntilChanged, takeWhile } from 'rxjs/operators';
// import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {
  constHome: boolean = false;
  showIndicetor: Observable<boolean>;
  uriObject: Subscription;

  constructor(private location: Location, private router: Router) {}

  ngOnInit() {
    this.uriObject = this.router.events.pipe(filter(evt => {
      return ((evt instanceof NavigationStart) || (evt instanceof RoutesRecognized) || (evt instanceof NavigationEnd) || 
      (evt instanceof NavigationError) || (evt instanceof NavigationCancel));
      
    }))
    .subscribe((_evt:any) => {
      
      this.constHome = this.location.path() === '' ? true : false;
      if(_evt instanceof NavigationStart){
        this.showIndicetor = of(true);
        // this.constHome = true;
      }
      if(_evt instanceof NavigationEnd || _evt instanceof NavigationError || _evt instanceof NavigationCancel){
        this.showIndicetor = of(false);
        // this.constHome = false;
      }
    });
  }
  
  ngAfterViewInit(){

  }

  ngOnDestroy() {
    // (! this.constHome)? this.uriObject.unsubscribe(): '';
  }
}