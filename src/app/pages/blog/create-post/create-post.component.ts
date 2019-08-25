import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, from, of } from 'rxjs';
import { map, tap, filter, first, single, take, takeUntil } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http-service/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/services/validation/validation.service';
import { User } from 'src/app/types/user-type';
import { MessagesService } from 'src/app/services/messages/messages.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  userPromise: User | boolean;
  postId;

  createPost: FormGroup;
  messages: object | any = {};

  constructor(private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private http: HttpService,
    private msgSrv: MessagesService,
    private validator: ValidationService) { }

  ngOnInit() {
    this.postId = this.route.snapshot.params['id'];
  }

  blog(evt){
    
    let user = evt['user'];
    (user)? this.userPromise = user : false;
      this.userPromise? this.intiForm(): this.location.back();
  }

  intiForm() {
    this.createPost = new FormGroup({
      // name: new FormControl(null, [Validators.required]),
      title: new FormControl(null, [Validators.required]),
      body: new FormControl(null, [Validators.required]),
    });
  }

  onSubmit() {
    console.log(this.createPost);


    if (this.createPost.valid) {
      let data: { name: string, title: string, body: string } = this.createPost.value
      data['name'] = this.userPromise["name"];

      this.send(data);
    }
  }

  send(body, url?: string, method?: string) {
    let baseUrl = "http://ethio:8080/api";
    url = url ? url : "blog";

    let updaterUrl = url && method ? baseUrl + "/" + url + "/" + this.userPromise["id"] + "? _method=" + method : baseUrl + "/" + url;
    console.log(updaterUrl);
    
    this.http.postData(updaterUrl, body)
      .subscribe(evt => {

        console.log(evt);
        let msgs = this.msgSrv.proccesMessages(evt);
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
    let response = await this.msgSrv.resetMessages();
    this.messages = await response;

    /* await this.valForm.resetMessages().then(res => {
      this.messages = res;
    }); */
  }
}
