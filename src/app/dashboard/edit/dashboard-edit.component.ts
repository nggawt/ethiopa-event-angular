import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ResourcesService } from '../resources.service';
import { ActivatedRoute } from '@angular/router';
import { find, tap, map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard-edit',
  templateUrl: './dashboard-edit.component.html',
  styleUrls: ['./dashboard-edit.component.css']
})
export class DashboardEditComponent implements OnInit {
  itemForm$: Observable<{}>;
  formGr: FormGroup;
  itemType:string;
  constructor(private srv: ResourcesService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.itemType = this.route.snapshot.data['itemType'];
    console.log(this.itemType );
    this.route.params.subscribe(routeId => {
      console.log(routeId);
      this.itemForm$ = this.srv.findItem(+routeId.id, this.itemType).pipe(tap(item => item? this.itemForm(this.srv.checkTypeId(item)): ''));//item? this.itemForm(this.checkTypeId(item)): ''
    });
  }

  get f() : {} {
    return this.formGr.controls;
  }
  

  onSubmit(){
    console.log("submited");
  }

  itemForm(items){
    let formItems = {};
    Object.keys(items).forEach(item => {
      formItems[item] = new FormControl(items[item]);
    })
    this.formGr = new FormGroup(formItems);
    console.log(this.formGr);
  }
}
