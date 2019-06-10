import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventType'
})
export class EventTypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return (value == "bar-mitzvah")? 'בר\\בת מצווה':(value == "wedding")? "חתונה": (value == "hina")? "חינה": value;
  }

}
