import { Component, OnInit } from '@angular/core';
import { ResourcesService } from '../../services/resources/resources.service';
import { HttpService } from 'src/app/services/http-service/http.service';

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


  customerMessage: {
    id: string,
    nameTo: string | boolean,
    emailTo: string | boolean,
    modalSize: string,
    title: string
  } = {
      id: 'new_mail',
      modalSize: "modal-lg",
      nameTo: false,
      emailTo: false,
      title: 'שלח הודעה'
    };

  constructor(private srv: ResourcesService, private http: HttpService) {
    // this.srv.initResources('messages', false);
  }

  ngOnInit() {
    this.srv.getResources('messages', false).then(msgs => {
      this.msgsResources = msgs;
      this.setPathName();
    });

    
  }

  setPathName(){
    let loc = window.location.pathname,
        locExploded = loc.split('/');
    this.pathName = locExploded[(locExploded.length - 1)];
  }

  newMail() {
    console.log("callled newMail()");

    this.customerMessage = {
      id: 'new_mail',
      modalSize: "modal-lg",
      nameTo: "",
      emailTo: "",
      title: 'שלח הודעה'
    };
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
