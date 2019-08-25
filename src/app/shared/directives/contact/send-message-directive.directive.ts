import { Directive, OnDestroy, OnInit, TemplateRef, ComponentFactoryResolver, ViewContainerRef, Input } from '@angular/core';
import { ContactComponent } from 'src/app/pages/contact/contact.component';
import { HttpService } from 'src/app/services/http-service/http.service';

@Directive({
  selector: '[appSendMessageDirective]'
})
export class SendMessageDirectiveDirective implements OnInit, OnDestroy {
  
  @Input() appSendMessageDirective;
  componentRef: any;

  constructor(public tempRef: TemplateRef<any>, 
    public viewCont: ViewContainerRef, 
    private resolver: ComponentFactoryResolver,
    private http:HttpService ) { }

  ngOnInit(){ this.loadComponent(); }

  loadComponent() {

    const component = ContactComponent;
    const factory = this.resolver.resolveComponentFactory(component);

    this.viewCont.clear();

    this.componentRef = this.viewCont.createComponent(factory);
    this.componentRef.instance.mailProps = this.appSendMessageDirective;
    // console.log(this.tempRef, this.componentRef, this.appSendMessageDirective);

  /* 
    mailProps: {
      id: string,
      nameTo: string | boolean,
      emailTo: string | boolean,
      modalSize: string,
      title: string
    };
   */
  }

  ngOnDestroy(){ 
    this.componentRef.destroy(); 
    this.tempRef = null;
    console.log("destroy message component");
  }

}
