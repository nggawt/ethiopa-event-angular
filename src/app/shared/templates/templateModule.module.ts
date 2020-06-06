import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { AppFormModule } from '../form-module/form-module';
import { ContactComponent } from 'src/app/pages/contact/contact.component';
import { ModelTemplateComponent } from '../templates/model-template/model-template.component'; 
import { DashboardModelComponent } from 'src/app/dashboard/dashboard-model/dashboard-model.component';
import { ResizableTextAreaDirective } from '../directives/resize-textarea/resize-textarea.directive';

@NgModule({
  imports: [
    AppFormModule
  ],
  declarations: [
    ContactComponent,
    ModelTemplateComponent,
    DashboardModelComponent,    
    ResizableTextAreaDirective
  ],
  exports: [
    ContactComponent,
    ModelTemplateComponent, 
    DashboardModelComponent,    
    ResizableTextAreaDirective
  ]
})
export class TemplateModule { }
