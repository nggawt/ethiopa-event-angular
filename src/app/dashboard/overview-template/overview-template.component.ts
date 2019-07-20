import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ResourcesService } from '../../services/resources/resources.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { HttpService } from 'src/app/services/http-service/http.service';
import { tap } from 'rxjs/operators';
declare var $;

@Component({
  selector: 'app-overview-template',
  templateUrl: './overview-template.component.html',
  styleUrls: ['./overview-template.component.css']
})
export class OverviewTemplateComponent implements OnInit {


  itemResource$: Observable<{}>;
  formGr: FormGroup;
  itemType: string;
  testBuzzi = "buzzi";
  
  constructor(private srv: ResourcesService, private router: Router, private route: ActivatedRoute, private http: HttpService) { }

  ngOnInit() {

    this.srv.initResources(['admins']);
    this.itemType = this.route.snapshot.data['itemType'];
    //console.log(this.itemType);

    this.route.params.subscribe(routeId => {
      // console.log(routeId);
      this.itemResource$ = this.srv.findItem(+routeId.id, this.itemType).pipe(tap(item => console.log(item)));

      
    });
  }

  model(){
    
    $('#forgotPassword').modal();
      let thiz = this;

      $(document).on('hidden.bs.modal', '.modal', function () {
        /// TODO EVENTS
        thiz.http.requestUrl ? thiz.router.navigate([thiz.http.requestUrl]) : thiz.router.navigate(['../'], { relativeTo: this.route });
      });
  }

}
