import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { skipWhile, map, filter, tap, first } from 'rxjs/operators';
import { Subscription, Observable, of } from 'rxjs';
import { ResourcesService } from '../../services/resources/resources.service';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';


@Component({
  selector: 'main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit, OnDestroy {

  resources: {};
  templateType;

  // @ViewChild('main', { static: true }) main: TemplateRef<any>;

  /* Subscription */
  // usersSubsription: Subscription;
  // customersSubsription: Subscription;
  // articlesSubsription: Subscription;
  // eventsSubsription: Subscription;
  routerSubscrition: Subscription;
  resourceSubscrition: Subscription;



  constructor(private http: HttpService, private rsrv: ResourcesService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    let resources = ['forbidden', 'users', 'customers', 'articles', 'events', 'messages'];
    // this.routerSubscrition = this.router.events.pipe(filter(obType => obType instanceof NavigationStart)).subscribe(routeUrl => {/*  || obType instanceof NavigationEnd */
    //   this.templateType = routeUrl['url'] == '/dashboard' ? this.main : false;
    //   console.log("cccc");
      
    // });

    // this.templateType = this.router['url'] == '/dashboard' ? this.main : false;
    this.rsrv.initResources(resources, false);
    // this.srv.initResources('admins');

    this.getResources(resources);
  }

  getResources(res: string[]): Observable<{}> | any {
    let itemsResources = {};

    res.forEach(resource => {

      this.resourceSubscrition = this.rsrv[resource]
        .pipe(filter(items => typeof items == "object"),
          map(item => this.rsrv.pagination(item, resource)))
        .subscribe(itemRes => {
          if (itemRes) itemsResources[resource] = itemRes;
        });
    });
    this.resources = itemsResources;
  }

  
  getOuterRquests() {
    console.log(this.http.outRequests);
  }


  setTemplateType(tempType) {
    this.templateType = tempType;
  }

  getCustomers(customers) {
    return Object.keys(customers).map(customersType => customers[customersType].map(item => {
      return { customer: item['customer'], gallery: item['gallery'] };
    }));
  }



  checkHasKey(item, key) {
    return (key in item) ? true : false;
  }


  login(path) {
    // console.log(loginTemplete);
    // this.loginTemp = true;
    this.http.requestUrl = decodeURIComponent(location.pathname);
    // this.http.intendedUri = this.http.requestUrl
    this.http.loginTo = "admin-login";

    this.router.navigate([path]);
  }

  logout() {
    this.http.logOut('admin-logout').subscribe(res => {
      console.log(res);
    });
  }

  create(path) {
    this.http.requestUrl = decodeURIComponent(location.pathname);
    console.log('url: ', path, ' location: ', this.http.requestUrl);
    this.router.navigate([path]);
  }

  ngOnDestroy() {
    /* this.usersSubsription.unsubscribe();
    this.customersSubsription.unsubscribe();
    this.articlesSubsription.unsubscribe();
    this.eventsSubsription.unsubscribe(); */
    if(this.routerSubscrition) this.routerSubscrition.unsubscribe();
    if(this.resourceSubscrition) this.resourceSubscrition.unsubscribe();
    // this.resources$.unsubscribe();
  }



}
