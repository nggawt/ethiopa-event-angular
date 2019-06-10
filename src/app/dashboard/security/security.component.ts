import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
  @Input() itemsResources:{};
  constructor() { }

  ngOnInit() {
  }

}
