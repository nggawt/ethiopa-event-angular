import { NgModule } from '@angular/core';

import { StrSpliterPipe } from './str-spliter.pipe';
import { SplitTextPipe } from './split-text.pipe';
import { RemoveWhiteSpacePipe } from './remove-white-space.pipe';
// import { TextToParagraphPipe } from './text-to-paragraph.pipe';
@NgModule({
  
  declarations: [
    StrSpliterPipe,
    SplitTextPipe,
    RemoveWhiteSpacePipe,
    // TextToParagraphPipe
  ],
  imports: [
    
  ],
  exports: [
    StrSpliterPipe,
    SplitTextPipe,
    RemoveWhiteSpacePipe,
    // TextToParagraphPipe
  ]
})
export class PipesModule  { }
