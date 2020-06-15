import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
import { find, tap, map, filter } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { User } from 'src/app/types/user-type';

@Component({
  selector: 'app-show-post',
  templateUrl: './show-post.component.html',
  styleUrls: ['./show-post.component.css']
})
export class ShowPostComponent implements OnInit, OnDestroy {
  post;
  user: User | boolean;
  postId;
  params: Subscription;

  constructor(private route:ActivatedRoute, private loc: Location, private router:Router) { }

  ngOnInit() {
    // this.postId = this.route.snapshot.params['id'];
    //this.post$ = this.http.getData("blog").pipe(tap(items => this.blogPosts = items), map(post => Array.prototype.filter.call(post, item => item.id == postId)));
    //console.log(postId);
    
  }

  blog(evt){
    this.params = this.route.params.subscribe(param => {
      this.user = evt['user'];
      this.postId = param['id'];
      let showPost = this.findPost(evt['blogPosts']);
      showPost? this.post = showPost: this.back();
    });
  }

  findPost(items){
    return items.find(item => item.id == this.postId);
  }

  back(){
    // this.loc.back();
    setTimeout(() => {
      this.router.navigate(['/blog']);
    }, 200);
  }

  go(param?){
    console.log(param);
  }

  ngOnDestroy(){
    this.params.unsubscribe();
  }
}
