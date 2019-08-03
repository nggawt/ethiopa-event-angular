import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { ResourcesService } from '../../../services/resources/resources.service';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

 
  formGr: FormGroup;
  itemType:string;
  @Input() itemData: {};

  constructor(private srv: ResourcesService, private route: ActivatedRoute) { }

  ngOnInit() {
    
    if(this.itemData) this.itemForm(this.itemData);
  }

  get f() : {} {
    return this.formGr.controls;
  }
  

  onSubmit(){
    console.log(this.formGr.valid);
  }

  itemForm(items){
    let formItems = {};
    console.log(items);
    
    Object.keys(items).forEach(item => {
      formItems[item] = new FormControl(items[item]);
    })
    this.formGr = new FormGroup(formItems);
    console.log(this.formGr);
  }
}
