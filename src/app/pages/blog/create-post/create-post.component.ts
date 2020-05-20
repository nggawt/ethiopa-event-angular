import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpService } from 'src/app/services/http-service/http.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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

  constructor(private route: ActivatedRoute,
    private location: Location,
    private http: HttpService,
    private msgSrv: MessagesService) { }

  ngOnInit() {
    this.postId = this.route.snapshot.params['id'];
  }

  blog(evt){
    
    let user = evt['user']?.user;
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
      let data: { name: string, title: string, body: string } = this.createPost.value,
          dt= new Date();

      data['user_id'] = this.userPromise["id"];
      data['name'] = this.userPromise["name"];
      data['date'] = dt.getFullYear()+"-"+ dt.getMonth()+"-"+ dt.getDate();
      data['confirmed'] = false;
      this.send(data, 'articles', 'POST');
    }
  }

  send(body, url: string, method: string) {
    url = url ? url : "articles";

    let updaterUrl = url && method ? url + "/" + this.userPromise["id"] + "? _method=" + method : url;
    console.log(updaterUrl);
    
    this.http.postData('articles', body)
      .subscribe(evt => {

        console.log(evt);
        let msgs = this.msgSrv.proccesMessages(evt);
        console.log(msgs);
        this.messages = msgs;
        this.resetMessages();

      }, (err) => {

        console.log(err);
        if (err["status"] === 401) {
          // this.http.nextIslogged(false);
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
