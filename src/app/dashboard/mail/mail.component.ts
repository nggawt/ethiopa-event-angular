import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ResourcesService } from '../../services/resources/resources.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent implements OnInit {

 /*  msgs: {};
  @Output() messages: EventEmitter<{}> = new EventEmitter<{}>(); */
  constructor(private srv: ResourcesService) { }

  ngOnInit() {
    /* this.srv.getResources('messages', false).then(msgs => {
      this.msgs = msgs;
      this.messages.emit(msgs);
    }); */
  }
}
