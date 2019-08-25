import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { AppFormModule } from '../form-module/form-module';
// import { ContactComponent } from 'src/app/pages/contact/contact.component';
import { ModelTemplateComponent } from '../templates/model-template/model-template.component';
import { SendMessageDirectiveDirective } from '../directives/contact/send-message-directive.directive';

@NgModule({
  imports: [
    AppFormModule
  ],
  declarations: [
    // ContactComponent,
    ModelTemplateComponent,
    SendMessageDirectiveDirective,
  ],
  exports: [
    // ContactComponent,
    ModelTemplateComponent,
    SendMessageDirectiveDirective
  ]
})
export class SharedModuleModule { }
