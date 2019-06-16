import { Injectable } from '@angular/core';

declare var $: any;

@Injectable({
  providedIn: 'root'
})

export class FormFilesProccesorService {
  /* **************************** */
  

  /* **************************** */

  constructor() {}


  async createFilesOb(urls) {
    let files = [];
    for await (let url of urls) {
      let target = url.indexOf('gallery') >= 0 ? url.indexOf('gallery') :
                       url.indexOf('video') >= 0 ? url.indexOf('video') : url.indexOf('loggo');

      // console.log(url);
                       
      let promise = await this.getElemSizes(url);
      promise['name'] = await url.slice(target + 1).split('/')[1];
      promise['exisst'] = await true;
      files = await [...files, promise];
    }
    return files;
  }

  async getElemSizes(elem) {
    var imageUrl = elem;
    var blob = null;
    var xhr = await new XMLHttpRequest();

    xhr.responseType = 'blob';
    let pr = new Promise((res, rej) => {

      xhr.onload = async function (event) {
        
        if (await this.readyState == 4 && this.status == 200) {
          blob = await xhr.response;
          return blob ? await res(blob) : rej('no data');
        }
      }
    });
    await xhr.open('GET', imageUrl, true);
    await xhr.send();
    return pr;
  }

  filseReader(elem) {

    var reader = new FileReader();
    return new Promise((rs, rj) => {

      reader.onload = (event: any) => {
        if (event.target.readyState === 2) {
          elem.src = event.target.result;
          rs(elem);
        }

        setTimeout(() => {
          if (event.target.readyState < 2) {
            rj("your file damaged");
          }
        }, 3000);
      };
      reader.readAsDataURL(elem);
    });
  }

  formatBytes(a) {
    if (0 === a) return "0 Bytes";
    var c = 1024, d = 2,
      e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
  }

  removeItem(gal, theFile) {

    for (let idx = 0, len = gal.length; idx < len; idx++) {

      if (gal[idx].id === theFile.id) {
        gal.splice(idx, 1);
        break;
      }
    }
    return gal;
  }

  fileContains(gal, theFile) {

    let isTrueOrFalse: any = false;

    for (let idx = 0, len = gal.length; idx < len; idx++) {

      if (gal[idx].id === theFile.id) {
        isTrueOrFalse = true;
      }
    }
    return isTrueOrFalse;
  }

  createElements(elem) {

    let div = document.createElement('DIV');
    let aTag = document.createElement('A');
    let span = document.createElement('SPAN');
    let elemType = elem.type.split("/")[0];

    let itemObj = {};

    aTag.id = elem.id;
    aTag.setAttribute('data-target', elem.target);
    div.id = elem.id;
    div.className = "d-inline-block p-1 m-1 border border-info rounded bg-secondary";

    aTag.className = "close bg-white text-danger";

    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = '&times';
    aTag.appendChild(span);
    div.appendChild(aTag);

    if (elemType === "image") {

      let img = new Image();
      img.src = elem.src;
      // img.className = "border border-info rounded";
      img.setAttribute("height", "90px");
      img.setAttribute("alt", elem.type);
      div.appendChild(img);

    } else if (elemType === "video") {

      let video: any = document.createElement('video');
      let source = document.createElement('source');
      video.controls = true;
      video.height = 90;
      source.type = elem.type;
      source.src = elem.src;
      video.appendChild(source);
      div.appendChild(video);
    }
    itemObj['elemDiv'] = div;
    itemObj['atag'] = aTag;
    itemObj['theElem'] = elem;
    return itemObj;
  }

  concatArrs(obArr, isTrue?){

    let concatArrays: Array<{}>[] = [];
    for(let ii in obArr){

      if(Array.isArray(obArr[ii]) && obArr[ii].length > 0){
        obArr[ii].forEach(elem => {
          if(!elem.exisst) concatArrays.length > 0? concatArrays = concatArrays.concat(elem): concatArrays.push(elem);
        });
      }
    }
    return concatArrays;
  }

  extractSendingFiles(filesOb){
    let attrOb = {};

    for(let ii in filesOb){

      attrOb[ii] = filesOb[ii].filter(elem => {
        return ! elem.exisst;
      }); 
    }
    return attrOb;
  }

