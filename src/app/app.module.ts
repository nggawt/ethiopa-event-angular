import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { NgxPopper } from 'angular-popper';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';

import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

/****************** Services ********************/
import { CustomersDataService } from './customers/customers-data-service';
import { CanDeactivateGuardService } from './services/can-deactivate-guard/can-deactivate-guard.service';
import { CustomersResolver } from './pages/customers/customers-resolver.service';


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

// Blog component
import { BlogComponent } from './pages/blog/blog.component';
import { CreatePostComponent } from './pages/blog/create-post/create-post.component';
import { ShowPostComponent } from './pages/blog/show-post/show-post.component';
import { UpdatePostComponent } from './pages/blog/update-post/update-post.component';
import { BlogTemplateComponent } from './pages/blog/blog-template/blog-template.component';


/****************** Costumer Component ********************/


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
import { QuillModule } from 'ngx-quill'
// import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
/* import { SalonsModule } from './pages/customers/salons/salons.module';
import { DjsModule } from './pages/customers/djs/djs.module';
import { PhotographersModule } from './pages/customers/photographers/photographers.module';
import { KysesModule } from './pages/customers/kyses-rabbinate/Kyses.module';
import { CarRentsModule } from './pages/customers/car-rents/car-rents.module';
import { FireworksModule } from './pages/customers/fireworks/fireworks.module';
import { HotelsModule } from './pages/customers/hotels/hotels.module';
import { PrintsgModule } from './pages/customers/printing/prints.module';
import { TransportsModule } from './pages/customers/transportation/transports.module'; */
// import { PhotographersResolver } from './pages/customers/photographers/photographers-resolver.service';
// import { CustomersModule } from './pages/customers/customers.module';
// import { HotelsResolver } from './pages/customers/hotels/hotels-resolver.service';
// import { ConcatFormComponent } from './pages/customers/templates/html-modals/concat-form/concat-form.component';
// import { CustomerComponent } from './pages/customers/templates/customer/customer.component';

/****************** pipes ********************/
import { TextToParagraphPipe } from './shared/pipes-module/text-to-paragraph.pipe';
import { DateHebrawPipe } from './shared/pipes-module/date-hebraw.pipe';
import { MainDashboardComponent } from './dashboard/main-dashboard/main-dashboard.component';
import { RmWhiteSpacePipe } from './shared/pipes-module/rm-white-space.pipe';
import { EventTypeToHebPipe } from './shared/pipes-module/event-type-to-heb.pipe';

