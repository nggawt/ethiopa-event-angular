import { Injectable } from '@angular/core';
import { MessegesVideoInterface, MessegesGalleryInterface, MessegesLoggoInterface, inputsMedia } from './messages-interface';

@Injectable({
  providedIn: 'root'
})

export class FormValidationsService {

  /* **************************** */
  private messages: {
    errors: inputsMedia | boolean,
    success?: inputsMedia | boolean,
  } | boolean = { errors: false, success: true };

  private itemsToSend;
  private customer;
  private filesTodelete?;
  private gallOriginal?;



  validateInit(itemsToSend, filesTodelete?, gallOriginal?, customer?) {
    this.itemsToSend = itemsToSend;
    this.filesTodelete = filesTodelete;
    this.gallOriginal = gallOriginal;
    this.customer = customer;

    /* reset if have allredy any errors */
    this.messages = { errors: false, success: true };

    this.validate();
    return this;
  }

  private validate() {

    let size: number = 0;

    for (let ii in this.itemsToSend) {

      let items = this.itemsToSend[ii];

      /* check validate file type */
      let filesType: inputsMedia | {} = this.validateFilesType(items);
      if (filesType) { }

      /* check validate file size */
      let filesSizes = (1 > 2) ? this.validateFilesSizes(items) : "";
      if (typeof filesSizes == "number") {
        size += filesSizes;

      } else if (filesSizes) { }

      /* check validate file filesCahrLen */
      let charLen = this.validateFilesCharLen(items);
      if (charLen) { }

      /* check validate aqllow charTypes */
      //let chartype = this.validateFilesCharTypes(items);

      /* check validate file unknown-error */
      // this.validateFilesUnknownError(item);

      /* check validate file fix-errors */
      // this.validateFilesFixErrors(item);

    }

    /* check validate total files sizes */
    if (size && this.bigSize(size)) {
      let msg = " נפח הקבצים גדול מידי: " + " " + this.formatBytes(size);
      // let msgsErrs = this.genMsgs("files", msg, 'fileSize', 'danger'), 'errors';
      this.messagesBag(this.genMsgs("files", msg, 'fileSize', 'danger'), 'errors');
    }

    /* check validate file minFile */
    let minFile = this.validateMinMaxFiles();
    if (minFile) { }

    /* check validate file unchange */
    let filesUnchang = this.filesTodelete ? this.validateFilesUnchange() : "";
    if (filesUnchang) { }

  }

  private validateFilesCharTypes(files) {
    let regStr = files[0] ? (/^[a-zA-z]+([a-zA-z\-\._ ]*)(?=\.)[0-9_\-\. ]*?\w*?$/g).test(files[0].name) : "";
    // let Patt = 
    // if(files[0]) console.log(files[0].name);
    // if(files[0]) console.log(regStr);
  }

  private checkCharLen(item, nidle) {
    return item.length > nidle;
  }

  private messagesBag(msgs, type?: string) {
    // let iaArray = Array.isArray(items);
    let attribute = Object.keys(msgs)[0];
    let typeDefualt = type ? type : "errors";

    (this.messages['errors'] && this.messages['errors'].length > 0) ? this.messages['errors'][attribute] ? this.messages['errors'][attribute] = msgs[attribute] :
      this.messages['errors'][attribute].push(msgs[attribute][0]) :
      !this.messages[typeDefualt] ? this.messages[typeDefualt] = msgs : !this.messages[typeDefualt][attribute] ? this.messages[typeDefualt][attribute] = msgs[attribute] :
        this.messages[typeDefualt][attribute].push(msgs[attribute][0]);

    /* (! this.messages[typeDefualt])? this.messages[typeDefualt] = msgs: !this.messages[typeDefualt][attribute]?
     this.messages[typeDefualt][attribute] = msgs[attribute]: this.messages[typeDefualt][attribute].push(msgs[attribute][0]); 
     */
    if (type && type == "errors") this.messages['success'] = false;
  }

  validateFilesCharLen(files) {

    if (files.length > 0) {
      let errOb: object;
      let msgs: string;

      this.getFileObject(files, (file) => {

        if (!this.checkCharLen(file.name.split('.')[0], 2)) {
          msgs = " שם הקובץ קצר מדי " + file.name.split('.')[0];
          if (!errOb) errOb = { [file.target]: [] };

        } else if (this.checkCharLen(file.name, 90)) {
          if (!errOb) errOb = { [file.target]: [] };
          msgs = " שם הקובץ ארוך מדי " + file.name;
        }

        // (errOb && errOb[file.target])? errOb[file.target].push(this.genMsgs(file.target, msgs, "fileMinChrLen", "error")[file.target][0]):"";
        (errOb && errOb[file.target]) ? this.messagesBag(this.genMsgs(file.target, msgs, 'fileCharLen', 'danger'), 'errors') : "";

      });
      return errOb;
    }
  }

  validateFilesUnchange(files?: { gallery: Array<string>, loggo: Array<string>, video: Array<string> }, nidle?: number | string) {
    let errOb: object;
    let msgs: string;

    let fileToDel: Array<string> = files ? Object.keys(files) : Object.keys(this.filesTodelete);
    fileToDel.forEach(item => {
      let itemsToDelete = this.filesTodelete[item];
      let itemToSend = this.itemsToSend[item];
      if (itemsToDelete.length < 1 && itemToSend.length < 1) {
        let itemType = (item == "loggo") ? "לוגו" : (item == "video") ? "וידאו" : "גלריה";
        msgs = itemType + ": לא ביצעת שינויים כל שהם";
        if (!errOb) errOb = {};

        // errOb[item] = this.genMsgs(item, msgs, "unchange", "warning")[item];
        this.messagesBag(this.genMsgs(item, msgs, 'fileUnchange', 'warning'));
      }
    });
    return errOb;
  }

