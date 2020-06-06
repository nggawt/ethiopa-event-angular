import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, NoPreloading } from '@angular/router';
import { DashboardModule } from './dashboard/dashboard-module/dashboard.module';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
// import { LogInComponent } from './auth/log-in/log-in.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { ResetPasswordComponent } from './auth/rest-password/reset-password.component'; 
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
import { LogInComponent } from './auth/log-in/log-in.component'; 


// import { NotificationsComponent } from './dashboard/notifications/notifications.component';
// import { LogOutComponent } from './registrations/log-out/log-out.component';

const routes: Routes = [
  { path: '', component: WellcomeComponent },
  { path: 'users/:id', component: ProfileComponent },
  
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
  { path: 'articles', component: BlogComponent },
  { path: 'articles/:id', component: ShowPostComponent },
  { path: 'articles/:id/create', component: CreatePostComponent },
  { path: 'articles/:id/update', component: UpdatePostComponent },
  { path: 'events', component: EventsSchedulComponent },
  { path: 'deals', component: DealsComponent },
  // { path: 'צור-קשר', component: ContactComponent },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard-module/dashboard.module').then(m => m.DashboardModule) },
  { path: 'customers', loadChildren: () => import('./pages/customers/customers.module').then(m => m.CustomersModule) },

  // { path: "**", component: PageNotFoundComponent}
  { path: "errors-page", component: ErrorPageComponent, data: { errorMsg: "You have page ERRoR" } },
  { path: "**", redirectTo: "/errors-page" }

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, enableTracing: false}) // { preloadingStrategy: PreloadAllModules|NoPreloading}
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }