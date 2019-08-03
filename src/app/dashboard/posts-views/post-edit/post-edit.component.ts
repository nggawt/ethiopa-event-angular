import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { ResourcesService } from '../../../services/resources/resources.service';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { QuillEditorComponent, QuillFormat } from 'ngx-quill';
import { QuillViewComponent } from 'ngx-quill/src/quill-view.component';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {

  formGr: FormGroup;
  @Input() itemData: {};
  quill: {};

  toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
  ];

  config = {
    toolbar: this.toolbarOptions,
    // handlers: {
    //   'text-right': (arg) => console.log(arg),
    // }
    // placeholder: 'Compose an epic...',
    // readOnly: true,
    // theme: 'bubble'
  };
  constructor() { }

  ngOnInit() {
    if(this.itemData) this.itemForm(this.itemData);
  }

  get f() : {} {
    return this.formGr.controls;
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

  onSubmit(){
    console.log("submited");
  }

  itemForm(items){
    
    let formItems = {};
    Object.keys(items).forEach(item => {
      formItems[item] = new FormControl(items[item]);
    })
    this.formGr = new FormGroup(formItems);
    // console.log(this.formGr);
  }
}
