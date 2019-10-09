import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapBy'
})
// should be named "filterBy"
export class MapByPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    let filterBy = args? args[0]: 'confirmed';
    // console.log(value);
    
    return value.filter(item => item.customer? ! item.customer[filterBy]: ! item[filterBy]);
  }

}
