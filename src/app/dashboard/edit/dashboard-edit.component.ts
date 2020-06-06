import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ResourcesService } from '../../services/resources/resources.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { find, tap, map, filter } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-dashboard-edit',
  templateUrl: './dashboard-edit.component.html',
  styleUrls: ['./dashboard-edit.component.css']
})
export class DashboardEditComponent implements OnInit {
  itemResource: {};
  itemType:string;
  constructor(private srv: ResourcesService, private route: ActivatedRoute) { }

  ngOnInit() {

    // this.srv.initResources(['admins']);
    let itemId = this.route.snapshot.paramMap.get('id');
    this.itemType = this.route.snapshot.data['itemType'];

    this.srv.getResources(this.itemType, false)
    .then(resource => {

      (this.itemType == 'customers')? this.route.queryParamMap.subscribe((params: ParamMap) => {
        let routeName = params.get('name');
        Array.isArray(resource[routeName])? this.setItemResource(resource[routeName], itemId): '';
      }): Array.isArray(resource)? this.setItemResource(resource, itemId): '';
    });
  }

  setItemResource(resource, itemId){
    let item = resource.find(item => this.srv.checkTypeId(item, 'customer').id == itemId);
    this.itemResource = item;
    console.log(item);
    
  }
}
