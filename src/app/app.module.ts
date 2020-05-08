import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap' // , ErrorHandler 
// import { NgxPopper } from 'angular-popper';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

/****************** Shared pipes ********************/

/****************** Shared directive ********************/

/****************** modules ********************/
import { SharedModuleModule } from './shared/shared-module/shared-module.module';

/****************** COSTUM Modules ********************/
import { DahsboardModule } from './dashboard/dahsboard-module/dahsboard.module';
import { TemplateModule } from './shared/templates/templateModule.module';
import { PipesModule } from './shared/pipes-module/pipes-module';

/****************** Routing ********************/
import { PagesRoutingModule } from './pages-routing-module';

/****************** Services ********************/
import { CustomersDataService } from './customers/customers-data-service';
import { CanDeactivateGuardService } from './services/can-deactivate-guard/can-deactivate-guard.service';
import { CustomersResolver } from './pages/customers/customers-resolver.service';

/****************** Auth component ********************/
import { LogInComponent } from './auth/log-in/log-in.component';
import { AuthComponent } from './auth/auth/auth.component';
import { AdminRegistrationComponent } from './auth/admin-registration/admin-registration.component';

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

/****************** Exeptions ********************/
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
// import { ErrorsHandler } from './services/errors-exeption/errors-handler.service';

export function tokenGetter(type?: string) {
  return type? localStorage.getItem(type) : localStorage.getItem('token');
}

// export function getTokens() {
//   return localStorage.getItem('tokens');
// }

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
    
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter, 
        whitelistedDomains: ['http://lara.test/api/'],
        blacklistedRoutes: ['example.com/examplebadroute/']
      },
      // jwtOptionsProvider: {
      //   provide: JWT_OPTIONS,
      //   useFactory: getTokens,
      //   deps: [AuthService]
      // }
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