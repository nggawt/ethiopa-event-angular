import { Component, OnInit, Input, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { ResourcesService } from '../../services/resources/resources.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CompLists } from './comp-lists';
import { AddComponentDirective } from 'src/app/shared/directives/add-component.directive';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
  providers: [CompLists]
})
export class OverviewComponent implements OnInit, OnDestroy {
  itemResource: {};
  itemType:string;
  comp:string;
  componentRef: any;

  // @ViewChild(AddComponentDirective, {static: true}) entry: AddComponentDirective;
  // @ViewChild('placeholder', {static: true}) adHost: ViewContainerRef;
  @ViewChild(AddComponentDirective, {read: AddComponentDirective, static: false }) compItem: AddComponentDirective;
  constructor(
    private comlist: CompLists, 
    private srv: ResourcesService, 
    private route: ActivatedRoute, 
    private resolver: ComponentFactoryResolver) { }

  ngOnInit() {

    let itemId = this.route.snapshot.paramMap.get('id');
    this.itemType = this.route.snapshot.data['itemType'];
    this.comp = this.route.snapshot.data['comp'];

    this.srv.getResources(this.itemType, false)
    .then(resource => {

      (this.itemType == 'customers')? this.route.queryParamMap.subscribe((params: ParamMap) => {
        let routeName = params.get('name');
        Array.isArray(resource[routeName])? this.setItemResource(resource[routeName], itemId): '';
      }): Array.isArray(resource)? this.setItemResource(resource, itemId): '';
      this.loadComponent();
    });
  }

  setItemResource(resource, itemId){
    let item = resource.find(item => this.srv.checkTypeId(item, 'customer').id == itemId);
    this.itemResource = item;
  }
  
  loadComponent() {

    const component = this.comlist.getComp(this.itemType, this.comp);
    const factory = this.resolver.resolveComponentFactory(component);

    this.compItem.viewCont.clear();

    this.componentRef = this.compItem.viewCont.createComponent(factory);
    this.componentRef.instance.itemData = this.itemResource;
    // console.log(this.itemType, this.comp, this.componentRef, this.itemResource);
  }

  destroy(param){
    console.log('delete: ', param);
    
  }

  ngOnDestroy(){
    this.componentRef.destroy();
  }
}
