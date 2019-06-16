import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'post-preview',
  templateUrl: './post-preview.component.html',
  styleUrls: ['./post-preview.component.css']
})
export class PostPreviewComponent implements OnInit {

  @Input() postItem: {};
  constructor() { }

  ngOnInit() {
  }

}
