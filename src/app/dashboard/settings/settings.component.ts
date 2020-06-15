import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  create(url: string){
    alert("create fn need to implement");
  }

  destroy(url?: string){
    alert("destroy fn need to implement");
  }
}
