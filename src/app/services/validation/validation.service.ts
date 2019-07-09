
import { Injectable } from '@angular/core';
import { MessagesService } from '../messages/messages.service';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  // private messages:Array<{}>;
  private rules: {} = {};
  
  constructor(private messages: MessagesService) { }

  validate(items, itemsRules, original?: {}) {
    this.messages.reset();

    if(! Object.keys(itemsRules).length){
      
      Object.keys(items).forEach(item => {
        this.messages.genMsgs(item, "לא ביצעת שינויים כלשהם.", 'warning', "false");
      });
      
      return this.messages['messages'];
    } 
    this.rules = itemsRules;
    
    for (let ii in this.rules) {
      if(ii == "other") continue;
      
      if(! items[ii]) continue;
      
      if(! items[ii].valid){
        this.messages.genMsgs(ii, "פרמטר אינו תקף.", 'errors');
        continue;
      }

      let arrayRules = this.rules[ii].split('|');
      arrayRules.forEach(rule => {

        let ruleValue: number, msg: string;

        if (rule.indexOf(':') != -1) {
          let splitedRule = rule.split(':');
            rule = splitedRule[0].trim();
            ruleValue = +(splitedRule[1].trim());
        }
        switch (rule) {

          case 'required':
            msg = "פרמטר חובה.";
            (this[rule](items[ii])) ? this.messages.genMsgs(ii, msg, 'errors'):"";
            break;

          case 'string':
            msg = "פרמטר שגוי.";
            console.log(this[rule](items[ii].value));
            
            (! this[rule](items[ii].value)) ? this.messages.genMsgs(ii, msg, 'errors'):"";
            break;

          case 'min':
            msg = "פרמטר חייב להכיל לפחות ";
            (this[rule](items[ii].value, ruleValue)) ? this.messages.genMsgs(ii, msg + ruleValue + " תווים.", 'errors'):"";
            break;

          case 'max':
            msg = "פרמטר חייב להכיל מקסימום ";
            (this[rule](items[ii].value, ruleValue)) ? this.messages.genMsgs(ii, msg + ruleValue + " תווים.", 'errors'):'';
            break;

          default:
            msg = (this.messages.messagesAttribute[rule])? (ruleValue)? this.messages.messagesAttribute[rule]+ruleValue:this.messages.messagesAttribute[rule]:  "שגיאה: ";
            this.messages.genMsgs(ii, msg + (!ruleValue || ruleValue == undefined? "בלתי צפוייה.": ruleValue), 'errors');
            break;
        }
      });
      let cond = !this.messages['messages']['errors'] || !this.messages['messages']['errors'][ii];
      (cond)? this.messages['messages']['success'][ii] = items[ii].value:'';
    }
    return this.messages['messages'];
  }

  min(item: string, minNum:number){
    let strTrimed = this.string(item)? this.trimQuotes(item).length < minNum: false;
    return strTrimed;
  }

  max(item: string, minNum:number){
    let strTrimed = this.string(item)? this.trimQuotes(item).length > minNum: false;
    return strTrimed;
  }

  hasErrorMsg(item){
    let errorMsg = this.messages.getMessges()['errors'];
    return (errorMsg && errorMsg[item] && errorMsg[item].length)? true: false;
  }

  string(str: string) {
    return (typeof str == "string")
  }

  required(field) {
   
    let trimedText = (field && typeof field.value == "string")? this.trimQuotes(field.value): typeof field.value;
    if (trimedText == "" || field.value == null) {
      return true;
    } else {
      return false;
    }
  }

  trimQuotes(str: string){

    str = str.replace(/\s+/g, "");
    (new RegExp('\'').test(str))? str = str.replace(/'/g, "-"): ''; 
    (new RegExp('\"').test(str))? str = str.replace(/"/g, "-"): ''; 

    return str.replace(/-/g, "");
  }
}
