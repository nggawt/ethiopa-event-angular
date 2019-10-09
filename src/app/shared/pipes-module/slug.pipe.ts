import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slug'
})
export class SlugPipe implements PipeTransform {
  private unwantedChars = [
    ';', '#', '?', '_', '  ', '*', '(', ')','<','>', '@', '.', '%', '&', '=', '-', '+', '!', ':', ',', '{', '}', '[', ']', '`', '~', '$', '^', '/', '|', '\\'
  ];

  transform(value: string, ...args: any[]): any {

    return this.slug(value).trim();
  }

  slug(text: string): string {

    let trimed = text.trim();

    this.unwantedChars.forEach(char => {
      if (this.isContains(trimed, char)) {
        let regex = new RegExp("\\" + char, "gi");
        text = trimed.replace(regex, '');
      }

    });
    text = text.replace(/\s+/g, '-');
    return text;
  }

  isContains(text: string, key) {

    return (text.indexOf(key) >= 0) ? true : false;
  }
}