  handelInputFiles(items, customer, delFiles? ,gals?) {

    let input: FormData = new FormData();
    let erorrsOb = {status: false};

    let filesToSend = {
      toUpdate: [],
      toDelete: [],
      size: 0
    };

    /****** handel form files inputs *****/
    
    // console.log(items);
    let itemsArray = Array.isArray(items)?items: this.concatArrs(items);
    // console.log(itemsArray);
    
    for (let ii of itemsArray) {

      let extractTargetName = this.getUrl(customer) + "/" + ii.target + "/" + ii.name.split('.')[0];

        /*** file type validation ***/
        let allawTypes = this.checkFilesType(ii);
        if(typeof allawTypes !== "boolean"){

          (erorrsOb[ii.target])? erorrsOb[ii.target].push(allawTypes[ii.target][0]):
              erorrsOb[ii.target] = allawTypes[ii.target];
              erorrsOb['status'] = true;
        }

        /*** files size validation ***/
        if (this.biggerThen(ii.size)) {
          let msgs = this.errorsMsgs(ii.target, ii);
          
          (erorrsOb[ii.target])? erorrsOb[ii.target].push(msgs[ii.target][0]):
              erorrsOb[ii.target] = msgs[ii.target];
              erorrsOb['status'] = true;
        }

        input.append(extractTargetName, ii, ii.name);
        filesToSend['toUpdate'].push(ii);
        filesToSend['size'] += ii.size;
    }
    /*** files sizes validation ***/
    if (!erorrsOb['status'] && this.biggerThen(filesToSend['size'])) {
      let msgs = this.errorsMsgs("files", filesToSend['size']);
      erorrsOb["files"] = msgs["files"];
      erorrsOb['status'] = true;
    }

    /*** min-file validation ***/
    let dellLen = delFiles && delFiles["gallery"]? delFiles["gallery"].length:false;
    if(dellLen){
      let toSendLen = filesToSend['toUpdate'].length;
      let totalLen:Number;
      let vidAndLOggoLen:number = 0;
      
      if(toSendLen) vidAndLOggoLen = filesToSend.toUpdate.filter(el => {
        return el.target == 'loggo' || el.target == 'video';
      }).length;

      totalLen = (gals.length - dellLen) + (toSendLen - vidAndLOggoLen);

      if(totalLen < 4){
        let errOb = {};
        errOb['gallery'] = [{
          type: "danger",
          ['min-files']: "גלריה חייב מינימום 3 קבצים"
        }];
        (erorrsOb['gallery'])? erorrsOb['gallery'].push(errOb['gallery'][0]):
            erorrsOb['gallery'] = errOb['gallery'];
            erorrsOb['status'] = true;
      }
    }
    /*** get messages and validation from files to delete ***/
    if(delFiles){
      let dl = Object.keys(delFiles);
      dl.forEach((item) => {

        let newOb = {[item]: delFiles[item]};
        let itemLen = delFiles[item]? delFiles[item].length:false;
        let errMsgs:{} | boolean;

        if(itemLen > 0 && (item == "loggo" || item == "video")){

          let findEl: {} = filesToSend.toUpdate.find(el => {
            return el.target == item;
          });

          if(! findEl || typeof findEl == "undefined"){
            errMsgs = this.getMessges(newOb);
            erorrsOb['status'] = true;
          }

        }else{
          if(item == "gallery" && delFiles[item].length < 1 && filesToSend['toUpdate'].length < 1){
            errMsgs = this.getMessges(newOb, erorrsOb['status']);
          }else if((item == "video" || item == "loggo") && filesToSend['toUpdate'].length < 1){
            errMsgs = this.getMessges(newOb);
          }
        }

        if(errMsgs) (erorrsOb[item])? erorrsOb[item].push(errMsgs[item][0]):
                                      erorrsOb[item] = errMsgs[item];
      });
    }
    /*** END get messages and validation from files to delete ***/
    
    filesToSend['toDelete'] = this.concatFilesToDelete(delFiles);
    // let validatFiles = this.vlaFiles(filesToSendLen, this.customer, this.filesDl, this.galleries);

    // console.log(items);
    // input.append('filesToUdate', JSON.stringify(filesToSend['toUpdate']));
    return {
      inputs: input,
      toSend: filesToSend,
      errors: erorrsOb
    }
  }

