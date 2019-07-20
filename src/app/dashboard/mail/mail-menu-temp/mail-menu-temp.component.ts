import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ResourcesService } from 'src/app/services/resources/resources.service';

@Component({
  selector: 'app-mail-menu-temp',
  templateUrl: './mail-menu-temp.component.html',
  styleUrls: ['./mail-menu-temp.component.css']
})
export class MailMenuTempComponent implements OnInit {

  msgs: {};
  @Output() messages: EventEmitter<{}> = new EventEmitter<{}>();
  constructor(private srv: ResourcesService) { }

  ngOnInit() {
    
    this.srv.getResources('messages', false).then(msgs => {
      this.msgs = msgs;
      this.messages.emit(msgs);
    });
  }

}
