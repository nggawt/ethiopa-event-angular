import { Component, OnInit } from '@angular/core';
import { ResourcesService } from '../../services/resources/resources.service';
import { HttpService } from '../../services/http-service/http.service';
import { Router, ActivatedRoute } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-admins-views',
  templateUrl: './admins-views.component.html',
  styleUrls: ['./admins-views.component.css']
})
export class AdminsViewsComponent implements OnInit {

  admins: {};
  allowSubmitButton:{} = {};
  loginTemp: boolean;

  constructor(private srv: ResourcesService, private http: HttpService, private router:Router, private route: ActivatedRoute) { }

  
  ngOnInit() {
    // let url = "http://lara.test/api/admins";
      this.initAdmins();
  }

  initAdmins(){
    // this.srv.initResources('admins');
    this.srv.getResources('admins', false).then(items => {
      console.log(items);
      this.admins = items;
    });
    
  }

  edit(path){
    this.http.requestUrl = location.pathname;
    console.log(this.http.requestUrl);
    this.router.navigate([path]);
  }

  create(path){
    this.http.requestUrl = location.pathname;
    console.log(this.http.requestUrl);
    this.router.navigate([path]);
  }

  show(path){
    this.http.requestUrl = location.pathname;
    this.router.navigate([path]);
  }

  allowSubmit($event, key, admin){
    console.log($event.target.value, admin);
    this.allowSubmitButton[key] = $event.target.value != admin.authority.id;
  }

  makeAdmin(id, admin){
    let selected = $("#"+id)[0];
    let adminProp = {authority: selected.value, id: admin.user?.id};
    console.log(selected.value, admin, adminProp);
    this.send(adminProp, 'PATCH');
  }

  send(items: { [key: string]: string }, method: string): void {

    let url = 'admins/' + items.id + '?_method=' + method;
    this.http.postData(url, items).subscribe(response => {
      console.log('response: ', response);
      // if(response['status']) this.update(items, response);
    });
  }

  destroy(path:string, items: any):void{
    console.log('path: ', path);

    let url = path+'/'+ items.id+'?_method=delete';
    this.http.postData(url, items).subscribe(response =>{
      console.log('response: ', response);
    });
  }
}
