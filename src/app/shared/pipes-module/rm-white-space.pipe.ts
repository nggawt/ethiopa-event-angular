import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rmWhiteSpace'
})
export class RmWhiteSpacePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    //let text = value.replace(/[\r\n\s]+/g, " ");
    let text = value.replace(/[^\n]\s/gi, "");

    // let text = value.replace(/[\s]{4,}/g, " ");
    return text;
  }

}
