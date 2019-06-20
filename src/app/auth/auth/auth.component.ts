import { Component, OnInit, ViewEncapsulation, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { HttpService } from '../../services/http-service/http.service';
import { Observable, of } from 'rxjs';
import { first, filter, tap, map, skipWhile } from 'rxjs/operators';
import { CustomersDataService } from '../../customers/customers-data-service';
import { User } from '../../types/user-type';
declare let $:any;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {


  constructor() {}

  ngOnInit() {
   
  }
}
