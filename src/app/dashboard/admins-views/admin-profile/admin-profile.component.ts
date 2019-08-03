import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {
  @Input() itemData: {};
  constructor() { }

  ngOnInit() {
    console.log(this.itemData);
    
  }

}
