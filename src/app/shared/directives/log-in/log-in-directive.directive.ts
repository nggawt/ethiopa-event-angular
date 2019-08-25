import { Directive, ViewContainerRef, OnInit, TemplateRef, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { LogInComponent } from 'src/app/auth/log-in/log-in.component';

@Directive({
  selector: '[appLogInDirective]'
})

export class LogInDirectiveDirective implements OnInit, OnDestroy {
  
  componentRef: any;
  constructor(public tempRef: TemplateRef<any>, public viewCont: ViewContainerRef, private resolver: ComponentFactoryResolver ) { }

  ngOnInit(){ this.loadComponent(); }

  loadComponent() {

    const component = LogInComponent;
    const factory = this.resolver.resolveComponentFactory(component);

    this.viewCont.clear();

    this.componentRef = this.viewCont.createComponent(factory);
    // this.componentRef.instance.itemData = "log-in";
    // console.log(this.tempRef, this.componentRef);
  }

  ngOnDestroy(){ this.componentRef.destroy();}
}
