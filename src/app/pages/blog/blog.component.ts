import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { Observable, of } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import { User, UserFields } from 'src/app/types/user-type';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  blogPost: {}[];
  user: UserFields;

  constructor() { }

  ngOnInit() {
    // this.initBlog();
    
    
  }
  // https://www.facebook.com/ethiopiaevents/
  initBlog(){
    // this.blogPost$ = this.http.getData("blog").pipe(map(posts => Array.prototype.filter.call(posts,item => this.filterItems(item)).sort(this.sortItems)));
  }

  filterItems(item){
    item['date'] = new Date(item['date']);
    return item;
  }

  blog(evt){
    this.blogPost = evt['blogPosts'];
    this.user = evt['user']['user'];
  }
  
  sortItems(itemA, itemB){
    return  itemB['date'] - itemA['date'];
  }

  getRandomNum(min?, max?){
    return Math.floor(Math.random() * (max || 10 - (min || 1))) + (min || 1);
  }

  dPeregraph(parent, text: string){
    let matchStr = text.match(new RegExp(".*?\\..*?\\..*?\\..*?\\.", "gm")),
    pTag = document.createElement("P");
    console.log(text);
    
    if(false){
      matchStr.forEach(element => {
        pTag = document.createElement("P");
        pTag.innerHTML += element;
        parent.appendChild(pTag);
      });
    }else{
        pTag.innerHTML = text;
        parent.appendChild(pTag);
    }
  }

  getRendImage(){
    let url = ('https://source.unsplash.com/random/90x90?count='+ this.getRandomNum());
    console.log("hhhjjhj");
    // return "hhhhhh";
    // setTimeout(() => {return url;},500)
    return of(url);
  }
}
