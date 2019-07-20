import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-outbox',
  templateUrl: './outbox.component.html',
  styleUrls: ['./outbox.component.css']
})
export class OutboxComponent implements OnInit {

  msgs: {};
  constructor() { }

  ngOnInit() {
  }

}
