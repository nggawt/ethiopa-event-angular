import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayToObjects'
})
// should be named "filterBy"
export class ArrayToObjects implements PipeTransform {

  transform(value: any[], ...args: any[]): any {

    let rd = value? value.reduce((tottal, curr) => {
    console.log("tottal ", curr);
    let typeName = Object.keys(curr)[0];
      tottal? tottal[typeName] = curr[typeName]: tottal = curr;
      return tottal;
    }, {}): false;
    console.log("hgjklkj ",value? value.length: value, rd);
    
  }

}
