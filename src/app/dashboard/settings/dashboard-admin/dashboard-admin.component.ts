import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/app/services/http-service/http.service';
import { Router } from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { HelpersService } from 'src/app/services/helpers/helpers.service';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {

  admin$: Observable<{}>;
  constructor(private http: HttpService, private router: Router, private helper: HelpersService) { }

  ngOnInit() {
    this.admin$ = this.http.userObs.pipe(filter(admin => typeof admin == "object"));
  }

}
