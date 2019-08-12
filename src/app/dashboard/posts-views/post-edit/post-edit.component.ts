import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ResourcesService } from '../../../services/resources/resources.service';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { QuillEditorComponent, QuillFormat } from 'ngx-quill';
import { QuillViewComponent } from 'ngx-quill/src/quill-view.component';
import { NotificationService } from 'src/app/services/messages/notification.service';
import { HttpService } from 'src/app/services/http-service/http.service';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {

  postUpdate: FormGroup;
  @Input() itemData: {id: number, name: string, title: string, body: string, date: string};
  quill: {};

  constructor(private msgNotify: NotificationService, private http: HttpService) { }

  ngOnInit() {
    if(this.itemData) this.itemForm(this.itemData);
  }

  get f() : {} {
    return this.postUpdate.controls;
  }
  
  configEditor(evt: any) {

    let container = evt.container;
    container.classList.add('h-75');
    // console.log(evt);
    // evt.theme.modules.toobar
    this.quill = evt;
    evt.format('direction', 'rtl');
    evt.format('align', 'right', 'user');
    evt.format('size', 'normal', 'user');
    evt.format('header', 3, 'user');

    // var toolbar = evt.getModule('toolbar');
    // console.log(toolbar);
  }

  itemForm(items){
    console.log(items);
    
    this.postUpdate = new FormGroup({
      name: new FormControl(items.name, [Validators.required]),
      title: new FormControl(items.title, [Validators.required]),
      body: new FormControl(items.body, [Validators.required]),
      date: new FormControl(items.date, [Validators.required]),
      confirmed: new FormControl(items.confirmed, [Validators.required]),
    });
  }

  onSubmit(){
    console.log(this.postUpdate);
    
    if(this.postUpdate.valid){
      this.send(this.postUpdate.value);
    }
  }

  send(body, customer?) {

    let url = "blog/"+this.itemData.id+"?_method=PUT";
    body['buzi'] ="me";
    console.log(body);
    
    this.http.postData(url, body)
      .subscribe(response => {
        localStorage.setItem('success_server', JSON.stringify(response));
        // this.sync(body, response);
        // this.msgs(body, response);
        // if(response['errors']){
        console.log(response);
        this.msgNotify.showSuccess('פוסט\\מאמר', "פוסט\\מאמר  עודכן בהצלחה", {positionClass: "toast-top-left"});
        /**** send new customer to his own page *****/

      }, (err) => {
        localStorage.setItem('errors_server', JSON.stringify(err));
        console.log(err);
        this.msgNotify.showErrors('פוסט\\מאמר', "פרטים שגויים!", {positionClass: "toast-top-left"});

        if (err["status"] === 401) {
          // console.log(err['status']);

          // this.http.nextIslogged(false);
          // window.localStorage.removeItem('user_key');
          // window.location.reload();
        }
      });
  }
}
