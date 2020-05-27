import { Component, OnInit, Input, TemplateRef, ViewChild, OnChanges } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { ResourcesService } from '../../services/resources/resources.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { tap, map, first, filter } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service/auth.service';

declare var $;

@Component({
  selector: 'app-users-views',
  templateUrl: './users-views.component.html',
  styleUrls: ['./users-views.component.css']
})

export class UsersViewsComponent implements OnInit, OnChanges {
  itemsResources$:Observable<{}>;
  formGr: FormGroup;
  @ViewChild('default', {static: true}) tempType: TemplateRef<any>;
  @ViewChild('tableusers', {static: true}) tableusers: TemplateRef<any>;

  savedId:{prevElemId: string | boolean} = {['prevElemId']:false};
  
  constructor(private http: HttpService, 
              private rsrv: ResourcesService, 
              private router: Router,
              private auth: AuthService) { }

  ngOnInit() {
    // this.rsrv.getResources('users', true).then(users => {
    //   console.log(users);
    //   let dataUsers = this.rsrv.pagination(users, 'users');
    //   this.itemsResources$ = of(dataUsers);
    // });
    // this.rsrv.dataTransform('users');
    this.itemsResources$ = this.rsrv.users.pipe(filter(item => typeof item == "object"), 
    map(items => this.rsrv.dataTransform('users', items)),map(items => this.rsrv.pagination(items, 'users')),tap(item => console.log(item)));
    this.tempType =  this.tableusers;
  }

  ngOnChanges(){
    console.log("users onChange called!");
    
    this.rsrv.dataTransform('users');
  }

  get f() : {} {
    return this.formGr.controls;
  }

  create(path){
    this.http.requestUrl = location.pathname;
    this.router.navigate([path]);
  }

  edit(path){
    this.http.requestUrl = location.pathname;
    this.router.navigate([path]);
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
  }

  bannedUntil(){
    let date = new Date();
    let nextTwoWeeks = new Date(date.setDate(date.getDate() + 14)),
        dt = nextTwoWeeks.getFullYear()+"-"+nextTwoWeeks.getMonth()+"-"+nextTwoWeeks.getDate()+" "+
        nextTwoWeeks.getHours()+":"+nextTwoWeeks.getMinutes()+":"+nextTwoWeeks.getSeconds();

    return dt;
  }

  forbidden(items){

    let isForbidden = items.forbidden,
        method = isForbidden? '/open': '/lock',
        url = "banntrash/"+items.id+method;

    let data = {
      banned_until: isForbidden? null: this.bannedUntil(),
      email: items.email,
      id: items.id,
      model: 'user'
    };

    console.log("url ", url, " items: ", data);
    this.http.postData(url, data, this.auth.getToken()).subscribe(response =>{
      console.log('response: ', response);
      items.forbidden = ! items.forbidden;
      let res = isForbidden? response['user']: response['forbidden'];
      
      this.rsrv.forbiddenUser('users', res, isForbidden); 
    });
  }

  destroy(items){
    
    let url = "users/"+items.id+"? _method=DELETE";
    this.http.postData(url, null).subscribe(response => {
      console.log(response);
    });
  }
}
