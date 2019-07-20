import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { ResourcesService } from '../../services/resources/resources.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
declare var $;

@Component({
  selector: 'customers-views',
  templateUrl: './customers-views.component.html',
  styleUrls: ['./customers-views.component.css']
})
export class CustomersViewsComponent implements OnInit {
  itemsResources$:Observable<{}>;
  // formGr: FormGroup;
  @ViewChild('default', {static: true}) tempType: TemplateRef<any>;
  @ViewChild('tableCustomers', {static: true}) tableCustomers: TemplateRef<any>;

  savedId:{prevElemId: string | boolean} = {['prevElemId']:false};
  
  constructor(private http: HttpService, private resSrv: ResourcesService, private router: Router) { }

  ngOnInit() {

    this.itemsResources$ = this.resSrv.resourcesObsever.pipe(tap(item => console.log(item)));
    this.tempType =  this.tableCustomers;
  }
  
  destroy(items){
    
    let url = "customers/"+items.id+"? _method=DELETE";
    this.http.postData(url, null).subscribe(response => {
      console.log(response);
    });
  }
  goTo(url, param){
    console.log(url, param);
    
    this.router.navigate([url], { queryParams: { name: param} });
  }
  
}
