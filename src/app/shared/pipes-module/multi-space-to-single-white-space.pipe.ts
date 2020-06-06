import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'MultiSpaceTosingleWhiteSpace'
})
export class MultiSpaceTosingleWhiteSpacePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    //let text = value.replace(/[\r\n\s]+/g, " ");
    let text = value? value.replace(/[^\n]\s{2,}/g, " "): value;

    // let text = value.replace(/[\s]{4,}/g, " ");
    return text;
  }

}
