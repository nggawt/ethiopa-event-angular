import { Pipe, PipeTransform } from '@angular/core';
import { HelpersService } from 'src/app/services/helpers/helpers.service';

@Pipe({
  name: 'slug'
})
export class SlugPipe implements PipeTransform {

  constructor(private helpFn: HelpersService){}
  
  transform(value: string, ...args: any[]): any {

    return value && value.length? this.helpFn.slug(value).trim(): '';
  }
}