  concatFilesToDelete(delFiles){
    let toDelete: Array<string>= [];
    for(let ii in delFiles){
      let fdeleteLen = delFiles[ii] && delFiles[ii].length > 0;
      if(!fdeleteLen) continue;
      (toDelete && toDelete.length > 0)? delFiles[ii].concat(toDelete): toDelete = delFiles[ii];
    }
    return toDelete? toDelete: [];
  }

  checkFilesType(file){
    let videoType = ['video/3gpp', 'video/H261', 'video/H263', 'video/H264', 'video/JPEG', 'video/mp4', 'video/mpeg'];
    let imageType = ['image/png', 'image/jpeg', 'image/gif'];//.indexOf(files[0].type);.indexOf(files[0].type)
    let errOb = {};
    let typeName = file.type.split('/')[0];
    let typeVal = (typeName == "image")? imageType.indexOf(file.type):
        (typeName == "video")? videoType.indexOf(file.type): false;

    let trueOrFalse = (typeVal >= 0);
    
    trueOrFalse? true : errOb[file.target] = [{
      type: 'danger',
      [typeName]: "סוג הקובץ לא נתמך "+  file.name + " " + file.type
    }];
    return trueOrFalse? trueOrFalse:errOb; 
  }

  getUrl(customer) {
    
    let comp = (customer['company'].indexOf(' ') >= 0) ? customer['company'].split(' ')[0]
     + "-" + customer['company'].split(' ')[1] : customer['company'];

    let company = (comp === "ארמונות-לב") ? 'palace-lev' : comp;
    let urls: string = customer['businessType'] + "/" + company;
    return urls;
  }

  validateFilesSizes(files) {
    let size: number = 0;
    let msgsErrs = {};

    for (let ii in files) {

      let isBigger = this.biggerThen(files[ii]['size']);
      if (isBigger) {

        msgsErrs[ii] = this.errorsMsgs(ii, files[ii])[ii];
      }
      if (files[ii]['size'] > 0) size += files[ii]['size'];
    }

    if (Object.keys(msgsErrs).length > 0) {

      return msgsErrs;
    } else if (this.biggerThen(size)) {
      
      return this.errorsMsgs('files', size)
    }
    return false;
  }

  errorsMsgs(type, elem) {

    let errorsOb = {};
    let msg = (typeof elem === "number") ? " : " + "נפח הקבצים גדול מדי. " + this.formatBytes(elem) :
        " נפח הקובץ גדול מידי: " + (elem['fname'] || elem.name)+ " " + this.formatBytes(elem['size']);

    errorsOb[type] = [{
      size: msg,
      type: 'danger'
    }];
    return errorsOb;
  }

  biggerThen(size) {
    return (Math.round(size / Math.pow(1024, 2)) > 6) ? true : false;
  }

  getMessges(delItemes, existestedErr?) {

    let elems = {};
    for (let item in delItemes) {

      let msgs: string ="";
      let itemType = (item == "loggo") ? "לוגו" : (item == "video") ? "וידאו" : "גלריה";
      let itemName:any = "";

      if ((item == "loggo" || item == "video") && delItemes[item] && delItemes[item].length > 0) {
        
          itemName = delItemes[item][0].split(item)[1].split('/')[1];
          let concatMsg = (item == "loggo") ? " תמונה 1." : " ןידאו 1.";
          msgs = "לא ניתן למחוק את " + itemName + " " + itemType + " חייב להכיל לפחות קובץ " + concatMsg;
          
        elems[item] = [{
          type: "danger",
          [item]: msgs
        }];

      }else if(item == "gallery" && existestedErr){
          
        delItemes[item].forEach((fileName) => {
          let name = fileName.split(item)[1].split('/')[1];
          // let name = fileName? fileName.split(item)[1].split('/')[1]: delItemes[item].splice(idx,1).length;
          if(fileName) itemName += name + ",";
        });
        msgs = "תקן שאר השגיאות לפני " + (itemName? "מחיקת קבצים אלה: " +itemName: "המשך פעולות");

        elems[item] = [{
          type: "danger",
          [item]: msgs
        }];
        
      }else{
        msgs = itemType + ": לא ביצעת שינויים כל שהם";
        elems[item] = [{
          type: "warning",
          [item]: msgs
        }];
      }
    }
    return elems;
  }
}


