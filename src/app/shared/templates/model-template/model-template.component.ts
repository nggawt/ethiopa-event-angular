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
  
  constructor(private http: HttpService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() { }

  ngAfterViewInit() {

    let model = $('#'+ this.mailProps.id).modal();
    let thiz = this;
    console.log("model-template");

    $(document).on('hidden.bs.modal', model, function (e) {

      //console.log("element_id: ",thiz.mailProps.id, " requestUrl: ",  thiz.http.requestUrl, 'element: ', e.target);

      thiz.router.navigate([thiz.mailProps.url])
      
      if($(model).is(':hidden')){
        thiz.http.requestUrl = false;
        thiz.http.loginTo = false;
        $(document).off('hidden.bs.modal');
        thiz.http.sendingMail.next({[thiz.mailProps.id]: false});
        
        return e.preventDefault()
      } 
    });
    
  }
}
