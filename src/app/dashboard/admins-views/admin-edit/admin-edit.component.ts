import { Component, OnInit, Input } from '@angular/core';
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
  
  formGr: FormGroup;
  mdProps = {
    id: 'edit_admin',
    modalSize: "modal-lg",
    name: "אדמין",
    emailTo: "",
    title: 'ערוך אדמין'
  };
  @Input() itemData: {};
  
  constructor(private srv: ResourcesService, private router: Router, private route: ActivatedRoute, private http: HttpService) { }

  ngOnInit() {
    if(this.itemData) this.itemForm(this.itemData);
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

    
  }
  
  back(){
    $('#'+this.mdProps.id).click();
  }
}
