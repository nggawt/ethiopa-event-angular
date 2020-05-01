import { Injectable } from '@angular/core';

declare var $: any;

@Injectable({
  providedIn: 'root'
})

export class FormFilesProccesorService {
  /* **************************** */


  /* **************************** */

  constructor() { }


  async createFilesOb(urls) {
    let files = [];

    for await (let url of urls) {

      if (await url) {
        let targetGal = url && (url.indexOf('gallery') >= 0) ? 'gallery/' : false;
        let targetImage = url && (url.indexOf('images') >= 0) ? 'images/' : false;

        let targetVid = url && (url.indexOf('video') >= 0) ? 'video/' : false;
        let targetLoggo = url && (url.indexOf('loggo') >= 0) ? 'loggo/' : false;

        let target = targetGal ? targetGal : targetVid ? targetVid : targetImage ? targetImage : targetLoggo ? targetLoggo : false;
        let promise = await this.createItemsObj(url, target);
        // if (target == "video/") {
          
          //   promise = await this.createItemsObj(url);
          //   console.log(promise);
          
          // } else {
            //   promise = await this.vidToOb(url);
            // }
            
        console.log(promise);
        if (target && promise) promise['name'] =  url.split(target)[1];
        promise['exisst'] = await true;
        files = await [...files, promise];
      }

    }
    return files;
  }

  async createItemsObj(elem, target) {

    var imageUrl = elem,
      thiz = this,
      blob = null,
      xhr = await new XMLHttpRequest();

    await xhr.open('GET', imageUrl, true);
    xhr.responseType = 'blob';

    let pr = new Promise((res, rej) => {

      xhr.onload = async function (event) {


        if (target == "video/") {

          blob = await xhr.response;
          
          blob ? res(blob) : rej('no data');

        } else if ((await this.readyState == 4 && this.status == 200)) {
          blob = await xhr.response;
          blob ?  res(blob) : rej('no data');
        }
      }
    });
    await xhr.send();
    return pr;
  }

  conFromReader(xhr) {
    var reader = new FileReader();
    reader.readAsDataURL(xhr.response);
    
    let pr = new Promise((res, rej) => {
      reader.onload = async function (event) {
        let resualt = await event.target.result;
        resualt ? await res(resualt) : rej('no data');
      }
    });
    return pr;
  }

  async vidToOb(MY_URL) {
    var request = new XMLHttpRequest();
    var blob = null;

    request.open('GET', MY_URL, true);
    request.responseType = 'blob';

    let pr = new Promise((res, rej) => {
      request.onload = function () {
        var reader = new FileReader();
        reader.readAsDataURL(request.response);

        // reader.onload = function (e) {
        //   console.log('DataURL:', e.target.result);
        //   return e.target.result;
        // };

        reader.onload = function (event) {
          // if (this.readyState == 4) {
          blob = event.target.result;
          console.log(blob);

          return blob ? res(blob) : rej('no data');
          // }
        }
      };

    });
    request.send();
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


  ///////////////////////////////////
  //////////////////////////////////
  /* future remove fn\'s */
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

  concatFilesToDelete(delFiles) {
    let toDelete: Array<string> = [];
    for (let ii in delFiles) {
      let fdeleteLen = delFiles[ii] && delFiles[ii].length > 0;
      if (!fdeleteLen) continue;
      (toDelete && toDelete.length > 0) ? delFiles[ii].concat(toDelete) : toDelete = delFiles[ii];
    }
    return toDelete ? toDelete : [];
  }

  getUrl(customer) {
    if (customer && customer['company']) {
      let comp = (customer['company'].indexOf(' ') >= 0) ? customer['company'].split(' ')[0]
        + "-" + customer['company'].split(' ')[1] : customer['company'];

      let company = (comp === "ארמונות-לב") ? 'palace-lev' : comp;
      let urls: string = customer['businessType'] + "/" + company;
      return urls;
    }
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

  concatArrs(obArr, isTrue?) {

    let concatArrays: Array<{}>[] = [];
    for (let ii in obArr) {

      if (Array.isArray(obArr[ii]) && obArr[ii].length) {
        obArr[ii].forEach(elem => {
          if (!elem.exisst) concatArrays.length > 0 ? concatArrays = concatArrays.concat(elem) : concatArrays.push(elem);
        });
      }
    }
    return concatArrays;
  }

  extractSendingFiles(filesOb) {
    let attrOb = {};

    for (let ii in filesOb) {

      attrOb[ii] = filesOb[ii].filter(elem => {
        return !elem.exisst;
      });
    }
    return attrOb;
  }

  handelInputFiles(ar1, arg2, arg3, arg4) {

  }

  handleFilesBeforSend() { }
}


