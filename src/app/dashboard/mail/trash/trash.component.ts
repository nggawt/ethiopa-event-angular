import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { ResourcesService } from 'src/app/services/resources/resources.service';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.css']
})
export class TrashComponent implements OnInit {
  messageItems;

  constructor(private http: HttpService, private srv: ResourcesService) { }

  ngOnInit() {
    this.srv.getResources('messages', false).then(msgs => {
      this.messageItems = this.getFilredItems(msgs);
      console.log('/trash: ', msgs);
      
    });
  }

  restoreTrashed(item){
    let url = 'banntrash/'+ item.id+"/restore";
    this.http.postData(url).subscribe(response =>{
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

  protected getFilredItems(items){
    return items.filter(item => item.deleted_at != null).sort((aItem, bItem) => new Date(bItem.created_at).getTime() - new Date(aItem.created_at).getTime());
  }
}
