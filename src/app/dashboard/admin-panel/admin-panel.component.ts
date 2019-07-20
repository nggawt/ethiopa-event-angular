import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { skipWhile, map, toArray } from 'rxjs/operators';
import { ResourcesService } from '../../services/resources/resources.service';
declare var $;

@Component({
  selector: 'admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  itemsResources$:{};
  
  constructor(private http: HttpService, private resSrv: ResourcesService) { }

  ngOnInit() {

    this.itemsResources$ = this.resSrv.resourcesObsever;
    console.log(this.itemsResources$);
  }
}
