import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { map, filter, tap } from 'rxjs/operators';
import { Subscription, Observable, of } from 'rxjs';
import { ResourcesService } from '../../services/resources/resources.service';
import { Router } from '@angular/router';
import { Admin } from 'src/app/types/admin-type';
import { AuthService } from 'src/app/services/http-service/auth.service';


@Component({
  selector: 'main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit, OnDestroy {

  resources: {};
  templateType;
  admin: Observable<Admin>;
  isLogged: { [key: string]: string } | boolean;
  // @ViewChild('main', { static: true }) main: TemplateRef<any>;

  /* Subscription */
  // usersSubsription: Subscription;
  // customersSubsription: Subscription;
  // articlesSubsription: Subscription;
  // eventsSubsription: Subscription;
  adminSubscrition: Subscription;
  resourceSubscrition: Subscription;



  constructor(private http: HttpService, 
    private rsrv: ResourcesService,  
    private router: Router,
    private auth: AuthService) { }

  ngOnInit() {
    this.adminSubscrition = this.auth.userObs.pipe(tap(item => {


    })).subscribe(admin => {
      if (! admin) {
        this.isLogged = { from_path: decodeURIComponent(location.pathname), url: "admin-login", type: "admin" };
      }
      let resources = ['forbidden', 'users', 'customers', 'articles', 'events', 'messages'];
      this.rsrv.initResources(resources, false);
      this.getResources(resources);
      this.admin = of(admin);

    });
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
    if (this.adminSubscrition) this.adminSubscrition.unsubscribe();
    if (this.resourceSubscrition) this.resourceSubscrition.unsubscribe();
    // this.resources$.unsubscribe();
  }



}
