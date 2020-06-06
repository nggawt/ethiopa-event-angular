import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fillTextareaHeight'
})
export class FillTextareaHeightPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log("pipe: " , value, " pipe: " , args);
    
    args.style.height = '0px';     //Reset height, so that it not only grows but also shrinks
    args.style.height = (args.scrollHeight+10) + 'px'; 
        // this.attachEvents(args)
    args.setSelectionRange(0, 0);
    args.focus();
    // return value;
  }

}
