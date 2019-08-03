import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { AppFormModule } from '../form-module/form-module';
import { ContactComponent } from 'src/app/pages/contact/contact.component';
import { ModelTemplateComponent } from '../templates/model-template/model-template.component';

@NgModule({
  imports: [
    AppFormModule
  ],
  declarations: [
    ContactComponent,
    ModelTemplateComponent
  ],
  exports: [
    ContactComponent,
    ModelTemplateComponent
  ]
})
export class SharedModuleModule { }
