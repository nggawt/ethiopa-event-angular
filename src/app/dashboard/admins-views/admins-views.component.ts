import { Component, OnInit } from '@angular/core';
import { ResourcesService } from '../resources.service';
import { Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';
import { HttpService } from '../../services/http-service/http.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admins-views',
  templateUrl: './admins-views.component.html',
  styleUrls: ['./admins-views.component.css']
})
export class AdminsViewsComponent implements OnInit {

  usersType$: Observable<{}>;
  loginTemp: boolean;

  constructor(private rSrv: ResourcesService, private http: HttpService, private router:Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.usersType$ = this.rSrv.resourcesObsever.pipe(filter(items => typeof items == "object"), map(items => this.getUserTypes(items)),tap(items => console.log(items)));
  }

  getUserTypes(items){
    
    return { users: items['users'], customers: items['customers'] };
  }

  
}
