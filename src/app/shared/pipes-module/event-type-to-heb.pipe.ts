import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventTypeToHeb'
})
export class EventTypeToHebPipe implements PipeTransform {

  transform(value: string, args?: any): any {

    return (value == "bar-mitzvah")? "בר\\בת-מצווה": (value == "hina")? "חינה": (value == "wedding")? "חתונה": value;
  }

}
