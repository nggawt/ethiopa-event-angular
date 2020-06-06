import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppFormModule } from '../form-module/form-module';
import { SendMessageDirectiveDirective } from '../directives/contact/send-message-directive.directive';

import { AddComponentDirective } from '../directives/add-component.directive'; 
import { CustomValidatorsDirective } from '../directives/custom-validators/custom-validators.directive';
import { SearchDirective } from '../directives/search/search.directive';
import { AuthDirective } from './../directives/auth-directive/auth.directive';
    

@NgModule({
  imports: [
    AppFormModule,
    CommonModule
  ],
  declarations: [
    SendMessageDirectiveDirective,
    AuthDirective,
    AddComponentDirective,
    CustomValidatorsDirective,
    SearchDirective,
  ],
  exports: [
    SendMessageDirectiveDirective,
    AuthDirective,
    AddComponentDirective,
    CustomValidatorsDirective,
    SearchDirective
  ]
})
export class SharedModuleModule { }
