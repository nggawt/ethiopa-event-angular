import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resourcesNameConvertor'
})
export class ResourcesNameConvertorPipe implements PipeTransform {
  protected resourcesNames = {
    en: {
      users: "משתמשים", articles: "מאמרים", customers:"קליינטים", events: "אירועים", messages: "הודעות", forbidden: "חסומים", admins: "מנהלים",
    },
    heb: {
      משתמשים: "users", מאמרים: "articles", קליינטים:"customers", אירועים: "events", הודעות: "messages", חסומים: "forbidden", מנהלים: "admins",
    }
  }
  transform(value: any, ...args: any[]): any {
    
    value = value.trim();
    let key = (args[0])? args[0]: 'en',
    pointer = (key == 'en' || key == 'heb')? this.resourcesNames[key]: false;

    return (value && pointer && pointer[value])? pointer[value]: "name not allow"; 
  }
}
