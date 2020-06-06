import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'strSpliter'
})
export class StrSpliterPipe implements PipeTransform {

  transform(value: string , args?: string ): string {

    let Spliter = args? args: ' ';

    return (value.split(Spliter)[1])? value.split(Spliter)[0] + "-"+ value.split(Spliter)[1]: value;
    
  }

}
