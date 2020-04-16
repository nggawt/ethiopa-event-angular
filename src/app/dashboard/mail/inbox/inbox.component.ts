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
  

  constructor(private http: HttpService, private rsrv: ResourcesService) { }

  ngOnInit() {
    this.rsrv.getResources('messages', false).then(msgs => {
      if(msgs){

        let sorted = this.getSortededItems(msgs);
        // console.log('/inbox: ', msgs);
        console.log('/sorted: ', sorted);
         this.messageItems = this.rsrv.dataTransform('messages', sorted);
      }
      console.log('/inbox: ', this.messageItems);
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

  protected getSortededItems(items){
    return items.filter(item => item.deleted_at === null || item.deleted_at === undefined).sort((aItem, bItem) => new Date(bItem.created_at).getTime() - new Date(aItem.created_at).getTime());
  }

  forbidden(items){

    let isForbidden = items.forbidden,
        method = isForbidden? '/open': '/lock',
        url = "banntrash/"+items.id+ method;

    let data = {
      banned_until: isForbidden? null: this.bannedUntil(),
      email: items.email,
      id: items.id, 
      user_id: items.user_id, 
      model: 'message'
    };

    console.log("url ", url, " items to send: ", data, " item to update: ", items);
    this.http.postData(url, data).subscribe(response =>{
      console.log('response: ', response);
      // this.rsrv.update(resName, items); 
      if(response['status']){
        items.forbidden = ! items.forbidden;
        let res = isForbidden? response['user']: response['forbidden'];
        this.rsrv.forbiddenUser('users', res, isForbidden); 
      }
    });
  }

  protected bannedUntil(){
    let date = new Date();
    let nextTwoWeeks = new Date(date.setDate(date.getDate() + 14)),
        dt = nextTwoWeeks.getFullYear()+"-"+nextTwoWeeks.getMonth()+"-"+nextTwoWeeks.getDate()+" "+
        nextTwoWeeks.getHours()+":"+nextTwoWeeks.getMinutes()+":"+nextTwoWeeks.getSeconds();

    return dt;
  }

}
