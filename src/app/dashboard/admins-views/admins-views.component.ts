import { Component, OnInit } from '@angular/core';
import { ResourcesService } from '../../services/resources/resources.service';
import { Observable, of } from 'rxjs';
import { map, tap, filter, first } from 'rxjs/operators';
import { HttpService } from '../../services/http-service/http.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admins-views',
  templateUrl: './admins-views.component.html',
  styleUrls: ['./admins-views.component.css']
})
export class AdminsViewsComponent implements OnInit {

  admins: {};
  loginTemp: boolean;

  constructor(private srv: ResourcesService, private http: HttpService, private router:Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // let url = "http://ethio:8080/api/admins";
    this.initAdmins();
  }

  initAdmins(){
    // this.srv.initResources('admins');
    this.srv.getResources('admins', false).then(items => {
      this.admins = items;
    });
    
    // this.usersType$  = this.srv.resourcesObsever.pipe(first(item => typeof item == "object"));
  }

  getUserTypes(items){
    
    return { users: items['users'], customers: items['customers'] };
  }

  edit(path){
    this.http.requestUrl = location.pathname;
    console.log(this.http.requestUrl);
    this.router.navigate([path]);
  }

  create(path){
    this.http.requestUrl = location.pathname;
    console.log(this.http.requestUrl);
    this.router.navigate([path]);
  }

  show(path){
    this.http.requestUrl = location.pathname;
    this.router.navigate([path]);
  }

  destroy(path:string, items: any):void{
    console.log('path: ', path);

    let url = path+'/'+ items.id+'?_method=delete';
    this.http.postData(url, items).subscribe(response =>{
      console.log('response: ', response);
    });
  }
}
