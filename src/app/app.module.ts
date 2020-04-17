import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { NgxPopper } from 'angular-popper';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

/****************** Services ********************/
import { CustomersDataService } from './customers/customers-data-service';
import { CanDeactivateGuardService } from './services/can-deactivate-guard/can-deactivate-guard.service';
import { CustomersResolver } from './pages/customers/customers-resolver.service';
// import { ErrorsHandler } from './services/errors-exeption/errors-handler.service';


/****************** MAIN Pages ********************/
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { WellcomeComponent } from './pages/wellcome/wellcome.component';
import { AsideComponent } from './pages/aside/aside.component';
import { AboutComponent } from './pages/about/about.component';
import { GoalComponent } from './pages/goal/goal.component';
import { FooterComponent } from './pages/footer/footer.component';
import { JoinComponent } from './join/join.component';
import { EventsSchedulComponent } from './pages/events-schedul/events-schedul.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { DealsComponent } from './pages/deals/deals.component';

/****************** Blog Component ********************/
import { BlogComponent } from './pages/blog/blog.component';
import { CreatePostComponent } from './pages/blog/create-post/create-post.component';
import { ShowPostComponent } from './pages/blog/show-post/show-post.component';
import { UpdatePostComponent } from './pages/blog/update-post/update-post.component';
import { BlogTemplateComponent } from './pages/blog/blog-template/blog-template.component';

/****************** auth Component ********************/
import { RegistrationComponent } from './auth/registration/registration.component';
import { ResetPasswordComponent } from './auth/rest-password/reset-password.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';

/****************** Routing ********************/
import { PagesRoutingModule } from './pages-routing-module';

/****************** Exeptions ********************/
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';

/*************** modules **************/
import { SharedModuleModule } from './shared/shared-module/shared-module.module';
import { QuillModule } from 'ngx-quill-v2';

/****************** Shared pipes ********************/

/****************** Auth component ********************/
import { LogInComponent } from './auth/log-in/log-in.component';
import { AuthComponent } from './auth/auth/auth.component';
import { AdminRegistrationComponent } from './auth/admin-registration/admin-registration.component';

/****************** Shared directive ********************/
import { CustomValidatorsDirective } from './shared/directives/custom-validators/custom-validators.directive';


// import { SendMessageDirectiveDirective } from './shared/directives/contact/send-message-directive.directive';

// import * as $ from "jquery";

/****************** COSTUM Modules ********************/
import { DahsboardModule } from './dashboard/dahsboard-module/dahsboard.module';
import { TemplateModule } from './shared/templates/templateModule.module';
import { PipesModule } from './shared/pipes-module/pipes-module';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    WellcomeComponent,
    HeaderComponent,
    AboutComponent,
    BlogComponent,
    AsideComponent,
    FooterComponent,
    GoalComponent,
    PageNotFoundComponent,
    ErrorPageComponent,
    JoinComponent,
    RegistrationComponent,
    EventsSchedulComponent,
    ProfileComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    CreatePostComponent,
    ShowPostComponent,
    UpdatePostComponent,
    BlogTemplateComponent,
    DealsComponent,
    AuthComponent,
    CustomValidatorsDirective,
    AdminRegistrationComponent,
  ],

  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,

    /***** modules imports start here ****/
    DahsboardModule,
    PagesRoutingModule,
    SharedModuleModule,
    TemplateModule,
    PipesModule,

    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }),

    /***** modules imports end ****/
    QuillModule.forRoot({
      scrollingContainer: "html"
    }),

    // NgbModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['http://lara.test/api/'],
        blacklistedRoutes: ['example.com/examplebadroute/']
      }
    })
  ],
  providers: 
  [ 
    CustomersDataService, CustomersResolver, CanDeactivateGuardService,
    // { provide: ErrorHandler, useClass: ErrorsHandler}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }