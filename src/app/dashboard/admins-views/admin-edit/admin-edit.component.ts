import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { ResourcesService } from '../../../services/resources/resources.service';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http-service/http.service';
declare var $;

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.css']
})
export class AdminEditComponent implements OnInit {
  
  itemForm$: Observable<{}>;
  formGr: FormGroup;
  itemType:string;
  constructor(private srv: ResourcesService, private router: Router, private route: ActivatedRoute, private http: HttpService) { }

  ngOnInit() {

    this.srv.initResources(['admins']);
    this.itemType = this.route.snapshot.data['itemType'];

    this.route.params.subscribe(routeId => {
      this.itemForm$ = this.srv.findItem(+routeId.id, "admins").pipe(tap(item => item? this.itemForm(this.srv.checkTypeId(item, 'customer')): ''));//item? this.itemForm(this.checkTypeId(item)): ''
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

    $('#forgotPassword').modal();
    let thiz = this;
    $(document).on('hidden.bs.modal','.modal', function () {
      /// TODO EVENTS
      thiz.http.requestUrl? thiz.router.navigate([thiz.http.requestUrl]): thiz.router.navigate(['/dashboard/admins-views'], {relativeTo: this.route});
    });
  }
  back(){
    $('#forgotPassword').click();
  }
}
