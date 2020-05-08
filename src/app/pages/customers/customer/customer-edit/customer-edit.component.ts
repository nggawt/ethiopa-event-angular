import { Component, OnInit } from '@angular/core'; 
import { of, Observable } from 'rxjs';
import { CustomersDataService } from '../../../../customers/customers-data-service';
import { find } from 'rxjs/operators';
import { AuthService } from 'src/app/services/http-service/auth.service';


@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['../../../../styles/style.component.css']
})
export class CustomerEditComponent implements OnInit {

  isTrue: Observable<boolean>;
  protected user;
  constructor(private halls: CustomersDataService,
    private auth: AuthService) { }

  ngOnInit() {
    console.log("customer edit called");
    
    this.halls.customerObsever.pipe(find((val) =>  val && val['customer'] && val['customer']['id']))
    .subscribe(
      (cost) => {
        let co = cost['customer'];
        let cId = (co && co["user_id"]) ? co["user_id"] : false;
        // let uId = this.auth.authUser["id"];
        let userId = this.auth.authUser;
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
