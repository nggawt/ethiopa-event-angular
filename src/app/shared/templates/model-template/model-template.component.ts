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
    nameTo: string | boolean,
    emailTo: string | boolean,
    modelSize: string,
    title: string
  };
  // {id:'contact_customer', nameTo: paramCustomer.company, emailTo: paramCustomer.email};
  constructor(private http: HttpService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    // $('#forgotPassword').modal();
  }

  ngAfterViewInit() {

    
  }
}
