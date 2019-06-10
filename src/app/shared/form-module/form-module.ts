import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [

  ],
  exports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class AppFormModule { }
