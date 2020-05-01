import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {
  protected email: RegExp = /^[a-z][a-z]+[a-zA-Z_\d\.]{2,}@[A-Za-z]{3,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$/;
  protected date: RegExp = /^\b((?=0)0[1-9]|(?=[1-9])[1-9]|(?=[1-2])[1-2][0-9]|(?=3)3[0-1])\-((?=0)0[1-9]|(?=[1-9])[1-9]|(?=1)1[0-2]?)\-20((?=1)19|(?=2)2[0-5])$/;
  protected time: RegExp = /^\b((?=0)0[0-9]|(?=1)1[0-9]|(?=2)2[0-3])\:((?=0)0[0-9]|(?=1)1[0-9]|(?=[0-5])[0-5][0-9])$/;
  protected tel: RegExp = /^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})/;
  
  constructor(private jwt: JwtHelperService) { }

  getPatteren(keyType: string): RegExp {
    return this[keyType];
  }

  rendId(keyType?: string): string {
    let stringStart = keyType? keyType: "id";
    return (stringStart + Math.random().toString(36).substring(6));
  }

  slug(value: string, delimiter?: string): string {
    return this.rmUnWantedChars(value).replace(/\s+/g, delimiter?delimiter:'-');
  }

  isExpiredToken() {
    return this.jwt.isTokenExpired(this.jwt.tokenGetter());
  }

  sortItems(items:{}[], dataType: string, order: string){
    items = dataType == "date"? items.map(this.setDateToObj): [];
    return items.sort((itemA, itemB) => (order == "BA")? itemB['date'] - itemA['date']: itemA['date'] - itemB['date']);
  }

  setDateToObj(item: {[key: string]: any}){
    let dt = this.getStringDate(item['date']);
    (dt)? item['date'] = dt: throwError('The date item is invalid: ');
    return item;
  }

  getStringDate(dateStr: string): Date | boolean{
    if(this.date.test(dateStr)){
      let dt = new Date(dateStr);
      return (dt && typeof dt.getTime === 'function')? dt: false; 
    }
    return false;
  }

  rmUnWantedChars(text: string, unWated?: string[]): string {
    let unwantedChars = unWated? unWated: [
      ';', '#', '?', '_', '  ', '*', '(', ')','<','>', '@',
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

  langIsHeb(item: string){
    return item.search(/[\u0590-\u05FF]/);
  }

  itemsToArray(items: {}){
    let arr = [];
    for(let ii in items){
      arr.push(items[ii]);
    }
    return arr;
  }
}
