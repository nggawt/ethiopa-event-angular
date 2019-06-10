import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';//CommonModule
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
import { Observable, Subscription } from 'rxjs';
import { map, tap, every, skip, filter, first, skipWhile } from 'rxjs/operators';

@Component({
  selector: 'app-blog-template',
  templateUrl: './blog-template.component.html',
  styleUrls: ['./blog-template.component.css']
})
export class BlogTemplateComponent implements OnInit, OnDestroy {

  @Input() displayNavs;
  @Output() itemsPost: EventEmitter<any> = new EventEmitter<any>();
  posts$: Observable<{}>;
  subscripted: Subscription;

  constructor(private http: HttpService) { }

  ngOnInit() {
    // console.log(this.navItems);
    this.posts$ = this.http.getData("blog").pipe(
      map(posts => Array.prototype.filter.call(posts,item => this.filterItems(item)).sort(this.sortItems)),
      tap(items => {
        console.log(items);
        this.subscripted = this.http.userObs
        .pipe(//filter(item => typeof item == "object" || typeof item === "boolean")
          skipWhile(item => typeof item == "number"))
        .subscribe(user => {
          
          this.itemsPost.emit({user:user? user: false, blogPosts: items});
        });
      }));
  }

  filterItems(item){
    item['date'] = new Date(item['date']);
    return item;
  }

  sortItems(itemA, itemB){
    return  itemB['date'] - itemA['date'];
  }

  ngOnDestroy(){
    if(this.subscripted) this.subscripted.unsubscribe();
  }
}
