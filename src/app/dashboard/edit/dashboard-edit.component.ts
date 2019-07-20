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
  itemResource$: Observable<{}>;
  formGr: FormGroup;
  itemType:string;
  constructor(private srv: ResourcesService, private route: ActivatedRoute) { }

  ngOnInit() {

    // this.srv.initResources(['admins']);
    this.itemType = this.route.snapshot.data['itemType'];
   /*  console.log("submited");
    console.log(this.itemType );
    this.route.params.subscribe(routeId => {
      // console.log(routeId);
      this.itemResource$ = this.srv.findItem(+routeId.id, this.itemType).pipe(tap(item => console.log(item)));
      //this.itemForm$ = this.srv.findItem(+routeId.id, this.itemType).pipe(tap(item => item? this.itemForm(this.srv.checkTypeId(item)): ''));
    }); */
     let routeName = this.route.queryParams.subscribe(query => console.log(query));
     
    this.route.queryParamMap.subscribe((params:ParamMap) => {
      console.log("customer edit", params);
      // params = params.;
      //this.customerSubsripion =
      this.srv.getItemResource(this.itemType, +params.get('id'), params.get('name'), false)
        .then(customer => {
          console.log(customer);
          this.itemResource$ = of(customer);

        });
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
