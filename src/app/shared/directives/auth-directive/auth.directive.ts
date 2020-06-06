import { Directive, ViewContainerRef, OnInit, ComponentFactoryResolver, OnDestroy, Input } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { HelpersService } from 'src/app/services/helpers/helpers.service';
import { LogInComponent } from 'src/app/auth/log-in/log-in.component';
import { ResetPasswordComponent } from './../../../auth/rest-password/reset-password.component';
import { ForgotPasswordComponent } from './../../../auth/forgot-password/forgot-password.component';
import { RegistrationComponent } from './../../../auth/registration/registration.component';

@Directive({
  selector: '[auth]'
})

export class AuthDirective implements OnInit, OnDestroy {

  @Input() set auth(value: { from_path: string, url: string, type: string }) {
    if(value) this.handleDirective(value.url, value);
  }

  componentRef: any;
  constructor(public viewCont: ViewContainerRef, private resolver: ComponentFactoryResolver, private http: HttpService, public hls: HelpersService) { }

  ngOnInit() { /* this.loadComponent(); */ }

  loadComponent(componentName?: string) {

    this.viewCont.clear();
    const component: any = componentName == 'login' || componentName == 'admin-login'? LogInComponent :
      componentName == 'reset' ? ResetPasswordComponent :
        componentName == 'forgot' ? ForgotPasswordComponent :
          componentName == 'register' ? RegistrationComponent :
            false;

    if (component) {
      const factory = this.resolver.resolveComponentFactory(component);
      this.componentRef = this.viewCont.createComponent(factory);
      this.componentRef.instance.ldComp = this.handleDirective.bind(this);
    }
  }

  handleDirective(compId: string, value: { from_path: string, url: string, type: string }) {
    console.log("id:: ", compId, " ::value:: ", value);

    let validToken = (typeof value == "object" && value.type) ? this.hls.isValidToken(value.type) : this.hls.isValidToken();
    if (!validToken && typeof value == "object") {

      this.setUrlsParams(value);
      this.loadComponent(compId);
    }
  }

  setUrlsParams(params: { from_path: string, url: string, type: string }) {
    this.http.requestUrl = params.from_path;
    this.http.loginTo = params.url;
  }

  ngOnDestroy() { if (this.componentRef) this.componentRef.destroy(); }
}
