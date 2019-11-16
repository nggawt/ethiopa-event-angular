import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service/http.service';
import { Admin } from 'src/app/types/admin-type';
import { Observable } from 'rxjs';
import { tap, map, first, takeWhile } from 'rxjs/operators';
import { filter } from 'minimatch';
declare var $: any;
@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.css', '../../../../styles/validate.css']
})
export class CreateRoleComponent implements OnInit {


  roles: FormGroup;
  admin$: Observable<Admin>
  user: Admin;
  selectedItems:{}[] = [];
  mdProps = {
    id: 'create_role',
    modalSize: "modal-lg",
    name: "",
    title: 'צור סמכות'
  };

  constructor(
    private http: HttpService) { }

  ngOnInit() {
    this.admin$ = this.http.userObs.pipe(tap(admin => {
      console.log(admin);
      if (admin) {
        this.user = admin;
        this.mdProps.name = admin.user.name;
        this.formInit();
      }

    }));
  }

  get f() { return this.roles.controls; }

  private formInit() {
    this.roles = new FormGroup({
      "name": new FormControl(null, [Validators.required, Validators.minLength(3), this.authRoleExisst.bind(this)]),
      'authority': new FormControl(null, [Validators.required, Validators.minLength(3)]),
      "allowed": new FormArray([], [Validators.required])
    });
  }

  authRoleExisst(control: FormControl) {
    let isExisst = false;
    this.user.roles.forEach(element => {
      element.name == control.value ? isExisst = true : '';
    });
    return isExisst ? { name: "authority is exisst" } : null;
  }

  newRole(roleAllowed) {

    if (!(roleAllowed.value in this.user.authority.permissions)) {

      this.user.authority.permissions[this.roles.controls.authority.value] = false;
    } else {
      console.log("exisst key: ", roleAllowed.value);
    }
  }

  getFormArray(){
    return (<FormArray>this.roles.get('allowed'));
  }

  findControl(itemKey:string, arr: FormArray){
    for (let item of arr.controls) {
      let  inObject = (itemKey in item.value);
      if (inObject) return item;
    }
    return false;
  }

  itemExisst(key: string, itemArr: FormArray | any[]){
    return (itemArr instanceof FormArray)? this.findControl(key, itemArr):itemArr.find(item => key in item);
  }

  onValueChanged(checkBox){
    let formArr = this.getFormArray(),
        arrControl = this.itemExisst(checkBox.value, formArr),
        arr = this.itemExisst(checkBox.value, this.selectedItems);

    if(arrControl) arrControl.get(checkBox.value).patchValue(checkBox.checked);
    if(arr) arr[checkBox.value] = checkBox.checked;
    console.log(arrControl, arr);
  }

  removeItem(checkBox, item, idx) {
    let formArr = this.getFormArray(),
        arrControl = this.itemExisst(checkBox.value, formArr),
        arr = this.itemExisst(checkBox.value, this.selectedItems);

    if(arrControl) formArr.removeAt(+ idx);
    if(arr) this.selectedItems.splice(+ idx, 1);
    console.log(formArr, this.selectedItems, item, idx);
  }

  addItem(checkBox) {
    console.log(checkBox);
    
    let isChecked = checkBox.checked,
        newControl = new FormGroup({ [checkBox.value]: new FormControl(isChecked) }),
        formArr = this.getFormArray();

    if (formArr.length) {
      let arrControl = this.itemExisst(checkBox.value, formArr);
      if(! arrControl){
        formArr.push(newControl);
        this.selectedItems.push({[checkBox.value]: isChecked});
      }else{
        let arr = this.itemExisst(checkBox.value, this.selectedItems);
        arr[checkBox.value] = checkBox.checked;
        arrControl.get(checkBox.value).patchValue(checkBox.checked);
      }
    } else {
      this.selectedItems.push({[checkBox.value]: isChecked});
      formArr.push(newControl);
    }
    console.log(formArr);
  }
  
  arrtoOb(itemsArrs: {}[]){
    let obj = {};
    itemsArrs.forEach(item => {
      let obKey = Object.keys(item)[0];
      obj[obKey] = item[obKey];
    });
    return obj;
  }

  onSubmit() {
    console.log(this.roles);
    // this.roles.controls.name.updateValueAndValidity();
    if (this.roles.valid) {
      /****** handel form inputs *****/
      let formInputes = this.roles.value;

      let newRole: { id?: number, name: string, slug: string, permissions: { [key: string]: boolean } } = {
        id: this.user.roles.length + 1,
        name: formInputes.name,
        slug: formInputes.name,
        permissions: this.arrtoOb(this.getFormArray().value)
      };
      // [...this.user.roles, ...[newRole]];
      // this.http.updateObservable('user', this.user);
      console.log(formInputes, newRole, this.user.roles);

      const theUrl = "roles";
      this.http.store(theUrl, newRole).
        subscribe(response => {
          console.log(response);
          this.roles.reset();
          this.getFormArray().controls = [];
          this.selectedItems = [];
          this.user.roles.push(newRole);
          this.roles.controls.name.updateValueAndValidity();

        }, (err) => console.log(err));
    } else {
      /* messages errors */
      // console.log(items['errors']);

    }
  }
}
