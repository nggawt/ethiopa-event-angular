import { Component, OnInit, Input, AfterViewInit, OnChanges, AfterViewChecked, AfterContentChecked } from '@angular/core';
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

          thiz.http.requestUrl ? thiz.router.navigate([thiz.http.requestUrl]) :
            thiz.router.navigate(['/dashboard']);
          // console.log(thiz.http.requestUrl);
          if ($(model).is(':hidden')) {
            thiz.http.requestUrl = false;
            $(document).off('hidden.bs.modal');
            return e.preventDefault()
          }
        }
      });
    }

  }
}
