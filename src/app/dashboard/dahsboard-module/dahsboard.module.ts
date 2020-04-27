import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { NgxPaginationModule } from 'ngx-pagination';
import { ChartsModule } from 'ng2-charts';
import { QuillModule } from 'ngx-quill-v2';

/****************** Dashboard components ********************/
import { MainDashboardComponent } from '../main-dashboard/main-dashboard.component';
import { UsersViewsComponent } from '../users-views/users-views.component';
import { EventsViewsComponent } from '../events-views/events-views.component';
import { TasksComponent } from '../tasks/tasks.component';
import { SecurityComponent } from '../settings/security/security.component';
import { PostsViewsComponent } from '../posts-views/posts-views.component';
import { AdminPreviewComponent } from '../admins-views/admin-preview/admin-preview.component';
import { CustomersViewsComponent } from '../customers-views/customers-views.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { AdminsViewsComponent } from '../admins-views/admins-views.component';
import { QuickEditorComponent } from '../quick-editor/quick-editor.component';
import { MailComponent } from '../mail/mail.component';
import { OverviewComponent } from '../overview/overview.component';
import { PendingComponent } from '../pending/pending.component';
import { PostEditComponent } from '../posts-views/post-edit/post-edit.component';
import { CustomerEditComponent } from '../customers-views/customer-edit/customer-edit.component';
import { EventEditComponent } from '../events-views/event-edit/event-edit.component';
import { UserEditComponent } from '../users-views/user-edit/user-edit.component';
import { AdminCreateComponent } from '../admins-views/admin-create/admin-create.component';

import { AdminEditComponent } from '../admins-views/admin-edit/admin-edit.component';
import { UserProfileComponent } from '../users-views/user-profile/user-profile.component';
import { EventPreviewComponent } from '../events-views/event-preview/event-preview.component';
import { PostPreviewComponent } from '../posts-views/post-preview/post-preview.component';
import { CustomerPreviewComponent } from '../customers-views/customer-preview/customer-preview.component';
import { CustomerCreateComponent } from '../customers-views/customer-create/customer-create.component';
import { UserCreateComponent } from '../users-views/user-create/user-create.component';
import { EventCreateComponent } from '../events-views/event-create/event-create.component';
import { PostCreateComponent } from '../posts-views/post-create/post-create.component';

import { OutboxComponent } from '../mail/outbox/outbox.component';
import { FavoritesComponent } from '../mail/favorites/favorites.component';
import { PreferencesComponent } from '../mail/preferences/preferences.component';
import { TrashComponent } from '../mail/trash/trash.component';
import { InboxComponent } from '../mail/inbox/inbox.component';
import { MailMenuTempComponent } from '../mail/mail-menu-temp/mail-menu-temp.component';
import { MailCreateComponent } from '../mail/mail-create/mail-create.component';
import { CardComponent } from '../main-dashboard/card/card.component';
import { MainComponent } from '../main-dashboard/main/main.component';
import { RolesComponent } from '../settings/roles/roles.component';
import { SettingsComponent } from '../settings/settings.component';
import { DashboardAdminComponent } from '../settings/dashboard-admin/dashboard-admin.component';
import { DashboardProfileComponent } from '../settings/dashboard-profile/dashboard-profile.component';
import { CreateRoleComponent } from '../settings/roles/create-role/create-role.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { SharedModuleModule } from 'src/app/shared/shared-module/shared-module.module';
import { TemplateModule } from 'src/app/shared/templates/templateModule.module';
import { PipesModule } from 'src/app/shared/pipes-module/pipes-module';


@NgModule({
  declarations: [
    MainDashboardComponent,
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
    UserEditComponent,
    AdminCreateComponent,
    AdminEditComponent,
    UserProfileComponent,
    EventPreviewComponent,
    PostPreviewComponent,
    CustomerPreviewComponent,
    CustomerCreateComponent,
    UserCreateComponent,
    EventCreateComponent,
    PostCreateComponent,
    InboxComponent,
    OutboxComponent,
    FavoritesComponent,
    PreferencesComponent,
    TrashComponent,
    MailMenuTempComponent,
    MailCreateComponent,
    CardComponent,
    MainComponent,
    RolesComponent,
    SettingsComponent,
    DashboardAdminComponent,
    DashboardProfileComponent,
    CreateRoleComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModuleModule,
    TemplateModule,
    DashboardRoutingModule,
    PipesModule,
    NgxPaginationModule,
    ChartsModule,
    QuillModule.forRoot({
      scrollingContainer: "html"
    }),

  ]
})
export class DahsboardModule { }

/* 
,
  entryComponents: [
    CustomerPreviewComponent, CustomerEditComponent, CustomerCreateComponent,
    EventPreviewComponent, EventEditComponent, EventCreateComponent,
    PostCreateComponent, PostPreviewComponent, PostEditComponent,
    AdminPreviewComponent, AdminEditComponent, AdminCreateComponent,
    UserProfileComponent, UserEditComponent, UserCreateComponent
  ]
*/