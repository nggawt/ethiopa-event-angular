import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service/http.service';
import { ResourcesService } from 'src/app/services/resources/resources.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {

  messageItems: {};
  

  constructor(private http: HttpService, private srv: ResourcesService) { }

  ngOnInit() {
    this.srv.getResources('messages', false).then(msgs => {
      this.messageItems = this.getFilredItems(msgs);
      console.log('/inbox: ', msgs);
      
    });
   }

  replay(message, sendTo) {
    console.log(message.value, sendTo);

    this.http.postData('replay', {message: message.value }).subscribe(response =>{
      console.log(response);
      
    });
  }

  trash(message){

    console.log(message);
    let url = 'messages/'+ message.id+'?_method=delete';
    this.http.postData(url).subscribe(response =>{
      console.log(response);
      
    });
  }

  favorites(message){

    console.log(message);
    let url = 'messages/'+ message.id+'?_method=patch';
    this.http.postData(url, {favorites: 1}).subscribe(response =>{
      console.log(response);
      
    });
  }

  getFilredItems(items){
    return items.filter(item => item.deleted_at === null).sort((aItem, bItem) => new Date(bItem.created_at).getTime() - new Date(aItem.created_at).getTime());
  }

}
