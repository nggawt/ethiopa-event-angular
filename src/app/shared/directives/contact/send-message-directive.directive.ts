import { Directive, OnDestroy, OnInit, TemplateRef, ComponentFactoryResolver, ViewContainerRef, Input } from '@angular/core';
import { ContactComponent } from 'src/app/pages/contact/contact.component';

@Directive({
  selector: '[appSendMessageDirective]'
})
export class SendMessageDirectiveDirective implements OnInit, OnDestroy {
  
  @Input() appSendMessageDirective;
  componentRef: any;

  constructor(public tempRef: TemplateRef<any>, 
    public viewCont: ViewContainerRef, 
    private resolver: ComponentFactoryResolver) { }

  ngOnInit(){ this.loadComponent(); }

  loadComponent() {

    const factory = this.resolver.resolveComponentFactory(ContactComponent);

    this.viewCont.clear();

    this.componentRef = this.viewCont.createComponent(factory);
    this.componentRef.instance.mailProps = this.appSendMessageDirective;
  }

  ngOnDestroy(){ 
    this.componentRef.destroy(); 
    this.tempRef = null;
    console.log("destroy message component");
  }

}
