import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CustomersResolver } from './customers-resolver.service';
import { RouteGuardService } from '../../services/route-guard/route-guard.service';
import { CanDeactivateGuardService } from '../../services/can-deactivate-guard/can-deactivate-guard.service';

import { CustomersComponent } from './customers.component';
import { CustomerComponent } from './customer/customer.component';
// import { CustomerMediaComponent } from './customer/customer-media/customer-media.component';
import { CustomerAboutComponent } from './customer/customer-about/customer-about.component';
import { CustomerEditComponent } from './customer/customer-edit/customer-edit.component';
import { AllEditComponent } from './customer/customer-edit/all-edit/all-edit.component';
import { MediaEditComponent } from './customer/customer-edit/media-edit/media-edit.component';
import { BasicEditComponent } from './customer/customer-edit/basic-edit/basic-edit.component';
import { EventsEditComponent } from './customer/customer-edit/events-edit/events-edit.component'; 

const customersRouting: Routes = [

  {path: ":name", component: CustomersComponent, resolve: { ctype: CustomersResolver }},
  {// START route customer
    path: ":name/:id", component: CustomerComponent,//, data : { itemType: "users"}
    children: [
      
      { path: 'about', component: CustomerAboutComponent },
      { path: "edit", component: CustomerEditComponent, canActivate: [RouteGuardService],
        children: [
          { path: "all", component: AllEditComponent},//, canDeactivate: [CanDeactivateGuardService]
          { path: "gallery", component: MediaEditComponent},//, canDeactivate: [CanDeactivateGuardService]
          { path: "basic", component: BasicEditComponent},//, canDeactivate: [CanDeactivateGuardService]
          { path: "events", component: EventsEditComponent}//, canDeactivate: [CanDeactivateGuardService]
      ]}
    ]
  }// END route customer
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(customersRouting)
  ],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
