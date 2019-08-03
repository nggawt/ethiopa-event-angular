import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-customer-preview',
  templateUrl: './customer-preview.component.html',
  styleUrls: ['./customer-preview.component.css']
})
export class CustomerPreviewComponent implements OnInit {

  @Input() itemData: {};
  constructor() { }

  ngOnInit() {
  }

}
