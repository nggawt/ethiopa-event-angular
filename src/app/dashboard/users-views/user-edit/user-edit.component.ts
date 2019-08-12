import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { ResourcesService } from '../../../services/resources/resources.service';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { NgValidateSrvService } from 'src/app/services/validators/ng-validate-srv.service';
import { HttpService } from 'src/app/services/http-service/http.service';
declare var $: any;

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css', '../../../styles/validate.css']
})
export class UserEditComponent implements OnInit {


  formGr: FormGroup;
  itemType: string;
  @Input() itemData: {id: number, name: string, email: string, tel: number, area: string; about: string, city: string };

  mdProps: {
    id: string,
    modalSize:string,
    name: string,
    message: string | boolean,
    title: string
  } = {
    id: 'create_user',
    modalSize: "modal-lg",
    name: "משתמש",
    message: false,
    title: 'ערוך משתמש'
  };
  constructor(private http: HttpService, private ngVal: NgValidateSrvService) { }

  ngOnInit() {

    if (this.itemData) this.itemForm(this.itemData);
  }

  get f(): {} {
    return this.formGr.controls;
  }

  itemForm(items) {
    this.formGr = new FormGroup({
      name: new FormControl(items.name, [this.ngVal.unchange.bind(this, items.name)]),
      email: new FormControl(items.email, [this.ngVal.unchange.bind(this, items.email)]),
      about: new FormControl(items.about, [this.ngVal.unchange.bind(this, items.about)]),
      tel: new FormControl(items.tel, [this.ngVal.unchange.bind(this, items.tel)]),
      area: new FormControl(items.area, [this.ngVal.unchange.bind(this, items.area)]),
      city: new FormControl(items.city, [this.ngVal.unchange.bind(this, items.city)]),
    });
  }

  onSubmit() {
    console.log(this.formGr, this.itemData.id);
    let validItems = this.ngVal.getValidatedItems(this.formGr),
      validInputs = Object.keys(validItems.inputs).length ? validItems.inputs : false;
      validInputs ? this.send(validInputs, 'PUT') : console.log('Please fill valid form');
  }

  send(items: { [key: string]: string }, method: string): void {

    let url = 'users/' + this.itemData.id + '?_method=' + method;
    this.http.postData(url, items).subscribe(response => {
      console.log('response: ', response);
      if (response['status']) this.update(items, response);
    });
  }

  update(items, response?) {

    Object.keys(items).forEach(item => {
      this.itemData[item] = items[item];
    });

    this.mdProps.message = "משתמש עודכן בהצלחה";// "אדמין עודכן בהצלחה"; //response.messages.success.update[0];
    setTimeout(() => {
      $('#' + this.mdProps.id).click();
      this.mdProps.message = false;
    }, 3000)
  }

  posElem(elem) {
    elem.style.height = '0px'; //Reset height, so that it not only grows but also shrinks
    elem.style.height = (elem.scrollHeight + 10) + 'px';
    
    // elem.setSelectionRange(0, 0);
    // elem.focus();
  }
}
