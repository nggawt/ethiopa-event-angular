import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http-service/http.service';
import { ResourcesService } from 'src/app/services/resources/resources.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  messageItems;

  constructor(private http: HttpService, private srv: ResourcesService) { }/* private route: ActivatedRoute */

  ngOnInit() {
    this.srv.getResources('messages', false).then(msgs => {
      this.messageItems = this.getFilredItems(msgs);
      console.log('/favorites: ', msgs);
      
    });
  }

  trash(message){

    console.log(message);
    let url = 'messages/'+ message.id+'?_method=delete';
    this.http.postData(url).subscribe(response =>{
      console.log(response);
      
    });
  }

  removeFavorites(message){
    let url = 'messages/'+ message.id+'?_method=patch';
    this.http.postData(url, {favorites: 0}).subscribe(response =>{
      console.log(response);
    });
  }

  protected getFilredItems(items){
    return items.filter(item => item.favorites && item.deleted_at == null).sort((aItem, bItem) => new Date(bItem.created_at).getTime() - new Date(aItem.created_at).getTime());
  }
}
