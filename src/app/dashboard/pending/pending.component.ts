import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { ResourcesService } from 'src/app/services/resources/resources.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.css']
})
export class PendingComponent implements OnInit, OnChanges {

  @Input() itemsLists;
  
  constructor(private http: HttpService, private rsrv: ResourcesService) { }

  ngOnInit() { }

  ngOnChanges(){ this.reConfig(); }

  reConfig(){

    let conf = {
      config: {
        currentPage: 1,
        id: "pending",
        itemsPerPage: 3,
        totalItems: this.itemsLists.pending.length
      },
      count: this.itemsLists.pending.length,
      pending: this.itemsLists.pending,
      resName: this.itemsLists.resName,
    };
    // this.rsrv.forbidden.pipe(first()).subscribe(items => {
    // console.log(items, this.itemsLists.pending);
    // conf.pending = Array.isArray(items) && items.length? conf.pending.map(pend => pend['forbidden'] = items.find(forbidden => forbidden['user_id'] == pend.user_id)? true:false): conf.pending;
    // });
    this.rsrv.getResources('forbidden', false).then(items => {
      console.log(items);
      conf.pending = items? this.itemsLists.pending.map(pend => this.setForbidden(pend, items, conf.resName)): [];
    });
    this.itemsLists = Object.assign({}, conf);
  }

  protected setForbidden(pending, forbiddens, resName){
    let response = resName == "customers"? pending.customer: pending;
    response['forbidden'] = forbiddens.find(forbidden => forbidden.user_id == response.user_id)? true: false;
    return response;
  }
  
  forbidden(items){

    let isForbidden = items.forbidden,
        resName = this.itemsLists.resName,
        method = isForbidden? '/open': '/lock',
        url = "banntrash/"+items.id+ method;

    let data = {
      banned_until: isForbidden? null: this.bannedUntil(),
      email: items.email,
      id: items.id, 
      user_id: items.user_id, 
      model: resName.slice(0, (resName.length - 1))
    };

    console.log("url ", url, " items to send: ", data, " item to update: ", items);
    this.http.postData(url, data).subscribe(response =>{
      console.log('response: ', response);
      // this.rsrv.update(resName, items); 
      if(response['status']){
        items.forbidden = ! items.forbidden;
        let res = isForbidden? response['user']: response['forbidden'];
        this.rsrv.forbiddenUser('users', res, isForbidden); 
      }
    });
  }

  bannedUntil(){
    let date = new Date();
    let nextTwoWeeks = new Date(date.setDate(date.getDate() + 14)),
        dt = nextTwoWeeks.getFullYear()+"-"+nextTwoWeeks.getMonth()+"-"+nextTwoWeeks.getDate()+" "+
        nextTwoWeeks.getHours()+":"+nextTwoWeeks.getMinutes()+":"+nextTwoWeeks.getSeconds();

    return dt;
  }

  confirmed(itemReq){
    console.log(itemReq, this.itemsLists);

    
    let resName = this.itemsLists.resName;
    let url = resName+"/"+itemReq.id+"?_method=PATCH";
    let data = resName == "customers"? {formInputs: { confirmed: true }}: { confirmed: true };
 
    this.http.postData(url, data).subscribe(response =>{
      console.log('response: ', response, this.itemsLists);
      itemReq.confirmed = true;
      this.rsrv.update(resName, itemReq); 
    });
  }

  destroy(items){
    console.log(items);
    let url = this.itemsLists.resName+"/"+items.id+"? _method=DELETE";
    this.http.postData(url, null).subscribe(response => {
      console.log(response);
    });
  }

}
