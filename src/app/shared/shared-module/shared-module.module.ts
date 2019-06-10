import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { AppFormModule } from '../form-module/form-module';
import { ContactComponent } from 'src/app/pages/contact/contact.component';

@NgModule({
  imports: [
    AppFormModule
  ],
  declarations: [
    ContactComponent
  ],
  exports: [
    ContactComponent
  ]
})
export class SharedModuleModule { }
