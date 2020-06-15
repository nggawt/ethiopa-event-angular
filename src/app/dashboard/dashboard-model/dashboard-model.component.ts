import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
declare var $: any;

@Component({
  selector: 'dashboard-model',
  templateUrl: './dashboard-model.component.html',
  styleUrls: ['./dashboard-model.component.css']
})
export class DashboardModelComponent implements OnInit, AfterViewInit {

  @Input() modelProps: {
    id: string | boolean,
    modalSize: string,
    name: string,
    emailTo: string,
    title: string
  } = {
      id: false,
      modalSize: "modal-lg",
      name: "",
      emailTo: "",
      title: 'Dashboard'
    };

  constructor(private router: Router, private http: HttpService, private route: ActivatedRoute) { }

  ngOnInit() { }

  ngAfterViewInit() {

    let model = (typeof this.modelProps == "object") ? $('#' + this.modelProps.id).modal() :  false;
    let thiz = this;
    // console.log('model_id: ', this.modelProps.id , ' model: ', model);

    if (model) {
      $(document).on('hidden.bs.modal', model, function (e) {

        /// TODO EVENTS
        console.log("requestUrl: ", thiz.http.requestUrl, 'element: ', e.target, 'id: ', thiz.modelProps.id);
        if (thiz.modelProps && thiz.modelProps.id) {
          let url_back = localStorage.getItem('url_back');
          let url = thiz.http.requestUrl? thiz.http.requestUrl: url_back? url_back: '/dashboard';
          thiz.router.navigate([url]);
          // console.log(thiz.http.requestUrl);
          if ($(model).is(':hidden')) {
            thiz.http.requestUrl = false;
            localStorage.removeItem('url_back');
            $(document).off('hidden.bs.modal');
            return e.preventDefault()
          }
        }
      });
    }

  }
}
