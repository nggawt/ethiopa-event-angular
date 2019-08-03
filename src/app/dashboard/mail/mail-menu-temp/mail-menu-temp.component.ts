import { Component, OnInit, Input } from '@angular/core';
import { ResourcesService } from 'src/app/services/resources/resources.service';

@Component({
  selector: 'app-mail-menu-temp',
  templateUrl: './mail-menu-temp.component.html',
  styleUrls: ['./mail-menu-temp.component.css']
})

export class MailMenuTempComponent implements OnInit {
  
  @Input() message: {};
  @Input() idx: {};
  constructor() { }

  ngOnInit() {
    console.log("mail-menu component called");
   }

  
  
}
