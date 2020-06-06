import { Injectable } from '@angular/core';
import { MessagesService } from '../messages/messages.service';

@Injectable({
  providedIn: 'root'
})
export class FilesValidatorService {

  // private messages:Array<{}>;
  private rules: {} = {};

  constructor(private messages: MessagesService) { }

  getFileObject(files, callBacked) {

    files.forEach(item => {
      callBacked(item);
    });
  }

  validate(items, itemsRules, original?: {}) {
    this.messages.reset();

    if (!Object.keys(itemsRules).length) {

      Object.keys(items).forEach(item => {
        this.messages.genMsgs(item, "לא ביצעת שינויים כלשהם.", 'warning', "false");
      });

      return this.messages['messages'];
    }
    this.rules = itemsRules;

    for (let ii in this.rules) {
      if (ii == "other") continue;

      if (!items[ii]) continue;

      if (!items[ii].valid) {
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
            (this[rule](items[ii])) ? this.messages.genMsgs(ii, msg, 'errors') : "";
            break;

          case 'string':
            msg = "פרמטר שגוי.";
            console.log(this[rule](items[ii].value));

            (!this[rule](items[ii].value)) ? this.messages.genMsgs(ii, msg, 'errors') : "";
            break;

          case 'min':
            msg = "פרמטר חייב להכיל לפחות ";
            (this[rule](items[ii].value, ruleValue)) ? this.messages.genMsgs(ii, msg + ruleValue + " תווים.", 'errors') : "";
            break;

          case 'max':
            msg = "פרמטר חייב להכיל מקסימום ";
            (this[rule](items[ii].value, ruleValue)) ? this.messages.genMsgs(ii, msg + ruleValue + " תווים.", 'errors') : '';
            break;

          default:
            msg = (this.messages.messagesAttribute[rule]) ? (ruleValue) ? this.messages.messagesAttribute[rule] + ruleValue : this.messages.messagesAttribute[rule] : "שגיאה: ";
            this.messages.genMsgs(ii, msg + (!ruleValue || ruleValue == undefined ? "בלתי צפוייה." : ruleValue), 'errors');
            break;
        }
      });
      let cond = !this.messages['messages']['errors'] || !this.messages['messages']['errors'][ii];
      (cond) ? this.messages['messages']['success'][ii] = items[ii].value : '';
    }
    return this.messages['messages'];
  }

  min(item: string, minNum: number) {
    let strTrimed = this.string(item) ? this.trimQuotes(item).length < minNum : false;
    return strTrimed;
  }

  max(item: string, minNum: number) {
    let strTrimed = this.string(item) ? this.trimQuotes(item).length > minNum : false;
    return strTrimed;
  }

  hasErrorMsg(item) {
    let errorMsg = this.messages.getMessges()['errors'];
    return (errorMsg && errorMsg[item] && errorMsg[item].length) ? true : false;
  }

  string(str: string) {
    return (typeof str == "string")
  }

  required(field) {

    let trimedText = (field && typeof field.value == "string") ? this.trimQuotes(field.value) : typeof field.value;
    if (trimedText == "" || field.value == null) {
      return true;
    } else {
      return false;
    }
  }

  private trimQuotes(str: string) {

    str = str.replace(/\s+/g, "");
    (new RegExp('\'').test(str)) ? str = str.replace(/'/g, "-") : '';
    (new RegExp('\"').test(str)) ? str = str.replace(/"/g, "-") : '';

    return str.replace(/-/g, "");
  }

  fileSize(files) {
    let filesSize: number = 0;
    let errOb: object;
    let msg: string;

    if (files.length > 0) {
      this.getFileObject(files, (file) => {

        let isBigSize = this.bigSize(file['size']);
        if (isBigSize) {
          // msg = " נפח הקובץ גדול מידי: " + file.name + " " + this.formatBytes(file['size']);

          if (!errOb) errOb = { [file.target]: [] };
          // (errOb[file.target].length > 0)? errOb[file.target].push(this.genMsgs(file.target, msg, 'fileSize', 'danger'), 'errors'[file.target][0]):
          //                                  errOb = this.genMsgs(file.target, msg, 'fileSize', 'danger'), 'errors';
          // (errOb[file.target]) ? this.messagesBag(this.genMsgs(file.target, msg, 'fileSize', 'danger'), 'errors') : "";
        }

        if (file['size'] > 0) filesSize += file['size'];
      });

      if (errOb && Object.keys(errOb).length > 0) return errOb;
      return filesSize;
    }


    return false;
  }

  validateFilesType(files) {
    let videoType = ['video/3gpp', 'video/H261', 'video/H263', 'video/H264', 'video/JPEG', 'video/mp4', 'video/mpeg'];
    let imageType = ['image/jpeg', 'image/png', 'image/gif'];
    let errOb: object | boolean;

    if (files.length > 0) {

      this.getFileObject(files, (file) => {
        let typeName = file.type.split('/')[0];
        let typeVal = (typeName == "image") ? imageType.indexOf(file.type) :
          (typeName == "video") ? videoType.indexOf(file.type) : false;

        let trueOrFalse: boolean = (typeVal >= 0);
        let msg: string = "סוג הקובץ לא תקף " + file.name + " " + file.type;

        if (!errOb && !trueOrFalse) errOb = { [file.target]: [] };

        //(!trueOrFalse && errOb[file.target])? errOb[file.target].push(this.genMsgs(file.target, msg, 'fileType', 'danger'), 'errors'[file.target][0]):"";
        // (!trueOrFalse && errOb[file.target]) ? this.messagesBag(this.genMsgs(file.target, msg, 'fileType', 'danger'), 'errors') : "";

      });
    }
    return errOb;
  }

  bigSize(size) {
    return (Math.round(size / Math.pow(1024, 2)) > 6) ? true : false;
  }
}
