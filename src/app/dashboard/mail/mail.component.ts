import { Component, OnInit } from '@angular/core';
import { ResourcesService } from '../resources.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent implements OnInit {
  resources$: Observable<{}>;

  constructor(private srv: ResourcesService) { }

  ngOnInit() {
    this.resources$ = this.srv.resourcesObsever;
  }
}
