import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { skipWhile, map, toArray, tap, filter } from 'rxjs/operators';
import { ResourcesService } from '../../services/resources/resources.service';
declare var $;

@Component({
  selector: 'app-quick-editor',
  templateUrl: './quick-editor.component.html',
  styleUrls: ['./quick-editor.component.css']
})
export class QuickEditorComponent implements OnInit {
  itemsResources$:{};
  savedId:{prevElemId: string | boolean} = {['prevElemId']:false};

  // collection = { count: 60, data: [] };
  // public maxSize: number = 7;
  // public directionLinks: boolean = true;
  // public autoHide: boolean = false;
  // public responsive: boolean = true;
  /* public labels: any = {
      previousLabel: '<<<--',
      nextLabel: '-->>>',
      screenReaderPaginationLabel: 'Pagination',
      screenReaderPageLabel: 'page',
      screenReaderCurrentLabel: `You're on page`
  }; */
  constructor(private http: HttpService, private resSrv: ResourcesService) { }

  ngOnInit() {

    this.itemsResources$ = this.resSrv.resourcesObsever.pipe(filter(items => typeof items == "object"), map(items => this.paginateConf(items)));
  }
  
  paginateConf(items){

    let newConf = {
    };

    Object.keys(items).forEach(itemKey => {
      let totalItems = [...items[itemKey].data, ...items[itemKey].pending];
      let conf = {
        config: {
          currentPage: 1,
          id: "total_"+itemKey,
          itemsPerPage: 5,
          totalItems: totalItems.length
        },
        count: totalItems.length,
        data: totalItems
      };
      newConf[itemKey] = conf;
    });
    return newConf;
  }

  destroy(item, items){
    console.log(item, items);
    
  }

  pageChanged(event, param){
    console.log(event);
    console.log(param);
    
    this.itemsResources$[param].config.currentPage = event;
  }
}
