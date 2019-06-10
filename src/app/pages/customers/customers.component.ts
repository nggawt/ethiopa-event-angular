import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RoutesRecognized, ActivatedRoute, Data } from '@angular/router';
import { map, filter, tap } from 'rxjs/operators';
import { CustomersDataService } from '../../customers/customers-data-service';
import { HallType } from '../../customers/hall-type';
import { Observable, of } from 'rxjs';
declare var $;
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
  providers:[]
})

export class CustomersComponent implements OnInit, OnDestroy {

  
  path: boolean = true;
  showPath:boolean;
  urlUnsubscribe: any;
  hallsProps: Observable<HallType[]> | boolean;
  customerMessage: {};
  
  private address:string;

  private allawAddress = [
    'halls-events','salons', 'app/salons', 'app/halls-events', "hotels", "app/hotels", "photographers", 
    "app/photographers", "djs", "app/djs", , "kyses", "app/kyses", , "car-rents", "app/car-rents",
    "transports", "app/transports", , "printing", "app/printing", , "fireworks", "app/fireworks"
  ];

  constructor(private router: Router, private route: ActivatedRoute,private halls: CustomersDataService ) {}

  ngOnInit() {

    // let urSnapShut = this.route.snapshot.params['customers'];
    let urSnapShut = (this.router.url.indexOf('customers') >= 0)? decodeURIComponent(this.router.url).split('customers/')[1] : this.router.url;
        
    let urlExist = this.allawAddress.indexOf(urSnapShut) >= 0;
    

      this.urlUnsubscribe = this.router.events.pipe(
        filter((evt) => evt instanceof RoutesRecognized),
        map(_evt => decodeURIComponent(_evt["url"]).slice(1)),).subscribe(evt => {
          
          urSnapShut = (evt.indexOf('customers') >= 0)?  evt.split('customers/')[1]: evt;
          urlExist = this.allawAddress.indexOf(urSnapShut) >= 0;

          if(urlExist){
            this.getCustomerResources(urSnapShut);
          }else{
            (urSnapShut != 'join')? this.path = false: this.path = true;
          }
      });
      this.getCustomerResources(urSnapShut);
  }

  contactModel(paramCustomer){
    console.log(paramCustomer);
    this.customerMessage = paramCustomer;
    $('#customerMsgs').modal();
  }

  private getCustomerResources(url){

    let splitedUrl = (url.indexOf('/') >= 0)? url.split('/'): url;
    let mailResourceUrl = (typeof splitedUrl == "object" && splitedUrl.length >= 2)? splitedUrl[0]: splitedUrl;
      console.log(splitedUrl);
      
    if(this.allawAddress.indexOf(url) >= 0){
    
      this.route.data.subscribe(data => {

        let addr = this.allawAddress.find(item => {return item == url;});
        this.address = addr;
        console.log(data);
        console.log(addr);
        
        this.hallsProps = data && data['customers'] && data['customers'][addr]? of(data['customers'][addr]):false;
        
        this.path = this.hallsProps ? true: this.timesNavigated();
     });
    }else{
      this.path = false;
      ! (this.allawAddress.indexOf(mailResourceUrl) >= 0)? this.timesNavigated('errors-page'):"";
    }
  }

  private timesNavigated(link?){
    link = link? link: '/';
    setTimeout(()=>{
      this.router.navigate([link]);
    }, 100);
    return false;
  }

  onSelectedLink(customer:HallType){
    //this.halls.costumerEmit(customer);
  }

  ngOnDestroy() {
    this.urlUnsubscribe? this.urlUnsubscribe.unsubscribe(): "";
  }

}
