import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyinObject'
})
export class KeyinObjectPipe implements PipeTransform {

  transform(value: { [key: string]: any }[], ...args: any[]): boolean {
    
    let key = args? args[0]: 'confirmed';
    // console.log(value, args, key in value);
    return key in value;
  }

}
