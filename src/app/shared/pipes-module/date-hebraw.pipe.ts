import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateHebraw'
})
export class DateHebrawPipe implements PipeTransform {
  private monthStr: string[] = ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"];
  public weekStr: string[] = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

  transform(value: any, args?: any): any {
    
    let dt = new Date(value),
    day = dt.getDate(),
    hebMonth = this.monthStr[dt.getMonth()],
    year = dt.getFullYear();

    if(args == "day") return day;
    if(args == "month") return hebMonth;
    if(args == "year") return year;
    if(args == "full") return day +" ל"+ hebMonth +", בשעה " + dt.getHours()+":"+dt.getMinutes() +", " +year;
  }

}