/****************** Dashboard component ********************/
import { UsersViewsComponent } from './dashboard/users-views/users-views.component';
import { EventsViewsComponent } from './dashboard/events-views/events-views.component';
import { TasksComponent } from './dashboard/tasks/tasks.component';
import { SecurityComponent } from './dashboard/settings/security/security.component';
import { PostsViewsComponent } from './dashboard/posts-views/posts-views.component';
import { AdminPreviewComponent } from './dashboard/admins-views/admin-preview/admin-preview.component';
import { CustomersViewsComponent } from './dashboard/customers-views/customers-views.component';
import { NotificationsComponent } from './dashboard/notifications/notifications.component';
import { AdminsViewsComponent } from './dashboard/admins-views/admins-views.component';
import { QuickEditorComponent } from './dashboard/quick-editor/quick-editor.component';
import { MailComponent } from './dashboard/mail/mail.component';
import { OverviewComponent } from './dashboard/overview/overview.component';
import { PendingComponent } from './dashboard/pending/pending.component';
import { PostEditComponent } from './dashboard/posts-views/post-edit/post-edit.component';
import { CustomerEditComponent } from './dashboard/customers-views/customer-edit/customer-edit.component';
import { EventEditComponent } from './dashboard/events-views/event-edit/event-edit.component';
import { EventTypePipe } from './shared/pipes-module/event-type.pipe';
import { UserEditComponent } from './dashboard/users-views/user-edit/user-edit.component';
import { AdminCreateComponent } from './dashboard/admins-views/admin-create/admin-create.component';
import { LogInComponent } from './auth/log-in/log-in.component';
import { AuthComponent } from './auth/auth/auth.component';
import { AdminEditComponent } from './dashboard/admins-views/admin-edit/admin-edit.component';
import { UserProfileComponent } from './dashboard/users-views/user-profile/user-profile.component';
import { EventPreviewComponent } from './dashboard/events-views/event-preview/event-preview.component';
import { PostPreviewComponent } from './dashboard/posts-views/post-preview/post-preview.component';
import { CustomerPreviewComponent } from './dashboard/customers-views/customer-preview/customer-preview.component';
import { CustomerCreateComponent } from './dashboard/customers-views/customer-create/customer-create.component';
import { UserCreateComponent } from './dashboard/users-views/user-create/user-create.component';
import { EventCreateComponent } from './dashboard/events-views/event-create/event-create.component';
import { PostCreateComponent } from './dashboard/posts-views/post-create/post-create.component';
import { FillTextareaHeightPipe } from './shared/pipes-module/fill-textarea-height.pipe';
import { CustomValidatorsDirective } from './shared/directives/custom-validators/custom-validators.directive';
import { OutboxComponent } from './dashboard/mail/outbox/outbox.component';
import { FavoritesComponent } from './dashboard/mail/favorites/favorites.component';
import { PreferencesComponent } from './dashboard/mail/preferences/preferences.component';
import { TrashComponent } from './dashboard/mail/trash/trash.component';
import { InboxComponent } from './dashboard/mail/inbox/inbox.component';
import { MailMenuTempComponent } from './dashboard/mail/mail-menu-temp/mail-menu-temp.component';
import { AddComponentDirective } from './shared/directives/add-component.directive';
import { DashboardModelComponent } from './dashboard/dashboard-model/dashboard-model.component';
import { MailCreateComponent } from './dashboard/mail/mail-create/mail-create.component';
import { AdminRegistrationComponent } from './auth/admin-registration/admin-registration.component';
// import { SendMessageDirectiveDirective } from './shared/directives/contact/send-message-directive.directive';
import { LogInDirectiveDirective } from './shared/directives/log-in/log-in-directive.directive';
import { ContactComponent } from './pages/contact/contact.component';
import { ErrorsHandler } from './services/errors-exeption/errors-handler.service';
import { CustomerToHebPipe } from './shared/pipes-module/customer-to-heb.pipe';
import { CardComponent } from './dashboard/main-dashboard/card/card.component';
import { ResourcesNameConvertorPipe } from './shared/pipes-module/resources-name-convertor.pipe';
import { MainComponent } from './dashboard/main-dashboard/main/main.component';
import { MapByPipe } from './shared/pipes-module/map-by.pipe';
import { SlugPipe } from './shared/pipes-module/slug.pipe';
import { RolesComponent } from './dashboard/settings/roles/roles.component';
import { SettingsComponent } from './dashboard/settings/settings.component';
import { DashboardAdminComponent } from './dashboard/settings/dashboard-admin/dashboard-admin.component';
import { GenerateIdPipe } from './shared/pipes-module/generate-id.pipe';

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
    ContactComponent,
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
    TextToParagraphPipe,
    CreatePostComponent,
    ShowPostComponent,
    DateHebrawPipe,
    UpdatePostComponent,
    BlogTemplateComponent,
    DealsComponent,
    MainDashboardComponent,
    RmWhiteSpacePipe,
    EventTypeToHebPipe,
    UsersViewsComponent,
    EventsViewsComponent,
    TasksComponent,
    SecurityComponent,
    PostsViewsComponent,
    AdminPreviewComponent,
    CustomersViewsComponent,
    NotificationsComponent,
    AdminsViewsComponent,
    QuickEditorComponent,
    MailComponent,
    OverviewComponent,
    PendingComponent,
    PostEditComponent,
    CustomerEditComponent,
    EventEditComponent,
    EventTypePipe,
    UserEditComponent,
    AdminCreateComponent,
    AuthComponent,
    AdminEditComponent,
    UserProfileComponent,
    EventPreviewComponent,
    PostPreviewComponent,
    CustomerPreviewComponent,
    CustomerCreateComponent,
    UserCreateComponent,
    EventCreateComponent,
    PostCreateComponent,
    FillTextareaHeightPipe,
    CustomValidatorsDirective,
    InboxComponent,
    OutboxComponent,
    FavoritesComponent,
    PreferencesComponent,
    TrashComponent,
    MailMenuTempComponent,
    AddComponentDirective,
    DashboardModelComponent,
    MailCreateComponent,
    AdminRegistrationComponent,
    LogInDirectiveDirective,
    CustomerToHebPipe,
    CardComponent,
    ResourcesNameConvertorPipe,
    MainComponent,
    MapByPipe,
    SlugPipe,
    RolesComponent,
    SettingsComponent,
    DashboardAdminComponent,
    GenerateIdPipe,
    // SendMessageDirectiveDirective,
    // customValidatorFnFactory
    // ConcatFormComponent,
    // CustomerComponent
  ],

  imports: [
    BrowserModule,
    HttpClientModule,

    // NgxPopper,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    /***** modules imports start here ****/

    SharedModuleModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
    }),

    /***** modules imports end ****/
    PagesRoutingModule,
    QuillModule.forRoot({
      scrollingContainer: "html"
    }),

    // NgbModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['http://ethio:8080/api/'],
        blacklistedRoutes: ['example.com/examplebadroute/']
      }
    })
  ],
  providers: 
  [ 
    CustomersDataService, CustomersResolver, CanDeactivateGuardService,
    { provide: ErrorHandler, useClass: ErrorsHandler}
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    CustomerPreviewComponent, CustomerEditComponent, CustomerCreateComponent,
    EventPreviewComponent, EventEditComponent, EventCreateComponent,
    PostCreateComponent, PostPreviewComponent, PostEditComponent,
    AdminPreviewComponent, AdminEditComponent, AdminCreateComponent,
    UserProfileComponent, UserEditComponent, UserCreateComponent, ContactComponent
  ]
})
export class AppModule { }