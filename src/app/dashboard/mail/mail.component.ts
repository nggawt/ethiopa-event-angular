import { Component, OnInit } from '@angular/core';
import { ResourcesService } from '../../services/resources/resources.service';
import { HttpService } from 'src/app/services/http-service/http.service';
import { Observable, Subscription } from 'rxjs';
import { Admin } from 'src/app/types/admin-type';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent implements OnInit {

  /*  msgs: {};
   @Output() messages: EventEmitter<{}> = new EventEmitter<{}>(); */
  msgsResources;
  admin: Admin;

  adminSubscription: Subscription;
  pathName: string;

  sendingMail: Observable<{[key: string]: boolean} | boolean>;

  mailItems: {
    id:string | boolean, 
    url: string,
    modalSize: string, 
    nameTo: string | boolean, 
    nameFrom: string | boolean, 
    emailTo: string | boolean, 
    title: string,
    inputs: {
      email_from: string | boolean,
      email_to: string | boolean,
      name: boolean,
      area: boolean,
      phone: boolean,
      city: boolean,
      subject: boolean,
      message: boolean
    }
  };

  constructor(private srv: ResourcesService, private http: HttpService) {
    // this.srv.initResources('messages', false);
  }

  ngOnInit() {

    this.adminSubscription = this.http.userObs.subscribe(admin => typeof admin == "object"? this.admin = admin: false);

    this.srv.getResources('messages', false).then(msgs => {
      console.log(msgs);
      
      this.msgsResources = msgs? msgs: [];
      this.setPathName();
    });
  }

  create(url:string){
    alert("need implementation");
  }

  setPathName(){
    let loc = window.location.pathname, locExploded = loc.split('/');
    this.pathName = locExploded[(locExploded.length - 1)];
  }

  newMail() {
    
    console.log("callled newMail()", 'user | admin : ', this.admin);
    if( ! this.admin) return false;
    let user = this.admin.user?this.admin.user: this.admin;

    this.mailItems = {
      id: 'new_mail',
      url: decodeURIComponent(location.pathname),
      modalSize: "modal-lg",
      nameTo: "whatever user",
      nameFrom: user['name'],
      emailTo: "",
      title: 'שלח הודעה',
      inputs: {
        email_from: user['email'],
        email_to: true,
        name: false,
        area: false,
        phone: false,
        city: false,
        subject: true,
        message: true
      }
    };
    this.http.sendingMail.next({['new_mail']: true});
    this.sendingMail = this.http.sendingMail;
  }

  get favoritesLen() {
    // console.log(this.msgsResources);
    return Array.prototype.filter.call(this.msgsResources, (item => item.favorites && item.deleted_at == null));
  }

  get getNonTrashed() {
    // console.log(this.msgsResources);
    return Array.prototype.filter.call(this.msgsResources, (item => item.deleted_at == null));
  }

  get getTrashed() {
    // console.log(this.msgsResources);
    return Array.prototype.filter.call(this.msgsResources, (item => item.deleted_at != null));
  }

}
