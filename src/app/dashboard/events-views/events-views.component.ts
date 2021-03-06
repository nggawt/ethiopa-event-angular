import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { ResourcesService } from '../../services/resources/resources.service';
import { FormGroup, FormControl } from '@angular/forms';
import { tap, map } from 'rxjs/operators';
declare var $;

@Component({
  selector: 'app-events-views',
  templateUrl: './events-views.component.html',
  styleUrls: ['./events-views.component.css']
})
export class EventsViewsComponent implements OnInit {

  itemsResources$:{};
  formGr: FormGroup;
  @ViewChild('default', {static: true}) tempType: TemplateRef<any>;
  @ViewChild('tableEvents', {static: true}) tableEvents: TemplateRef<any>;

  savedId:{prevElemId: string | boolean} = {['prevElemId']:false};
  
  constructor(private http: HttpService, private rsrv: ResourcesService) { }

  ngOnInit() {
    this.itemsResources$ = this.rsrv.events.pipe(map(item => this.rsrv.pagination(item, 'events')),tap(item => console.log(item)));
    this.tempType =  this.tableEvents;
  }
  
  get f() : {} {
    return this.formGr.controls;
  }
  
  initForm(customer, temp){
    this.tempType =  temp;
    if(customer) this.customersForm(customer);
  }

  onSubmit(){
    console.log("submited");
  }

  customersForm(items){
    let formItems = {};
    Object.keys(items).forEach(item => {
      formItems[item] = new FormControl(items[item]);
    })
    this.formGr = new FormGroup(formItems);
    console.log(this.formGr);
  }

  editIem(textArea){
    console.log(textArea);
    let elem = $('#'+textArea)[0];
    // console.log(elem);
    elem.style.whiteSpace ="normal";

    let storageId = this.savedId['prevElemId'];
    
    if(storageId && storageId != textArea){
      let storgeElem = $('#'+storageId)[0];
      if(storgeElem) this.shrinkElem(storgeElem);
      this.savedId['prevElemId'] = false;
      
    }
    // this.attachEvents(storageId, elem);
    (elem.classList.contains('position-absolute'))? this.shrinkElem(elem):this.extendElem(elem, textArea);
    
  }

  shrinkElem(elem){
    elem.classList.remove('position-absolute');
    elem.style.width ="inherit";
    elem.style.zIndex ="0";
    elem.style.height = (50)+'px';  
    elem.rows = "3";
    elem.classList.remove('show');
    elem.classList.add('hide');
    // console.log("shrink")
    // elem.setSelectionRange(0, 0);
    // elem.focus();
    this.savedId['prevElemId'] = false;
  }

  extendElem(elem, id){
    elem.classList.add('position-absolute');
    elem.classList.add('show');
    elem.classList.remove('hide');
    elem.style.width ="50%";
    elem.style.zIndex ="99";
    elem.style.height = '0px';     //Reset height, so that it not only grows but also shrinks
    elem.style.height = (elem.scrollHeight+10) + 'px'; 
    this.savedId['prevElemId'] = id;
        // this.attachEvents(elem)
    elem.setSelectionRange(0, 0);
    elem.focus();
  }

  attachEvents(strId, currentElem){
    let storgeElem = $('#'+strId)[0];
    $(document).on("click", (e) => {  
      if(e.target.id == storgeElem.id){
        e.stopPropagation();
        // this.savedId['prevElemId'] = storgeElem.id;
        // storgeElem.removeEventListener('click', this.editIem);
        return false;  
      } 
      console.log(strId, currentElem.id);
      console.log("called");
      console.log("called");
      
      if(this.savedId['prevElemId'] && storgeElem.id != currentElem.id) {
        // let storgeElem = $('#'+this.savedId['prevElemId'])[0];
        this.shrinkElem(storgeElem); //hide the button
        // this.savedId['prevElemId'] = false;
        // document.removeEventListener('click', this.editIem);
      }
    });

    // $("#search_form").on("focus",() => {
    //   $(ul).show();
    // });
  }

  confirmed(item){
  
    let url = "events/"+item.id+"?_method=PATCH";
    let requestItems = { confirmed: ! item.confirmed };

    console.log("url ", url, " item ", item, " items: ", requestItems);
    this.http.postData(url, requestItems).subscribe(response =>{
      console.log('response: ', response);
      item.confirmed = ! item.confirmed;
      this.rsrv.update('events', item); 
    });
    
  }

  

  destroy(items){
    
    let url = "events/"+items.id+"? _method=DELETE";
    this.http.postData(url, null).subscribe(response => {
      console.log(response);
    });
  }
}
