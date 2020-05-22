import { NotificationService } from './../messages/notification.service';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthTokens } from 'src/app/types/auth-token-type';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {
  protected email: RegExp | string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
                            // /^[a-z][a-z]+[a-zA-Z_\d\.]{2,}@[A-Za-z]{3,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$/;
                            // '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$'

  protected date: RegExp = /^\b((?=0)0[1-9]|(?=[1-9])[1-9]|(?=[1-2])[1-2][0-9]|(?=3)3[0-1])\-((?=0)0[1-9]|(?=[1-9])[1-9]|(?=1)1[0-2]?)\-20((?=1)19|(?=2)2[0-5])$/;
  protected time: RegExp | string = /^\b((?=0)0[0-9]|(?=1)1[0-9]|(?=2)2[0-3])\:((?=0)0[0-9]|(?=1)1[0-9]|(?=[0-5])[0-5][0-9])$/;
  protected phone: RegExp | string = '^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})';
                            // '^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})';
                            
  protected password: string = '^\\w{6,}$';

  constructor(private jwt: JwtHelperService, private notify: NotificationService) { }

  getPatteren(keyType: string): RegExp | string{
    return this[keyType];
  }

  rendId(keyType?: string): string {
    let stringStart = keyType ? keyType : "id";
    return (stringStart + Math.random().toString(36).substring(6));
  }

  slug(value: string, delimiter?: string): string {
    return this.rmUnWantedChars(value).replace(/\s+/g, delimiter ? delimiter : '-');
  }

  isValidToken(typeName?: string): boolean {
    let userToken;
    if(typeName){
      if (userToken = this.getAuthTokens()) {
        
        let token = userToken[typeName] && userToken[typeName]['token'];  //JSON.parse(userToken)[typeName];
        return (token && ! this.jwt.isTokenExpired(token))? true: false;
      }
      return false;
    }
    return ! this.jwt.isTokenExpired(this.jwt.tokenGetter());;
  }

  getAuthTokens(): AuthTokens | boolean {
    let userToken;
    if (userToken = this.jwt.tokenGetter('tokens')) {
      let parsed = JSON.parse(userToken);
      return parsed? parsed: false;
    }
    return false;
  }

  sortItems(items: {}[], dataType: string, order: string) {
    items = dataType == "date" ? items.map(this.setDateToObj) : [];
    return items.sort((itemA, itemB) => (order == "BA") ? itemB['date'] - itemA['date'] : itemA['date'] - itemB['date']);
  }

  setDateToObj(item: { [key: string]: any }) {
    let dt = this.getStringDate(item['date']);
    (dt) ? item['date'] = dt : throwError('The date item is invalid: ');
    return item;
  }

  getStringDate(dateStr: string): Date | boolean {
    if (this.date.test(dateStr)) {
      let dt = new Date(dateStr);
      return (dt && typeof dt.getTime === 'function') ? dt : false;
    }
    return false;
  }

  rmUnWantedChars(text: string, unWated?: string[]): string {
    let unwantedChars = unWated ? unWated : [
      ';', '#', '?', '_', '  ', '*', '(', ')', '<', '>', '@',
      '.', '%', '&', '=', '-', '+', '!', ':', ',', '{', '}',
      '[', ']', '`', '~', '$', '^', '/', '|', '\\'
    ];

    let cleanText = text.trim();
    unwantedChars.forEach(char => {
      if (this.arrayIsContains(cleanText, char)) cleanText = cleanText.replace((new RegExp("\\" + char, "gi")), '');
    });
    return cleanText;
  }

  arrayIsContains(item: string[] | string, key: string) {
    return (item.indexOf(key) >= 0) ? true : false;
  }

  langIsHeb(item: string) {
    return item.search(/[\u0590-\u05FF]/);
  }

  itemsToArray(items: {}) {
    let arr = [];
    for (let ii in items) {
      arr.push(items[ii]);
    }
    return arr;
  }

  notifyMsg(){
    return this.notify;
  }
  
  /** show successful toast */
  // success(title: string, msg: string){
  //   this.notify.success(msg, title, {positionClass: "toast-bottom-left"});
  // }

  // erros(title: string, msg: string){
  //   this.notify.errors(msg, title, {positionClass: "toast-bottom-left"});
  // }
}
