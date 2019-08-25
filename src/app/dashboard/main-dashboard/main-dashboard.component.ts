import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { skipWhile, map, filter, tap, first } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { ResourcesService } from '../../services/resources/resources.service';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit, OnDestroy {

  resources$: Observable<{}>;
  templateType;

  @ViewChild('main', { static: true }) main: TemplateRef<any>;

  /* Subscription */
  // usersSubsription: Subscription;
  // customersSubsription: Subscription;
  // articlesSubsription: Subscription;
  // eventsSubsription: Subscription;
  routerSubscrition: Subscription;
  resourceSubscrition: Subscription;



  constructor(private http: HttpService, private srv: ResourcesService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {

    this.routerSubscrition = this.router.events.pipe(filter(obType => obType instanceof NavigationStart)).subscribe(routeUrl => {/*  || obType instanceof NavigationEnd */
      this.templateType = routeUrl['url'] == '/dashboard' ? this.main : null;
    });

    this.templateType = this.router['url'] == '/dashboard' ? this.main : null;
    this.srv.initResources(['users', 'customers', 'articles', 'events'], true);
    // this.srv.initResources('admins');

    this.resources$ = this.srv.resourcesObsever.pipe(first(item => typeof item == "object"));
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
    this.routerSubscrition.unsubscribe();
    // this.resources$.unsubscribe();
  }



}
