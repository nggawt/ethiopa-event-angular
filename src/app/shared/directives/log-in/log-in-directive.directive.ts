import { Directive, ViewContainerRef, OnInit, ComponentFactoryResolver, OnDestroy, Input } from '@angular/core';
import { LogInComponent } from 'src/app/auth/log-in/log-in.component';
import { HttpService } from 'src/app/services/http-service/http.service';
import { HelpersService } from 'src/app/services/helpers/helpers.service';

@Directive({
  selector: '[appLogInDirective]'
})

export class LogInDirectiveDirective implements OnInit, OnDestroy {

  @Input() set appLogInDirective(value: {from_path: string, url: string} | boolean) {
    // this.viewCont.createEmbeddedView(this.tempRef);
    

    if (this.hls.isExpiredToken() && typeof value == "object") {
      this.http.requestUrl = value.from_path;
      this.http.loginTo = value.url;
      this.loadComponent();
    }
    console.log(value);
  }
  componentRef: any;
  constructor(public viewCont: ViewContainerRef, private resolver: ComponentFactoryResolver, private http: HttpService, public hls: HelpersService) { }

  ngOnInit() { /* this.loadComponent(); */ }

  loadComponent() {

    const component = LogInComponent;
    const factory = this.resolver.resolveComponentFactory(component);

    this.viewCont.clear();

    this.componentRef = this.viewCont.createComponent(factory);
    // this.componentRef.instance.itemData = "log-in";
    // console.log(this.tempRef, this.componentRef);
  }

  ngOnDestroy() { if(this.componentRef) this.componentRef.destroy(); }
}
