import { Component, OnInit, Input } from '@angular/core';
import { ResourcesService } from 'src/app/services/resources/resources.service';
import { HttpService } from 'src/app/services/http-service/http.service';

@Component({
  selector: 'app-mail-menu-temp',
  templateUrl: './mail-menu-temp.component.html',
  styleUrls: ['./mail-menu-temp.component.css']
})

export class MailMenuTempComponent implements OnInit {
  
  @Input() message: {};
  @Input() idx: {};
  constructor(private http: HttpService) { }

  ngOnInit() {
    console.log("mail-menu component called");
   }

   replay(message, textArea) {
    console.log(textArea.value);

    this.http.postData('messages/'+message.id+'/replay', {message: textArea.value }).subscribe(response =>{
      console.log(response);
      
    });
  }
  
  
}
