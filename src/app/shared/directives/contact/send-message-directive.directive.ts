import { Directive, OnDestroy, OnInit, TemplateRef, ComponentFactoryResolver, ViewContainerRef, Input } from '@angular/core';
import { ContactComponent } from 'src/app/pages/contact/contact.component';

@Directive({
  selector: '[appSendMessage]'
})
export class SendMessageDirectiveDirective implements OnInit, OnDestroy {
  
  @Input() appSendMessage;
  componentRef: any;

  constructor(public viewCont: ViewContainerRef, private resolver: ComponentFactoryResolver) { }

  ngOnInit(){ this.loadComponent(); }

  loadComponent() {

    const factory = this.resolver.resolveComponentFactory(ContactComponent);

    this.viewCont.clear();

    this.componentRef = this.viewCont.createComponent(factory);
    this.componentRef.instance.mailProps = this.appSendMessage;
  }

  ngOnDestroy(){ 
    this.componentRef.destroy(); 
    console.log("destroy message SendMessageDirectiveDirective");
  }

}
