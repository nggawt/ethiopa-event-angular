import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { AppFormModule } from '../form-module/form-module';
import { ContactComponent } from 'src/app/pages/contact/contact.component';
import { ModelTemplateComponent } from '../templates/model-template/model-template.component'; 
import { DashboardModelComponent } from 'src/app/dashboard/dashboard-model/dashboard-model.component';

@NgModule({
  imports: [
    AppFormModule
  ],
  declarations: [
    ContactComponent,
    ModelTemplateComponent,
    DashboardModelComponent
  ],
  exports: [
    ContactComponent,
    ModelTemplateComponent, 
    DashboardModelComponent
  ],
  entryComponents: [ 
    ContactComponent
  ]
})
export class TemplateModule { }
