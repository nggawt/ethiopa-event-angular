import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppFormModule } from '../form-module/form-module';
import { SendMessageDirectiveDirective } from '../directives/contact/send-message-directive.directive';

import { LogInDirectiveDirective } from '../directives/log-in/log-in-directive.directive';
import { AddComponentDirective } from '../directives/add-component.directive'; 
import { CustomValidatorsDirective } from '../directives/custom-validators/custom-validators.directive';
import { SearchDirective } from '../directives/search/search.directive';
    

@NgModule({
  imports: [
    AppFormModule,
    CommonModule
  ],
  declarations: [
    SendMessageDirectiveDirective,
    LogInDirectiveDirective,
    AddComponentDirective,
    CustomValidatorsDirective,
    SearchDirective,
  ],
  exports: [
    SendMessageDirectiveDirective,
    LogInDirectiveDirective,
    AddComponentDirective,
    CustomValidatorsDirective,
    SearchDirective
  ]
})
export class SharedModuleModule { }
