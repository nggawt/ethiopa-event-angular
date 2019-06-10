import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { skipWhile, map, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ResourcesService } from '../resources.service';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit, OnDestroy {

  resources: {} = {};
  templateType;

  @ViewChild('default', {static: true}) default: TemplateRef<any>;

  /* Subscription */
  usersSubsription: Subscription;
  customersSubsription: Subscription;
  articlesSubsription: Subscription;
  eventsSubsription: Subscription;
  routerSubscrition: Subscription;

  timer: number = 0;


  constructor(private http: HttpService, private rsSrv: ResourcesService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    
    console.log(this.http.requestUrl );
    this.http.loginTo = "auth-admin";
    // this.http.userPromise().then(admin => console.log(admin));

    this.routerSubscrition = this.router.events.pipe(filter(obType => obType instanceof NavigationStart)).subscribe(routeUrl => {/*  || obType instanceof NavigationEnd */
      this.templateType = routeUrl['url'] == '/dashboard' ? this.default : null;
    });

    this.templateType = this.router['url'] == '/dashboard' ? this.default : null;
    this.initResources();
  }

  setTemplateType(tempType) {
    this.templateType = tempType;
  }

  protected initResources() {

    // users
    this.usersSubsription = this.http.getData('users').pipe(map(items => (items && ! this.checkConfirmedKey(items, 'status'))? this.mapItems(items): false)).subscribe(users => {
      //let userStatus = (users && ! this.checkConfirmedKey(users, 'status'))? true: this.checkConfirmedKey(users, 'status') && users['status']? true: false;
      if (users) {
        this.resources['users'] = {
          count: users.activeated.length,
          data: users.activeated,
          pending: users.pending,
          config: {
            id: 'users',
            itemsPerPage: 3,
            currentPage: 1,
            totalItems: users.activeated.length
          }
        };
      }
      this.timer++;
    });

    // customers
    this.customersSubsription = this.http.getData('customers').pipe(map(custs => this.mapItems(custs))).subscribe(customers => {

      this.resources['customers'] = {
        count: customers.activeated.length,
        data: customers.activeated,
        pending: customers.pending,
        config: {
          id: 'customers',
          itemsPerPage: 3,
          currentPage: 1,
          totalItems: customers.activeated.length
        }
      };
      this.timer++;
    });
    // blog\articles
    this.articlesSubsription = this.http.getData('blog').pipe(map(items => this.mapItems(items))).subscribe(articles => {

      this.resources['articles'] = {
        count: articles.activeated.length,
        data: articles.activeated,
        pending: articles.pending,
        config: {
          id: 'articles',
          itemsPerPage: 3,
          currentPage: 1,
          totalItems: articles.activeated.length
        }
      };
      this.timer++;
      // console.log(articles);
    });
    // events
    this.eventsSubsription = this.http.getData('events').pipe(map(items => this.mapItems(items))).subscribe(events => {

      this.resources['events'] = {
        count: events.activeated.length,
        data: events.activeated,
        pending: events.pending,
        config: {
          id: 'events',
          itemsPerPage: 3,
          currentPage: 1,
          totalItems: events.activeated.length
        }
      };
      this.timer++;
      // console.log(events);
    });

    let interval = setInterval(() => {
      if (this.timer >= 4) {
        // this.resourcesEmmiter.next(this.resources);
        console.log(this.resources);
        this.rsSrv.emitResources(this.resources);
        clearInterval(interval);
      }
    }, 1000)

  }

  getCustomers(customers) {
    return Object.keys(customers).map(customersType => customers[customersType].map(item => { 
      return {customer: item['customer'], gallery: item['gallery']};
    }));
  }

  toArray(itemsArray) {
    return itemsArray.map(item => item);
  }

  checkConfirmedKey(item, key) {
    return (key in item) ? true : false;
  }

  mapItems(items) {
    let arr = {
      activeated: [],
      pending: []
    };
    //items = items['customers'] ? this.getCustomers(items['customers'])[0] : this.toArray(items);
    if(items['customers']){
      let customers = this.getCustomers(items['customers'])[0];
      arr['activeated'] = customers.filter(item => item['customer'].confirmed || !this.checkConfirmedKey(item['customer'], 'confirmed'))
      arr['pending'] = customers.filter(item => this.checkConfirmedKey(item['customer'], 'confirmed') && item['customer'].confirmed === false)
      // console.log(arr);
      
    }else{
      arr['activeated'] = items.filter(item => item.confirmed || !this.checkConfirmedKey(item, 'confirmed'));
      arr['pending'] = items.filter(item => this.checkConfirmedKey(item, 'confirmed') && item.confirmed === false);
    }
    // console.log(items);
    


    /* Object.keys(items).forEach(key => {
      items[key].forEach(item => {
        let ob = {
          id: item['customer'].id,
          user_id: item['customer'].user_id,
          name: item['customer'].contact,
          confirmed: item['customer'].confirmed,
          businessType: item['customer'].businessType,
          company: item['customer'].company,
          email: item['customer'].email,
          tel: item['customer'].tel,
          title: item['customer'].title,
          descriptions: item['customer'].descriptions,
          address: item['customer'].address,
          deals: item['customer'].deals,
        };
        item['customer'].confirmed? arr.activeated.push(ob): arr.pending.push(ob);
      });
    }); */
    return arr;
  }

  login(path){
    // console.log(loginTemplete);
    // this.loginTemp = true;
    this.http.requestUrl = location.pathname;
    this.http.intendedUri = "/dashboard";
    this.http.loginTo = "admin-login";

    this.router.navigate([path]);
  }

  logout(){
    this.http.logOut('admin-logout').subscribe(res => {
      // console.log(res);
    });
  }

  create(path){
    // console.log("create");
    console.log(location.pathname);
    this.http.requestUrl = location.pathname;
    this.router.navigate([path]);
  }

  ngOnDestroy() {
    this.usersSubsription.unsubscribe();
    this.customersSubsription.unsubscribe();
    this.articlesSubsription.unsubscribe();
    this.eventsSubsription.unsubscribe();
    this.routerSubscrition.unsubscribe();
  }
}
