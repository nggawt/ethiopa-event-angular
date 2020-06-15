import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
// import { messagesProps, MessegesKInterface } from '../customers/messages-interface';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private messages: {
    errors: {} |  boolean,// {kk:{}[]}
    success?: {} |  boolean,
    status: boolean,
  } = {
    errors: false, 
    success: false,
    status: true,
  };
  private conHeb: object = {
    name:'שם', date: 'תאריך', time: 'שעה', eventType: 'סוג אירוע', email: 'אימייל', location: 'מיקום',
    city: 'עיר', subject: 'נושא', message: 'הודעה', area: 'אזור', phone:'טלפון/פלאפון', description: "הודעה/תיאור",
    descriptions: "הודעה/תיאור", deals: 'מבצעים'
  };
  
  public messagesAttribute = {
    required: "פרמטר חובה.", min: "פרמטר חייב להכיל לפחות ",  max: "פרמטר חייב להכיל מקסימום ", string: "פרמטר שגוי.",
    password: "שגיאת סיסמה", email: "פרמטר חייב להכיל תבנית המתאימה לאימייל", same: "פרמטר חייב להיות תואם לפרמטר סיסמה"
  };

  constructor() {
    // this.messages.errors = {kk:[{type:""},{message:"2"}]};
   }


   initMessages(items: FormGroup){
    this.reset();
    let formControls = items.controls;
     for(let ii in formControls){
      let msg = "פרמטר לא תקף.";
      
      (formControls[ii].valid)? this.genMsgs(ii, 'פרמטר תקף', 'success'): this.genMsgs(ii, msg, 'errors');
     }
     return this.messages;
   }

   reset(){
    this.messages = {
      errors: false,
      status: true,
      success: false
    };
   }

  getMessges(){
    return this.messages;
  }

  // msgType  = errors | success | warning
  // attribute = input | id of input
  // status = inforce validation pass or fail

  genMsgs(attribute:string, message: string, msgType: string, status?){

    let msg =  {[attribute] : [{
      type: msgType,
      message: this.conHeb[attribute]? this.conHeb[attribute]+": "+ message:  message
    }]};
    
    this.messages[msgType]? this.messages[msgType][attribute]? this.messages[msgType][attribute].push(msg[attribute][0]):
    this.messages[msgType][attribute] = msg[attribute]: this.messages[msgType] = msg;
  }

  proccesMessages(evt) {
    let errors = evt['errors'];
    let success = evt['success'];

    let msgsErrors = this.appendTypeMsgs(errors,"errors");
    let msgsSuccess = this.appendTypeMsgs(success,"success");

    let errKeys = Object.keys(msgsErrors);
    let succesKeys = Object.keys(msgsSuccess);
    let msgsKeys = succesKeys.concat(errKeys);

    let messages:any = {};
    msgsKeys.forEach((msgKey) => {

      let messgaeErr = msgsErrors[msgKey];
      let messgae = msgsSuccess[msgKey];

      if(msgsErrors[msgKey] && msgsSuccess[msgKey]){
        messages[msgKey] = [...messgaeErr, ...messgae];
        
      }else{
        let msgs = msgsSuccess[msgKey]? msgsSuccess: msgsErrors[msgKey]? msgsErrors:false;
        
        (msgs && !messages[msgKey])? messages[msgKey] = msgs[msgKey]: [...messages[msgKey], ...msgs[msgKey]];
      }

    });
    return messages;
  }

  protected appendTypeMsgs(messages, type){
    let messageArray = {};
      
      let ob = {};
      for (let ii in messages) {//for in items

        if (Array.isArray(messages[ii]) && messages[ii].length > 0) {
          messageArray[type] = [];
          ob[ii] = {};

          messages[ii].forEach(element => {//foreach items
            if(typeof element == "object" || typeof element == "string") {
              let elem = {};
              if(typeof element == "string"){
                elem[ii] = element;
              }else if(typeof element == "object"){
                elem = element;
              }
              elem['type'] = (type === "errors")? "danger":type;

              messageArray[type].push(elem);
            }
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
