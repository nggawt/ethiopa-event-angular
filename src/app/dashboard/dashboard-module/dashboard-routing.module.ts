import { RouteAdminGuardService } from './../../services/route-guard/route-admin-guard.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { MainDashboardComponent } from '../main-dashboard/main-dashboard.component';
import { MainComponent } from '../main-dashboard/main/main.component';
import { AdminsViewsComponent } from '../admins-views/admins-views.component';
import { OverviewComponent } from '../overview/overview.component';
import { UsersViewsComponent } from '../users-views/users-views.component';
import { PostsViewsComponent } from '../posts-views/posts-views.component';
import { CustomersViewsComponent } from '../customers-views/customers-views.component';
import { EventsViewsComponent } from '../events-views/events-views.component';
import { MailComponent } from '../mail/mail.component';
import { FavoritesComponent } from '../mail/favorites/favorites.component';
import { PreferencesComponent } from '../mail/preferences/preferences.component';
import { TrashComponent } from '../mail/trash/trash.component';
import { InboxComponent } from '../mail/inbox/inbox.component';
import { OutboxComponent } from '../mail/outbox/outbox.component';
import { SettingsComponent } from '../settings/settings.component';
import { DashboardAdminComponent } from '../settings/dashboard-admin/dashboard-admin.component';
import { RolesComponent } from '../settings/roles/roles.component';
import { CreateRoleComponent } from '../settings/roles/create-role/create-role.component';
import { DashboardProfileComponent } from '../settings/dashboard-profile/dashboard-profile.component';
import { TasksComponent } from '../tasks/tasks.component';
import { QuickEditorComponent } from '../quick-editor/quick-editor.component';
import { MailsComponent } from '../mail/mails/mails.component';

const routes: Routes = [

  {
    path: '', component: MainDashboardComponent,
    canActivate: [RouteAdminGuardService],
    children: [
      // START dashboard childrens
      // { path: '',   redirectTo: 'main', pathMatch: 'full' },
      { path: '', component: MainComponent },
      { path: 'admins-views', component: AdminsViewsComponent, children: [] },
      { path: 'admins-views/create', component: OverviewComponent, data: { itemType: "admins", comp: 'create' } },
      { path: 'admins-views/:id', component: OverviewComponent, data: { itemType: "admins", comp: 'preview' } },
      { path: 'admins-views/:id/edit', component: OverviewComponent, data: { itemType: "admins", comp: 'edit' } },
      // { path: 'admins-views/:id/edit', component: AdminEditComponent, data : { itemType: "admins"} },

      {
        path: 'users-views', component: UsersViewsComponent, children: [
          { path: 'create', component: OverviewComponent, data: { itemType: "users", comp: 'create' } },
        ]
      },

      { path: 'users-views/:id', component: OverviewComponent, data: { itemType: "users", comp: 'preview' } },
      { path: 'users-views/:id/edit', component: OverviewComponent, data: { itemType: "users", comp: 'edit' } },

      { path: 'articles-views', component: PostsViewsComponent },
      // { path: 'articles-views/create', component: PostCreateComponent, data : { itemType: "articles"} },
      { path: 'articles-views/create', component: OverviewComponent, data: { itemType: "articles", comp: 'create' } },
      { path: 'articles-views/:id/edit', component: OverviewComponent, data: { itemType: "articles", comp: 'edit' } },
      { path: 'articles-views/:id', component: OverviewComponent, data: { itemType: "articles", comp: 'preview' } },

      { path: 'customers-views', component: CustomersViewsComponent },
      { path: 'customers-views/create', component: OverviewComponent, data: { itemType: "customers", comp: 'create' } },
      { path: 'customers-views/:id', component: OverviewComponent, data: { itemType: "customers", comp: 'preview' } },
      { path: 'customers-views/:id/edit', component: OverviewComponent, data: { itemType: "customers", comp: 'edit' } },

      { path: 'events-views', component: EventsViewsComponent },
      { path: 'events-views/create', component: OverviewComponent, data: { itemType: "events", comp: 'create' } },
      { path: 'events-views/:id', component: OverviewComponent, data: { itemType: "events", comp: 'preview' } },
      { path: 'events-views/:id/edit', component: OverviewComponent, data: { itemType: "events", comp: 'edit' } },
      // { path: 'notifications', component: NotificationsComponent },

      /****** mail ******/
      {
        path: 'mail-views', component: MailComponent, children: [
          { path: '', redirectTo: 'mails', pathMatch: 'full' },
          { path: 'inbox', component: InboxComponent },
          { path: 'favorites', component: FavoritesComponent },
          { path: 'preferences', component: PreferencesComponent },
          { path: 'trash', component: TrashComponent },
          { path: 'mails', component: MailsComponent },
          { path: 'outbox', component: OutboxComponent }
        ]
      },

      /****** Settings ******/
      {
        path: 'settings', component: SettingsComponent, children: [
          { path: '', component: DashboardAdminComponent },
          // { path: 'security', component: SecurityComponent },
          { path: 'roles', component: RolesComponent },
          { path: 'roles/create', component: CreateRoleComponent },/* OverviewComponent , data: { itemType: "admins", comp: 'create' } */
          { path: 'preferences', component: DashboardProfileComponent },
          // { path: 'preferences', component: PreferencesComponent },
          // { path: 'trash', component: TrashComponent },
          // { path: 'inbox', component: InboxComponent },
          // { path: 'outbox', component: OutboxComponent }
        ]
      },
      { path: 'task', component: TasksComponent },
      // { path: 'security', component: SecurityComponent },
      { path: 'quick-editor', component: QuickEditorComponent }
    ]// END dashboard childrens
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
