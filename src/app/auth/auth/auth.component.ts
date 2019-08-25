import { Component, OnInit, ViewEncapsulation, ViewChild, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { HttpService } from '../../services/http-service/http.service';
import { Observable, of } from 'rxjs';
import { first, filter, tap, map, skipWhile } from 'rxjs/operators';
import { CustomersDataService } from '../../customers/customers-data-service';
import { User } from '../../types/user-type';
declare let $: any;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() params: {
    id: string,
    modelSize: string,
    title: string
  };

  constructor(private http: HttpService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() { }

  ngAfterViewInit(){

    let model = $('#'+ this.params.id).modal();
    let thiz = this;

    $(document).on('hidden.bs.modal', model, function (e) {
      /// TODO EVENTS
      console.log("element_id: ",thiz.params.id, " requestUrl: ",  thiz.http.requestUrl, 'element: ', e.target);
      thiz.http.requestUrl ? thiz.router.navigate([thiz.http.requestUrl]): 
                              thiz.router.navigate(['../'], { relativeTo: thiz.route });
      // console.log(thiz.http.requestUrl);
      if($(model).is(':hidden')){
        thiz.http.requestUrl = false;
        thiz.http.loginTo = false;
        if(thiz.params.id = "login") thiz.http.allowLogIn.next(false);
        $(document).off('hidden.bs.modal');
        return e.preventDefault()
      } 
    });

  }

  ngOnDestroy(){
    // console.log("component destroy");
    // this.http.requestUrl = false;
    
  }
}
