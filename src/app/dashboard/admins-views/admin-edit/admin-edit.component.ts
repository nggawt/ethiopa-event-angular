import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { ResourcesService } from '../../../services/resources/resources.service';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http-service/http.service';
import { NgValidateSrvService } from 'src/app/services/validators/ng-validate-srv.service';
declare var $;

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.css', '../../../styles/validate.css']
})
export class AdminEditComponent implements OnInit {

  formGr: FormGroup;
  mdProps:{
    id: string,
    modalSize: string,
    name: string,
    message: boolean | string,
    title: string
  } = {
    id: 'edit_admin',
    modalSize: "modal-lg",
    name: "אדמין",
    message: false,
    title: 'ערוך אדמין'
  };
  @Input() itemData: {id: number, name: string, email: string, authority: {id: string, name: string, slug: string}};


  constructor(private srv: ResourcesService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpService,
    private ngVal: NgValidateSrvService) { }

  ngOnInit() {
    if (this.itemData) this.itemForm(this.itemData);
  }

  get f(): {} {
    return this.formGr.controls;
  }

  itemForm(items) {

    this.formGr = new FormGroup({
      authority: new FormControl(items.authority.name, [this.ngVal.unchange.bind(this, items.authority.name)]),
      name: new FormControl(items.name, [this.ngVal.unchange.bind(this, items.name)]),
      email: new FormControl(items.email, [this.ngVal.unchange.bind(this, items.email)])
    });
  }

  onSubmit() {

    console.log(this.formGr, this.itemData.id);
    let validItems = this.ngVal.getValidatedItems(this.formGr),
      validInputs = Object.keys(validItems.inputs).length ? validItems.inputs : false;
      validInputs ? this.send(validInputs, 'PUT') : console.log('Please fill valid form');
  }

  send(items: { [key: string]: string }, method: string): void {

    let url = 'admins/' + this.itemData.id + '?_method=' + method;
    this.http.postData(url, items).subscribe(response => {
      console.log('response: ', response);
      if(response['status']) this.update(items, response);
    });
  }

  update(items, response?){

    Object.keys(items).forEach(item => {
      this.itemData[item] = items[item];
    });

    this.mdProps.message = response.messages.success.update[0].update;// "אדמין עודכן בהצלחה"; //response.messages.success.update[0];
    setTimeout(() =>{
      $('#'+this.mdProps.id).click();
      this.mdProps.message = false;
    },2000)
  }
}
