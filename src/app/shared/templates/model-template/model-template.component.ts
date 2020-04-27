import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;

@Component({
  selector: 'model-template',
  templateUrl: './model-template.component.html',
  styleUrls: ['./model-template.component.css']
})
export class ModelTemplateComponent implements OnInit, AfterViewInit {
  @Input() mailProps: {
    id: string,
    url: string,
    nameTo: string | boolean,
    emailTo: string | boolean,
    modelSize: string,
    title: string
  };
  // {id:'contact_customer', nameTo: paramCustomer.company, emailTo: paramCustomer.email};
  constructor(private http: HttpService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // $('#forgotPassword').modal();
    console.log(this.mailProps);
    
  }

  ngAfterViewInit() {

    let model = $('#'+ this.mailProps.id).modal();
    let thiz = this;

    $(document).on('hidden.bs.modal', model, function (e) {
      /// TODO EVENTS
      console.log("element_id: ",thiz.mailProps.id, " requestUrl: ",  thiz.http.requestUrl, 'element: ', e.target);
      // thiz.http.requestUrl ? thiz.router.navigate([thiz.http.requestUrl]): 
      //                         thiz.router.navigate(['../'], { relativeTo: thiz.route });
      thiz.router.navigate([thiz.mailProps.url])
      // console.log(thiz.http.requestUrl);
      if($(model).is(':hidden')){
        thiz.http.requestUrl = false;
        thiz.http.loginTo = false;
        $(document).off('hidden.bs.modal');
        thiz.http.sendingMail.next({[thiz.mailProps.id]: false});
        console.log("finished");
        
        return e.preventDefault()
      } 
    });
    
  }
}
