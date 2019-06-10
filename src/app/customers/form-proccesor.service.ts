import { Injectable } from '@angular/core';
import { isArray } from 'util';
import { MessagesService } from '../services/messages/messages.service';

@Injectable({
  providedIn: 'root'
})
export class FormProccesorService {

  // private messages:Array<{}>;
  // private rules: {} = {};

  constructor() { }
  
   validate(inputControllers, customer?, key?) {

    let truly = true;
    let err = {};
    let success: any = {};
    
    if (key && customer) {
      let inputs = this.checkInputs(inputControllers, key, customer);
      let inp = inputs['input'];
      let status = inputs['status'];

      success[key] = inp[key];
      err[key] = [inp];

      return {
        'success': status ? success : false,
        'errors': status ? success : err,
        'status': status
      };

    } else {

      let state: boolean = false;

      for (let ii in inputControllers) {// START FOR IN LOOP

        let input = customer? this.checkInputs(inputControllers[ii], ii, customer): this.validateToStore(inputControllers[ii], ii);
        let inputs = input['input'];
        if (!input.status) { truly = false; }

        for (let ii in inputs) {
          if (ii != 'type') err[ii] = [inputs];
        }

        if (input.status) {
          state = true;
          for (let idx in inputs) {
            if (idx != 'type') success[idx] = inputs[idx];
          }
        }
      }//END FOR IN LOOP

      return {
        'success': state ? success : state,
        'errors': err,
        'status': truly
      };
    }
  } 

  validateToStore(input, ii) {
    let gnKey = {
      company: "שם חברה",
      businessType: "סוג העסק",
      contact: "איש קשר",
      email: "אימייל",
      tel: "טלפון",
      address: "כתובת",
      title: "תיאור או כותרת",
      discription: "אודות החברה",
      deals: "מבצעים"
    };

    let inputs = {};
    let isTrue = true;
    let transformHebKey = {};

    if (!gnKey[ii]) {
      return {
        'status': false,
        'input': transformHebKey[ii] = "שגיעה"
      }//isTrue?inputs:transformHebKey
    }

    if (input.touched && input.valid && input.dirty) {
      inputs[ii] = input.value;
      inputs['type'] = "success";
    } else {
      //onsole.log(gnKey[ii]);
      isTrue = false;
      transformHebKey['type'] = "danger";
      transformHebKey[ii] = gnKey[ii] + ": לא תקף.";
    }
    return {
      'status': isTrue,
      'input': isTrue ? inputs : transformHebKey
    }//isTrue?inputs:transformHebKey;
  }

  checkInputs(input, ii, customer) {
    let gnKey = {
      company: "שם חברה",
      businessType: "תחום העסק",
      contact: "איש קשר",
      email: "אימייל",
      tel: "טלפון",
      address: "כתובת",
      title: "תיאור או כותרת",
      discription: "אודות החברה",
      deals: "מבצעים"
    };

    let inputs = {};
    let isTrue = true;
    let transformHebKey = {};
    if (!gnKey[ii]) {
      return {
        'status': false,
        'input': transformHebKey[ii] = "שגיעה"
      }//isTrue?inputs:transformHebKey


    }

    if (input.touched && input.valid && input.dirty && customer[ii] != input.value) {
      inputs[ii] = input.value;
      inputs['type'] = "success";
    } else if (customer[ii] === input.value) {
      //console.log(gnKey[ii]);
      isTrue = false;
      transformHebKey['type'] = "warning";
      transformHebKey[ii] = gnKey[ii] + ": לא ביצעת שינויים כל שהם.";
    } else {
      //onsole.log(gnKey[ii]);
      isTrue = false;
      transformHebKey['type'] = "danger";
      transformHebKey[ii] = gnKey[ii] + ": לא תקף.";
    }

    return {
      'status': isTrue,
      'input': isTrue ? inputs : transformHebKey
    }//isTrue?inputs:transformHebKey;
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

  resetMessages() {

    let promise = new Promise((res, rej) => {
      setTimeout(() => {
        return res({});
      }, 8000);
    });
    return promise;
  }
}
