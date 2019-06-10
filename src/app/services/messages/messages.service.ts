import { Injectable } from '@angular/core';
// import { messagesProps, MessegesKInterface } from '../customers/messages-interface';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private messages: {
    errors: {} |  boolean,// {kk:{}[]}
    status: boolean,
    success?: {},
  } = {
    errors: false, 
    status: true,
    success: {},
  };
  private conHeb: object = {
    name:'שם',
    date: 'תאריך',
    time: 'שעה',
    eventType: 'סוג אירוע',
    email: 'אימייל',
    address: 'כתובת',
    location: 'מיקום',
    phone:'טלפון/פלאפון',
    description: "הודעה/תיאור"
  }
  public messagesAttribute = {
    required: "פרמטר חובה.",
    min: "פרמטר חייב להכיל לפחות ",
    max: "פרמטר חייב להכיל מקסימום ",
    string: "פרמטר שגוי.",
    password: "שגיאת סיסמה",
    email: "פרמטר חייב להכיל תבנית המתאימה לאימייל",
    same: "פרמטר חייב להיות תואם לפרמטר סיסמה"
  };

  constructor() {
    // this.messages.errors = {kk:[{type:""},{message:"2"}]};
   }

   reset(){
    this.messages = {
      errors: false,
      status: true,
      success: {}
    };
   }

   private setMessages(msgs, type?:string, status?){
    // let iaArray = Array.isArray(items);

    let attribute = Object.keys(msgs)[0];
    let typeDefualt = type? type: "errors";

    (this.messages['errors'] && this.messages['errors'] > 0)? this.messages['errors'][attribute]? this.messages['errors'][attribute] = msgs[attribute]:
      this.messages['errors'][attribute].push(msgs[attribute][0]): 
      ! this.messages[typeDefualt]? this.messages[typeDefualt] = msgs: ! this.messages[typeDefualt][attribute]? this.messages[typeDefualt][attribute] = msgs[attribute]:
      this.messages[typeDefualt][attribute].push(msgs[attribute][0]);

    /* 
    (! this.messages[typeDefualt])? this.messages[typeDefualt] = msgs: !this.messages[typeDefualt][attribute]?
     this.messages[typeDefualt][attribute] = msgs[attribute]: this.messages[typeDefualt][attribute].push(msgs[attribute][0]); 
     */
     if((type && type == "errors") || status == "false") this.messages['status'] = false;
  }

  getMessges(){
    return this.messages;
  }

  genMsgs(attribute:string, message: string, msgType?: string, status?){

    let msg =  {[attribute] : [{
      type: msgType,
      message: this.conHeb[attribute]? this.conHeb[attribute]+": "+ message:  message
    }]};
    this.setMessages(msg, msgType, status);
    return this;
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

  appendTypeMsgs(messages, type){
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
  
  resetMessages(){
    
    let promise = new Promise((res) => {
        setTimeout(()=>{
          return res(false);
        },6000);
    });
    return promise;
  }
}
