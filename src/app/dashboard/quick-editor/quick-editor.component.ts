import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { skipWhile, map, toArray, tap, filter } from 'rxjs/operators';
import { ResourcesService } from '../resources.service';
declare var $;

@Component({
  selector: 'app-quick-editor',
  templateUrl: './quick-editor.component.html',
  styleUrls: ['./quick-editor.component.css']
})
export class QuickEditorComponent implements OnInit {
  itemsResources$:{};
  savedId:{prevElemId: string | boolean} = {['prevElemId']:false};

  collection = { count: 60, data: [] };
  public maxSize: number = 7;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public responsive: boolean = true;
  public labels: any = {
      previousLabel: '<<<--',
      nextLabel: '-->>>',
      screenReaderPaginationLabel: 'Pagination',
      screenReaderPageLabel: 'page',
      screenReaderCurrentLabel: `You're on page`
  };
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
          itemsPerPage: 3,
          totalItems: totalItems.length
        },
        count: totalItems.length,
        data: totalItems
      };
      newConf[itemKey] = conf;
    });
    return newConf;
  }

  getResources(resourcesEmmiter){
    console.log(resourcesEmmiter);
    this.itemsResources$ = resourcesEmmiter;
  }

  editIem(textArea){
    console.log(textArea);
    let elem = $('#'+textArea)[0];
    // console.log(elem);
    elem.style.whiteSpace ="normal";

    let storageId = this.savedId['prevElemId'];
    
    if(storageId && storageId != textArea){
      let storgeElem = $('#'+storageId)[0];
      if(storgeElem) this.shrinkElem(storgeElem);
      this.savedId['prevElemId'] = false;
      
    }
    // this.attachEvents(storageId, elem);
    (elem.classList.contains('position-absolute'))? this.shrinkElem(elem):this.extendElem(elem, textArea);
    
  }

  shrinkElem(elem){
    elem.classList.remove('position-absolute');
    elem.style.width ="inherit";
    elem.style.zIndex ="0";
    elem.style.height = (50)+'px';  
    elem.rows = "3";
    elem.classList.remove('show');
    elem.classList.add('hide');
    // console.log("shrink")
    // elem.setSelectionRange(0, 0);
    // elem.focus();
    this.savedId['prevElemId'] = false;
  }

  extendElem(elem, id){
    elem.classList.add('position-absolute');
    elem.classList.add('show');
    elem.classList.remove('hide');
    elem.style.width ="50%";
    elem.style.zIndex ="99";
    elem.style.height = '0px';     //Reset height, so that it not only grows but also shrinks
    elem.style.height = (elem.scrollHeight+10) + 'px'; 
    this.savedId['prevElemId'] = id;
        // this.attachEvents(elem)
    elem.setSelectionRange(0, 0);
    elem.focus();
  }

  attachEvents(strId, currentElem){
    let storgeElem = $('#'+strId)[0];
    $(document).on("click", (e) => {  
      if(e.target.id == storgeElem.id){
        e.stopPropagation();
        // this.savedId['prevElemId'] = storgeElem.id;
        // storgeElem.removeEventListener('click', this.editIem);
        return false;  
      } 
      console.log(strId, currentElem.id);
      console.log("called");
      console.log("called");
      
      if(this.savedId['prevElemId'] && storgeElem.id != currentElem.id) {
        // let storgeElem = $('#'+this.savedId['prevElemId'])[0];
        this.shrinkElem(storgeElem); //hide the button
        // this.savedId['prevElemId'] = false;
        // document.removeEventListener('click', this.editIem);
      }
    });

    // $("#search_form").on("focus",() => {
    //   $(ul).show();
    // });
  }
  
  pageChanged(event, param){
    console.log(event);
    console.log(param);
    
    this.itemsResources$[param].config.currentPage = event;
  }
}
