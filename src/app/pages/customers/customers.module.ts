import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { CustomersRoutingModule } from './customers-routing.module';
import { PipesModule  } from '../../shared/pipes-module/pipes-module';
import { AppFormModule } from '../../shared/form-module/form-module';

/* customers */
import { CustomersComponent } from './customers.component';
/* import { CustomerComponent } from './customers/customer.component';
import { CustomerMediaComponent } from './customers/customer-media/customer-media.component';
import { CustomerAboutComponent } from './customers/customer-about/customer-about.component';
import { CustomerEditComponent } from './customers/customer-edit/customer-edit.component';
import { AllEditComponent } from './customers/customer-edit/all-edit/all-edit.component';
import { BasicEditComponent } from './customers/customer-edit/basic-edit/basic-edit.component';
import { MediaEditComponent } from './customers/customer-edit/media-edit/media-edit.component'; */
import { CustomerComponent } from './customer/customer.component';
import { CustomerMediaComponent } from './customer/customer-media/customer-media.component';
import { CustomerAboutComponent } from './customer/customer-about/customer-about.component';
import { CustomerEditComponent } from './customer/customer-edit/customer-edit.component';
import { AllEditComponent } from './customer/customer-edit/all-edit/all-edit.component';
import { BasicEditComponent } from './customer/customer-edit/basic-edit/basic-edit.component';
import { MediaEditComponent } from './customer/customer-edit/media-edit/media-edit.component';



/* customers */

// import { PipesModule  } from '../../shared/pipes-module/pipes-module';

// import { AppFormModule } from '../../shared/form-module/form-module';
/**** templates ****/
import { CustomerTempComponent } from './templates/customer/customer-temp.component';
import { ConcatFormComponent } from './templates/html-modals/concat-form/concat-form.component';
import { MediaComponent } from './templates/customer/media/media.component';
// import { EditComponent } from './templates/customer/edit/edit.component';
import { EditAllTempComponent } from './templates/customer/edit/all/edit-all-temp.component';
import { EditBasicTempComponent } from './templates/customer/edit/basic/edit-basic-temp.component';
import { EditMediaTempComponent } from './templates/customer/edit/media-edit/edit-media-temp.component';
import { AboutComponent } from './templates/customer/about/about.component';
import { EventsEditComponent } from './customer/customer-edit/events-edit/events-edit.component';
import { EditEventsTempComponent } from './templates/customer/edit/edit-events/edit-events-temp.component';
import { SharedModuleModule } from 'src/app/shared/shared-module/shared-module.module';

/* halls */



@NgModule({
  imports: [
    AppFormModule,
    CustomersRoutingModule,
    PipesModule,
    /* customers */

    CommonModule,
    FormsModule,
    // AppFormModule,
    ReactiveFormsModule,
    // PipesModule,
    RouterModule,
    SharedModuleModule
  ],
  declarations: [
    CustomersComponent,
    CustomerComponent,
    CustomerMediaComponent,
    CustomerAboutComponent,
    CustomerEditComponent,
    AllEditComponent,
    BasicEditComponent,
    MediaEditComponent,
    EventsEditComponent,
    /* customers */
    
    CustomerTempComponent,
    ConcatFormComponent,
    AboutComponent,
    MediaComponent,
    // EditComponent,
    EditAllTempComponent,
    EditBasicTempComponent,
    EditMediaTempComponent,
    EditEventsTempComponent,
  ],
  exports: [
    CustomerTempComponent,
    ConcatFormComponent,
    AboutComponent,
    MediaComponent,
    // EditComponent,
    EditAllTempComponent,
    EditBasicTempComponent,
    EditMediaTempComponent,
    // EditEventsTempComponent
  ]
})
export class CustomersModule { }
