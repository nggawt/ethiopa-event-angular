import { Component, OnInit } from '@angular/core';
import { ResourcesService } from '../../services/resources/resources.service';
import { HttpService } from 'src/app/services/http-service/http.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent implements OnInit {

  /*  msgs: {};
   @Output() messages: EventEmitter<{}> = new EventEmitter<{}>(); */
  msgsResources;

  pathName: string;

  sendingMail: Observable<{[key: string]: boolean} | boolean>;
  mailItems: {
    id:string | boolean, 
    url: string,
    modalSize: string, 
    nameTo: string | boolean, 
    emailTo: string | boolean, 
    title: string
  };

  constructor(private srv: ResourcesService, private http: HttpService) {
    // this.srv.initResources('messages', false);
  }

  ngOnInit() {

    this.srv.getResources('messages', false).then(msgs => {
      console.log(msgs);
      
      this.msgsResources = msgs? msgs: [];
      this.setPathName();
    });
  }

  setPathName(){
    let loc = window.location.pathname, locExploded = loc.split('/');
    this.pathName = locExploded[(locExploded.length - 1)];
  }

  newMail() {
    
    console.log("callled newMail()");
    this.mailItems = {
      id: 'new_mail',
      url: decodeURIComponent(location.pathname),
      modalSize: "modal-lg",
      nameTo: "",
      emailTo: "",
      title: 'שלח הודעה'
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
