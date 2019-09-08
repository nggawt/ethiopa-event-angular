import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customerToHeb'
})
export class CustomerToHebPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return value == "palace-lev"? "ארמונות לב": value == "benistal"? "בניסטל" : value == "golden"? "גולדן": value == "silver"? "סילבר": value;
  }

}
