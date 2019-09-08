import { NgModule } from '@angular/core';

import { StrSpliterPipe } from './str-spliter.pipe';
import { SplitTextPipe } from './split-text.pipe';
import { MultiSpaceTosingleWhiteSpacePipe } from './multi-space-to-single-white-space.pipe';
// import { TextToParagraphPipe } from './text-to-paragraph.pipe';
@NgModule({
  
  declarations: [
    StrSpliterPipe,
    SplitTextPipe,
    MultiSpaceTosingleWhiteSpacePipe,
    // TextToParagraphPipe// multi-space-to-single-white-space.pipe.ts
  ],
  imports: [
    
  ],
  exports: [
    StrSpliterPipe,
    SplitTextPipe,
    MultiSpaceTosingleWhiteSpacePipe,
    // TextToParagraphPipe
  ]
})
export class PipesModule  { }
