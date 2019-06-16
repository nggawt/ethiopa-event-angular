import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'event-preview',
  templateUrl: './event-preview.component.html',
  styleUrls: ['./event-preview.component.css']
})
export class EventPreviewComponent implements OnInit {

  @Input() eventItem: {};
  constructor() { }

  ngOnInit() {
  }

}
