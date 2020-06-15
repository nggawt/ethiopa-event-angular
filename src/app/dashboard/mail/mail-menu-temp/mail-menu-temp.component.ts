import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mail-menu-temp',
  templateUrl: './mail-menu-temp.component.html',
  styleUrls: ['./mail-menu-temp.component.css']
})

export class MailMenuTempComponent implements OnInit, OnDestroy {
  
  @Input() message: {};
  @Input() idx: number;

  private replayRequet: Subscription;

  constructor(private http: HttpService) { }

  ngOnInit() { }

   replay(message, textArea) {

    console.log(textArea.value);
    let url = 'messages/'+message.id+'/replay';
    this.replayRequet = this.http.postData(url, {message: textArea.value }).subscribe(response =>{
      console.log(response);
      
    });
  }
  
  ngOnDestroy(){ if(this.replayRequet) this.replayRequet.unsubscribe(); }
}
