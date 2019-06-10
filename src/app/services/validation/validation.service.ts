
import { Injectable } from '@angular/core';
import { isArray } from 'util';
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

  getMassages(evt) {
    let errors = evt['errors'];
    let success = evt['success'];
    let msgsErrors = this.handleMessages(errors, "errors");
    let msgsSuccess = this.handleMessages(success, "success");

    let errKeys = Object.keys(msgsErrors);
    let succesKeys = Object.keys(msgsSuccess);
    let msgsKeys = succesKeys.concat(errKeys);

    let messages: any = {};
    msgsKeys.forEach((msgKey) => {

      let messgaeErr = msgsErrors[msgKey];
      let messgae = msgsSuccess[msgKey];

      if (msgsErrors[msgKey] && msgsSuccess[msgKey]) {
        messages[msgKey] = [...messgaeErr, ...messgae];

      } else {
        let msgs = msgsSuccess[msgKey] ? msgsSuccess : msgsErrors[msgKey] ? msgsErrors : false;

        (msgs && !messages[msgKey]) ? messages[msgKey] = msgs[msgKey] : [...messages[msgKey], ...msgs[msgKey]];
      }

    });

    return messages;
  }

  /* for(let ii in msgsSuccess){
      if(!msgsErrors[ii]) msgsErrors[ii] = [];
      (msgsErrors[ii].length > 0)? [...msgsErrors[ii], ...msgsSuccess[ii]]: msgsErrors[ii] = msgsSuccess[ii];
    } */

  handleMessages(messages, type) {
    let messageArray = {};

    let ob = {};
    for (let ii in messages) {//for in items

      if (isArray(messages[ii]) && messages[ii].length > 0) {
        messageArray[type] = [];
        ob[ii] = {};

        messages[ii].forEach(element => {//foreach items
          let elem = {};
          if (typeof element == "string") {
            elem[ii] = element;
          } else {
            elem = element;
          }
          elem['type'] = (type === "success") ? type : "danger";

          messageArray[type].push(elem);
        });//end for each
        ob[ii] = messageArray[type];
      }
    }//end for in
    return ob;
  }

  resetMessages(time?) {

    let promise = new Promise((res, rej) => {
      setTimeout(() => {
        return res({});
      }, time || 8000);
    });
    return promise;
  }
}
