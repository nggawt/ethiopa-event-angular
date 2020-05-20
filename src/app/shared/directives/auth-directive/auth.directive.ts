import { Directive, ViewContainerRef, OnInit, ComponentFactoryResolver, OnDestroy, Input, ElementRef, TemplateRef } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { HelpersService } from 'src/app/services/helpers/helpers.service';
import { LogInComponent } from 'src/app/auth/log-in/log-in.component';
import { ResetPasswordComponent } from './../../../auth/rest-password/reset-password.component';
import { ForgotPasswordComponent } from './../../../auth/forgot-password/forgot-password.component';

@Directive({
  selector: '[auth]'
})

export class AuthDirective implements OnInit, OnDestroy {

  @Input() set auth(value: { from_path: string, url: string, type: string }) {

    let validToken = (typeof value == "object" && value.type) ? this.hls.isValidToken(value.type) : this.hls.isValidToken();
    if (!validToken && typeof value == "object") this.handleDirective(value, 'login')
    // this.viewCont.createEmbeddedView(this.ref);
  }

  componentRef: any;
  constructor(public viewCont: ViewContainerRef, private resolver: ComponentFactoryResolver, private http: HttpService, public hls: HelpersService) { }

  ngOnInit() { /* this.loadComponent(); */ }

  loadComponent(componentName?: string) {
    console.log(this);

    this.viewCont.clear();
    const component: any = componentName == 'login' ? LogInComponent :
                            componentName == 'reset' ? ResetPasswordComponent :
                              componentName == 'forgot' ? ForgotPasswordComponent :
                                false;

    if (component) {
      const factory = this.resolver.resolveComponentFactory(component);
      this.componentRef = this.viewCont.createComponent(factory);
    }
  }

  handleDirective(value, compId) {
    this.http.requestUrl = value.from_path;
    this.http.loginTo = value.url;
    this.loadComponent(compId);
    this.componentRef.instance.ldComp = this.loadComponent.bind(this);//"hiii there from login directive";
    console.log(this.componentRef);

  }

  ngOnDestroy() { if (this.componentRef) this.componentRef.destroy(); }
}
