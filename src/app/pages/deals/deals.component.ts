import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { ResourcesService } from 'src/app/services/resources/resources.service';

@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.css']
})
export class DealsComponent implements OnInit {

  customers: {};

  constructor(private http: HttpService,
    private rsrv: ResourcesService) { }


  ngOnInit() {

    this.rsrv.getResources('customers', false).then(customers => {
      this.customers = customers;
      console.log(customers);
      
    });
  }

}
