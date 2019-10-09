import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'generateId'
})
export class GenerateIdPipe implements PipeTransform {

  transform(value: string, ...args: any[]): string {
    let stringStart = args && args[0]? args[0]: "identifyer";
    return (stringStart + Math.random().toString(36).substring(6));
  }

}
