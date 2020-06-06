import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core'; 
import { Observable, Subscription, of } from 'rxjs';
import { skipWhile } from 'rxjs/operators';
import { ResourcesService } from 'src/app/services/resources/resources.service';
import { AuthService } from 'src/app/services/auth-service/auth.service'; 

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

  constructor(private rsrv: ResourcesService,
    private auth: AuthService,) { }

  ngOnInit() {
    // console.log(this.navItems);
    /* this.posts$ = this.http.getData("articles").pipe(
      map(posts => Array.prototype.filter.call(posts,item => this.filterItems(item)).sort(this.sortItems)),
      tap(items => {
        console.log(items);
        this.subscripted = this.auth.userObs
        .pipe(//filter(item => typeof item == "object" || typeof item === "boolean")
          skipWhile(item => typeof item == "number"))
        .subscribe(user => {
          
          this.itemsPost.emit({user:user? user: false, blogPosts: items});
        });
      })); */

      this.rsrv.getResources('articles', false).then(articles => {
        this.subscripted = this.auth.userObs
        .pipe(//filter(item => typeof item == "object" || typeof item === "boolean")
          skipWhile(item => typeof item == "number"))
        .subscribe(user => {
          
          this.itemsPost.emit({user:user? user: false, blogPosts: articles});
          this.posts$ = of(articles);
        });
      });
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
