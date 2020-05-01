import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../services/http-service/http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, Observable } from 'rxjs';
import { CustomersDataService } from '../../../../customers/customers-data-service';
import { find, first } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['../../../../styles/style.component.css']
})
export class CustomerEditComponent implements OnInit {

  isTrue: Observable<boolean>;
  private user;
  constructor(private http: HttpService, private router: Router, private route: ActivatedRoute, private halls: CustomersDataService) { }

  ngOnInit() {
    console.log("customer edit called");
    
    this.halls.customerObsever.pipe(find((val) =>  val && val['customer'] && val['customer']['id']))
    .subscribe(
      (cost) => {
        let co = cost['customer'];
        let cId = (co && co["user_id"]) ? co["user_id"] : false;
        // let uId = this.http.authUser["id"];
        let userId = this.http.authUser;
        let uId = userId? userId['id']: false;

        // console.log('costumerId: '+ cId + " userId "+ uId, ' customer: ', co);
        if(cId === uId || (userId && userId['authority']?.name == "Admin")){
          this.isTrue = of(true);
          this.user = userId;
        }else{
          this.isTrue = of(false);
          // let state = decodeURIComponent(this.router.url).split("/");
          // let media = "/"+state[1]+"/"+cost["company"]+"/media";
          // console.log(media);
          // this.router.navigate([media]);
    }});

    /* let query = this.route.queryParams.forEach(param => {
      console.log(param);
      
    }); */
  }
  destroy(){
    console.log("destroy()");
    
  }
  
}