  validateMinMaxFiles(files?: { gallery: Array<string>, loggo: Array<string>, video: Array<string> }, nidle?: number | string) {

    let items: Array<string> = this.itemsToSend ? Object.keys(this.itemsToSend) : Object.keys(this.filesTodelete);
    let errOb: object;

    items.forEach(item => {
      let itemToDelete = this.filesTodelete && this.filesTodelete[item] ? this.filesTodelete[item] : [];
      let itemToSend = this.itemsToSend && this.itemsToSend[item] ? this.itemsToSend[item] : [];

      let msgs: string;
      let itemType = (item == "loggo") ? "לוגו" : (item == "video") ? "וידאו" : "גלריה";
      let convertMsg = (item == "loggo") ? " תמונה" : " וידאו";
      let msgsType = "errors";
      let errorsType = "danger";

      if (item == "loggo" || item == "video") {

        // have update and delete
        // max files validate
        if ((itemToSend.length > 1) && (itemToDelete.length > 1)) {

          msgs = itemType + ": חייב להכיל מקסימום קובץ" + convertMsg + "1.";
        }
        // have update but no delete
        // max files validate
        if ((itemToSend.length > 1) && (itemToDelete.length < 1)) {
          msgs = itemType + ": חייב להכיל מקסימום קובץ" + convertMsg + "1.";
        }
        // have delete but no update
        // min files validate
        if ((itemToSend.length < 1) && (itemToDelete.length > 0)) {
          let itemName = itemToDelete[0].split(item)[1].split('/')[1];
          msgs = "לא ניתן למחוק את " + itemName + " " + itemType + " חייב להכיל לפחות קובץ " + convertMsg + "1.";
        }
        // have no update and delete
        if ((itemToSend.length < 1) && (itemToDelete.length < 1)) {
          msgs = itemType + ":" + " קובץ " + convertMsg + " חסר.";
          msgsType = "warning";
          errorsType = msgsType;
        }
      } else if (item == "gallery") {
        let gallFiles = this.gallOriginal && this.gallOriginal.length ? this.gallOriginal.length : 0;
        let totalItems: number = (gallFiles - itemToDelete.length) + itemToSend.length;

        if ((totalItems < (nidle || 3))) {
          msgs = itemType + " :" + " חייב מינימום 3 קבצי תמונה";
        } else if (totalItems > (nidle || 12)) {
          msgs = itemType + ":" + " חייב להכיל מקסימום 12 קבצי תמונה בלבד.";
        }
      }
      msgs ? this.messagesBag(this.genMsgs(item, msgs, 'minMaxFile', errorsType), msgsType) : '';
    });
    return errOb;
  }

  geAlltMessges() {
    return this.messages;
  }

  formatBytes(a) {
    if (0 === a) return "0 Bytes";
    var c = 1024, d = 2,
      e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
  }


  genMsgs(attribute: string, message: string, fileType?: string, msgType?: string) {

    let msg = {
      [attribute]: [{
        type: msgType,
        [fileType]: message,
      }]
    };
    return msg;
  }

  getFileObject(files, callBacked) {

    files.forEach(item => {
      callBacked(item);
    });
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
        (!trueOrFalse && errOb[file.target]) ? this.messagesBag(this.genMsgs(file.target, msg, 'fileType', 'danger'), 'errors') : "";

      });
    }
    return errOb;
  }

  validateFilesSizes(files) {
    let filesSize: number = 0;
    let errOb: object;
    let msg: string;

    if (files.length > 0) {
      this.getFileObject(files, (file) => {

        let isBigSize = this.bigSize(file['size']);
        if (isBigSize) {
          msg = " נפח הקובץ גדול מידי: " + file.name + " " + this.formatBytes(file['size']);

          if (!errOb) errOb = { [file.target]: [] };
          // (errOb[file.target].length > 0)? errOb[file.target].push(this.genMsgs(file.target, msg, 'fileSize', 'danger'), 'errors'[file.target][0]):
          //                                  errOb = this.genMsgs(file.target, msg, 'fileSize', 'danger'), 'errors';
          (errOb[file.target]) ? this.messagesBag(this.genMsgs(file.target, msg, 'fileSize', 'danger'), 'errors') : "";
        }

        if (file['size'] > 0) filesSize += file['size'];
      });

      if (errOb && Object.keys(errOb).length > 0) return errOb;
      return filesSize;
    }


    return false;
  }

  bigSize(size) {
    return (Math.round(size / Math.pow(1024, 2)) > 6) ? true : false;
  }

  getMessages(evt) {
    let errors = evt['errors'];
    let success = evt['success'];
    let msgsErrors = this.appendTypeMsgs(errors, "errors");
    let msgsSuccess = this.appendTypeMsgs(success, "success");

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

  appendTypeMsgs(messages, type) {
    let messageArray = {};

    let ob = {};
    for (let ii in messages) {//for in items

      if (Array.isArray(messages[ii]) && messages[ii].length > 0) {
        messageArray[type] = [];
        ob[ii] = {};

        messages[ii].forEach(element => {//foreach items
          if (typeof element == "object" || typeof element == "string") {
            let elem = {};
            if (typeof element == "string") {
              elem[ii] = element;
            } else if (typeof element == "object") {
              elem = element;
            }
            elem['type'] = (type === "errors") ? "danger" : type;

            messageArray[type].push(elem);
          }
        });//end for each
        ob[ii] = messageArray[type];
      }
    }//end for in
    return ob;
  }

  resetMessages() {

    let promise = new Promise((res, rej) => {
      setTimeout(() => {
        return res([]);
      }, 8000);
    });
    return promise;
  }
}
