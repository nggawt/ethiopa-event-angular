import { Pipe, PipeTransform } from '@angular/core';
import { HelpersService } from 'src/app/services/helpers/helpers.service';

@Pipe({
  name: 'generateId'
})
export class GenerateIdPipe implements PipeTransform {

  constructor(public helpFn: HelpersService){}
  transform(value: string, ...args: any[]): string {
    
    let str = args && args[0]? args[0]: "id";
    return this.helpFn.rendId(str);
  }

}
