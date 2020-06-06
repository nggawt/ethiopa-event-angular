import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitText'
})
export class SplitTextPipe implements PipeTransform {

  transform(value: any, args?: any, pos?:any ): string | boolean {
    
    if(value){
      let spliter = args? args: ' ',
        split = value.split(spliter),
        defaultPos = (split.length - 1),
        paramPos = (pos || pos === 0)? pos: defaultPos;

      return split[paramPos];
    }
    return value;
  }
}
