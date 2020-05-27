import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpService } from '../../services/http-service/http.service';
import { AuthService } from 'src/app/services/auth-service/auth.service';
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

  constructor(private http: HttpService, 
    private auth: AuthService) { }

  ngOnInit() { }

  ngAfterViewInit() {

    if (this.params) {

      let model = $('#' + this.params.id).modal(), thiz = this;

      $(document).on('hidden.bs.modal', model, function (e) {
        /// TODO EVENTS
        console.log("element_id: ", thiz.params.id, " requestUrl: ", thiz.http.requestUrl, 'intended: ', thiz.http.intendedUri);
        
        thiz.http.redirect();

        // console.log(thiz.http.requestUrl);
        if ($(model).is(':hidden')) {
          // thiz.http.requestUrl = false;
          // thiz.http.loginTo = false;
          if (thiz.params.id = "login") thiz.auth.allowLogIn.next(false);
          // this.params = false;
          $(document).off('hidden.bs.modal');
          // thiz.http.sendingMail.next({[thiz.mailProps.id]: false});
          return e.preventDefault()
        }
      });
    } else { 
      console.warn("auth component: 'this.params' not set ")
    }

  }

  ngOnDestroy() {
    // console.log("component destroy");
    // this.http.requestUrl = false;

  }
}
