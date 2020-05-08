import { Directive, ViewContainerRef, OnInit, ComponentFactoryResolver, OnDestroy, Input } from '@angular/core'; 
import { SearchComponent } from 'src/app/header/search/search.component';

@Directive({
  selector: '[appSearchDirective]'
})

export class SearchDirective implements OnInit, OnDestroy {

  @Input()  appSearchDirective;
  componentRef: any;

  constructor(public viewCont: ViewContainerRef, private resolver: ComponentFactoryResolver ) { }

  ngOnInit() { this.loadComponent();}

  loadComponent() {

    const component = SearchComponent; //ResetPasswordComponent;
    const factory = this.resolver.resolveComponentFactory(component);

    this.viewCont.clear();
    
    this.componentRef = this.viewCont.createComponent(factory);
    // console.log(this.componentRef); 
  }

  ngOnDestroy() { if (this.componentRef) this.componentRef.destroy(); }
}
