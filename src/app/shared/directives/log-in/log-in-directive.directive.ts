import { Directive, ViewContainerRef, OnInit, ComponentFactoryResolver, OnDestroy, Input, ElementRef, TemplateRef } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { HelpersService } from 'src/app/services/helpers/helpers.service';
import { LogInComponent } from 'src/app/auth/log-in/log-in.component';
import { ResetPasswordComponent } from './../../../auth/rest-password/reset-password.component';

@Directive({
  selector: '[appLogInDirective]'
})

export class LogInDirectiveDirective implements OnInit, OnDestroy {

  @Input() set appLogInDirective(value: { from_path: string, url: string, type: string }) {

    let validToken = (typeof value == "object" && value.type) ? this.hls.isValidToken(value.type) : this.hls.isValidToken();
    if (!validToken && typeof value == "object") this.handleDirective(value)
    // this.viewCont.createEmbeddedView(this.ref);
  }

  componentRef: any;
  constructor(public viewCont: ViewContainerRef, private resolver: ComponentFactoryResolver, private http: HttpService, public hls: HelpersService) { }

  ngOnInit() { /* this.loadComponent(); */ }

  loadComponent() {

    const component = LogInComponent; //ResetPasswordComponent;
    const factory = this.resolver.resolveComponentFactory(component);

    this.viewCont.clear();
    
    this.componentRef = this.viewCont.createComponent(factory);
  }

  handleDirective(value) {
    this.http.requestUrl = value.from_path;
    this.http.loginTo = value.url;
    this.loadComponent();
  }

  ngOnDestroy() { if (this.componentRef) this.componentRef.destroy(); }
}
