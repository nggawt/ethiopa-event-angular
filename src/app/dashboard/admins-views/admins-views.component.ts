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

  constructor(private rSrv: ResourcesService, private http: HttpService, private router:Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // let url = "http://ethio:8080/api/admins";
    this.initAdmins();
  }

  initAdmins(){
    // this.rSrv.initResources('admins');
    this.rSrv.getResources('admins', false).then(items => {
      this.admins = items;
    });
    
    // this.usersType$  = this.rSrv.resourcesObsever.pipe(first(item => typeof item == "object"));
  }

  getUserTypes(items){
    
    return { users: items['users'], customers: items['customers'] };
  }

  edit(path){
    // console.log("create");
    this.http.requestUrl = location.pathname;
    this.router.navigate([path]);
  }

  create(path){
    console.log(path);
    this.http.requestUrl = location.pathname;
    this.router.navigate([path]);
  }

  show(path){
    this.http.requestUrl = location.pathname;
    this.router.navigate([path]);
  }
}
