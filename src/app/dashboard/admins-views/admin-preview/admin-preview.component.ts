import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-admin-preview',
  templateUrl: './admin-preview.component.html',
  styleUrls: ['./admin-preview.component.css']
})
export class AdminPreviewComponent implements OnInit {
  @Input() itemData: {} | any;
  constructor() { }

  ngOnInit() {
    console.log(this.itemData);
    
  }

}
