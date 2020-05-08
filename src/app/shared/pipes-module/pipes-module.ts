import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StrSpliterPipe } from './str-spliter.pipe';
import { SplitTextPipe } from './split-text.pipe';
import { MultiSpaceTosingleWhiteSpacePipe } from './multi-space-to-single-white-space.pipe';
import { ResourcesNameConvertorPipe } from './resources-name-convertor.pipe';
import { MapByPipe } from './map-by.pipe';
import { TextToParagraphPipe } from './text-to-paragraph.pipe';
import { RmWhiteSpacePipe } from './rm-white-space.pipe';
import { EventTypeToHebPipe } from './event-type-to-heb.pipe';
import { EventTypePipe } from './event-type.pipe';
import { FillTextareaHeightPipe } from './fill-textarea-height.pipe';
import { CustomerToHebPipe } from './customer-to-heb.pipe';
import { SlugPipe } from './slug.pipe';
import { GenerateIdPipe } from './generate-id.pipe';
import { KeyinObjectPipe } from './keyin-object.pipe';
import { DateHebPipe } from './date-heb.pipe';
import { ArrayToObjects } from './array-to-object.pipe';
// import { TextToParagraphPipe } from './text-to-paragraph.pipe';
@NgModule({
  
  declarations: [
    StrSpliterPipe,
    SplitTextPipe,
    MultiSpaceTosingleWhiteSpacePipe,
    ResourcesNameConvertorPipe,
    MapByPipe,
    TextToParagraphPipe,
    DateHebPipe,
    RmWhiteSpacePipe,
    EventTypeToHebPipe,
    EventTypePipe,
    FillTextareaHeightPipe,
    CustomerToHebPipe,
    SlugPipe,
    GenerateIdPipe,
    KeyinObjectPipe,
    ArrayToObjects
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StrSpliterPipe,
    SplitTextPipe,
    MultiSpaceTosingleWhiteSpacePipe,
    ResourcesNameConvertorPipe,
    MapByPipe,
    TextToParagraphPipe,
    DateHebPipe,
    RmWhiteSpacePipe,
    EventTypeToHebPipe,
    EventTypePipe,
    FillTextareaHeightPipe,
    CustomerToHebPipe,
    SlugPipe,
    GenerateIdPipe,
    KeyinObjectPipe,
    ArrayToObjects
  ],
  providers: [
    
    ]
})
export class PipesModule  { }
