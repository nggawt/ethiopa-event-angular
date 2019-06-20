import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ResourcesService } from '../resources.service';
import { ActivatedRoute } from '@angular/router';
import { find, tap, map, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {
  itemResource$: Observable<{}>;
  formGr: FormGroup;
  itemType:string;
  constructor(private srv: ResourcesService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.srv.initResources(['admins']);
    this.itemType = this.route.snapshot.data['itemType'];
    // console.log(this.itemType );
    this.route.params.subscribe(routeId => {
      // console.log(routeId);
      this.itemResource$ = this.srv.findItem(+routeId.id, this.itemType);
      //this.itemForm$ = this.srv.findItem(+routeId.id, this.itemType).pipe(tap(item => item? this.itemForm(this.srv.checkTypeId(item)): ''));
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
