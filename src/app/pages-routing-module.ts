import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
// import { LogInComponent } from './auth/log-in/log-in.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { ResetPasswordComponent } from './auth/rest-password/reset-password.component';
import { AdminsViewsComponent } from './dashboard/admins-views/admins-views.component';
import { CustomerEditComponent } from './dashboard/customers-views/customer-edit/customer-edit.component';
import { CustomersViewsComponent } from './dashboard/customers-views/customers-views.component';
import { EventEditComponent } from './dashboard/events-views/event-edit/event-edit.component';
import { EventsViewsComponent } from './dashboard/events-views/events-views.component';
import { MailComponent } from './dashboard/mail/mail.component';
import { MainDashboardComponent } from './dashboard/main-dashboard/main-dashboard.component';
import { OverviewComponent } from './dashboard/overview/overview.component';
import { PostEditComponent } from './dashboard/posts-views/post-edit/post-edit.component';
import { PostsViewsComponent } from './dashboard/posts-views/posts-views.component';
import { QuickEditorComponent } from './dashboard/quick-editor/quick-editor.component';
import { TasksComponent } from './dashboard/tasks/tasks.component';
import { UserEditComponent } from './dashboard/users-views/user-edit/user-edit.component';
import { UsersViewsComponent } from './dashboard/users-views/users-views.component';
import { JoinComponent } from './join/join.component';
import { AboutComponent } from './pages/about/about.component';
// import { ContactComponent } from './pages/contact/contact.component';
import { BlogComponent } from './pages/blog/blog.component';
import { CreatePostComponent } from './pages/blog/create-post/create-post.component';
import { ShowPostComponent } from './pages/blog/show-post/show-post.component';
import { UpdatePostComponent } from './pages/blog/update-post/update-post.component';
import { DealsComponent } from './pages/deals/deals.component';
// import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { EventsSchedulComponent } from './pages/events-schedul/events-schedul.component';
import { GoalComponent } from './pages/goal/goal.component';
import { ProfileComponent } from './pages/profile/profile.component';
/****************** MAIN Pages ********************/
import { WellcomeComponent } from './pages/wellcome/wellcome.component';
import { CanDeactivateGuardService } from './services/can-deactivate-guard/can-deactivate-guard.service';
import { RouteGuardService } from './services/route-guard/route-guard.service';
import { AdminCreateComponent } from './dashboard/admins-views/admin-create/admin-create.component';
import { LogInComponent } from './auth/log-in/log-in.component';
import { CustomerCreateComponent } from './dashboard/customers-views/customer-create/customer-create.component';
import { UserCreateComponent } from './dashboard/users-views/user-create/user-create.component';
import { PostCreateComponent } from './dashboard/posts-views/post-create/post-create.component';
import { EventCreateComponent } from './dashboard/events-views/event-create/event-create.component';
import { InboxComponent } from './dashboard/mail/inbox/inbox.component';
import { OutboxComponent } from './dashboard/mail/outbox/outbox.component';
import { TrashComponent } from './dashboard/mail/trash/trash.component';
import { FavoritesComponent } from './dashboard/mail/favorites/favorites.component';
import { PreferencesComponent } from './dashboard/mail/preferences/preferences.component';


// import { NotificationsComponent } from './dashboard/notifications/notifications.component';
// import { LogOutComponent } from './registrations/log-out/log-out.component';

const routes: Routes = [
  { path: '', component: WellcomeComponent },
  { path: 'users/:id', component: ProfileComponent },
  {
    path: 'dashboard', component: MainDashboardComponent, children: [
      // START dashboard childrens
      { path: 'admins-views', component: AdminsViewsComponent, children: []},
      { path: 'admins-views/create', component: OverviewComponent, data: { itemType: "admins", comp: 'create' } },
      { path: 'admins-views/:id', component: OverviewComponent, data: { itemType: "admins", comp: 'preview' } },
      { path: 'admins-views/:id/edit', component: OverviewComponent, data: { itemType: "admins", comp: 'edit' } },
      // { path: 'admins-views/:id/edit', component: AdminEditComponent, data : { itemType: "admins"} },

      {
        path: 'users-views', component: UsersViewsComponent, children: [
          { path: 'create', component:  OverviewComponent, data: { itemType: "users", comp: 'create' } },
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
      { path: 'customers-views/create', component:  OverviewComponent, data: { itemType: "customers", comp: 'create' } },
      { path: 'customers-views/:id', component: OverviewComponent, data: { itemType: "customers", comp: 'preview' } },
      { path: 'customers-views/:id/edit', component: OverviewComponent, data: { itemType: "customers", comp: 'edit' } },

      { path: 'events-views', component: EventsViewsComponent },
      { path: 'events-views/create', component: OverviewComponent, data: { itemType: "events", comp: 'create' } },
      { path: 'events-views/:id', component: OverviewComponent, data: { itemType: "events", comp: 'preview' } },
      { path: 'events-views/:id/edit', component: OverviewComponent, data: { itemType: "events", comp: 'edit' } },
      // { path: 'notifications', component: NotificationsComponent },

      /****** mail ******/
      {
        path: 'mail', component: MailComponent, children: [
          { path: '',   redirectTo: 'inbox', pathMatch: 'full' },
          { path: 'favorites', component: FavoritesComponent },
          { path: 'preferences', component: PreferencesComponent },
          { path: 'trash', component: TrashComponent },
          { path: 'inbox', component: InboxComponent },
          { path: 'outbox', component: OutboxComponent }
        ]
      },
      
      /* { path: 'mail/favorites', component: FavoritesComponent },
      { path: 'mail/preferences', component: PreferencesComponent },
      { path: 'mail/trash', component: TrashComponent },
      { path: 'mail/inbox', component: InboxComponent },
      { path: 'mail/outbox', component: OutboxComponent }, */
     

      { path: 'task', component: TasksComponent },
      { path: 'quick-editor', component: QuickEditorComponent }
    ]// END dashboard childrens
  },
  { path: 'אודות', component: AboutComponent },
  { path: 'login', component: LogInComponent },
  // { path: 'logout', component: LogOutComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'password/email', component: ForgotPasswordComponent },
  { path: 'password/reset', component: ResetPasswordComponent },
  // { path: 'password/reset', component: ResetPasswordComponent },

  // { path: 'יומן-אירועים', component: clande },
  { path: 'מטרת-האתר', component: GoalComponent },
  {
    path: 'join', component: JoinComponent,
    canActivate: [RouteGuardService],
    canDeactivate: [CanDeactivateGuardService]
  },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:id', component: ShowPostComponent },
  { path: 'blog/:id/create', component: CreatePostComponent },
  { path: 'blog/:id/update', component: UpdatePostComponent },
  { path: 'scedule-events', component: EventsSchedulComponent },
  { path: 'deals', component: DealsComponent },
  // { path: 'צור-קשר', component: ContactComponent },
  { path: 'customers', loadChildren: "./pages/customers/customers.module#CustomersModule" },

  // { path: "**", component: PageNotFoundComponent}
  { path: "errors-page", component: ErrorPageComponent, data: { errorMsg: "You have page ERRoR" } },
  { path: "**", redirectTo: "/errors-page" }

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, enableTracing: false}) // prioload startigy// , { preloadingStrategy: PreloadAllModules}
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }