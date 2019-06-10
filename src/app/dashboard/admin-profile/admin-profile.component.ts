import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {
  @Input() itemsResources:{};
  constructor() { }

  ngOnInit() {
  }

}
