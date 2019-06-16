import { Component, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpService } from 'src/app/services/http-service/http.service';
import { map, tap } from 'rxjs/operators';
import { User } from 'src/app/types/user-type';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/services/validation/validation.service';
declare var $;

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.css']
})
export class UpdatePostComponent implements OnInit {

  // post$: Observable<{}>;
  post;
  urlId;
  params: Subscription;

  user$: Observable<{}>;
  userPromise: User | boolean;

  updatePost: FormGroup;
  messages: object | boolean = {};
  // blogPosts;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private loc: Location,
    private http: HttpService,
    private validator: ValidationService) { }

  ngOnInit() {
    this.urlId = this.route.snapshot.params['id'];
  }

  blog(evt){

    this.params = this.route.params.subscribe(param => {
      
      this.userPromise = evt['user'];
      this.urlId = param['id'];
      this.post = this.findPost(evt['blogPosts']);
      
      console.log(this.post);
      if(this.userPromise && this.post){
      
        this.intiForm();
        this.user$ = of(this.userPromise);
      }else{
        this.back();
      }
    });
  }

  back(){
    this.loc.back();
  }

  findPost(items){
    return items.find(item => item.id == this.urlId && item['user_id'] == this.userPromise['id']);
  }

  setHight(el){
    el.style.height = '0px';     //Reset height, so that it not only grows but also shrinks
    el.style.height = (el.scrollHeight+10) + 'px'; 
    // $(el).height(el.scrollHeight );
  }

  intiForm() {
    this.updatePost = new FormGroup({
      // name: new FormControl(null, [Validators.required]),
      title: new FormControl(this.post.title, [Validators.required]),
      body: new FormControl(this.post.body, [Validators.required]),
    });
  }

  onSubmit() {


    if (this.updatePost.valid) {
      let data: { name: string, title: string, body: string } = this.updatePost.value
      data['name'] = this.userPromise["name"];

      this.send(data, "blog", "PUT");
    }
  }

  send(body, url?: string, method?: string) {
    let baseUrl = "http://ethio:8080/api";
    url = url ? url : "blog";

    let updaterUrl = url && method ? baseUrl + "/" + url + "/" + this.post["id"] + "?_method=" + method : baseUrl + "/" + url;
    console.log(updaterUrl);
    this.http.postData(updaterUrl, body)
      .subscribe(evt => {

        console.log(evt);
        let msgs = this.validator.getMassages(evt);
        console.log(msgs);
        this.messages = msgs;
        this.resetMessages();

      }, (err) => {

        console.log(err);
        if (err["status"] === 401) {
          this.http.nextIslogged(false);
          window.localStorage.removeItem('user_key');
          window.location.reload();
        }
      });
  }

  async resetMessages() {
    let response = await this.validator.resetMessages();
    this.messages = await response;

    /* await this.valForm.resetMessages().then(res => {
      this.messages = res;
    }); */
  }

}
