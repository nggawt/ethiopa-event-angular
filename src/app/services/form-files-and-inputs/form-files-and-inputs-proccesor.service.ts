import { Injectable } from '@angular/core';
import { FormValidationsService } from 'src/app/customers/form-validations.service';
import { FormFilesProccesorService } from 'src/app/customers/form-files-proccesor.service';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class FormFilesAndInputsProccesorService {

  public galleries: any;
  public videos: any;
  formIns: FormGroup;

  public guard = {};
  public arrayFlies: {} = {
    'images': [],
    'video': [],
    'loggo': []
  };

  public filesDl: {} = {
    'loggo': [],
    'video': [],
    'images': []
  };

  customer;
  method: string = "post";

  messages: {} = {};

  constructor(
    private formFiles: FormFilesProccesorService,
    private filesValidator: FormValidationsService) { }

  initApp(customer, formIns, method: string) {
    this.restIns();
    this.formIns = formIns;
    this.method = method;

    if (customer && customer['gallery']) {
      let gal = customer['gallery'];
      this.method = "update";
      this.galleries = typeof gal['image'] == "object" ? Object.keys(gal['image']).map(item => gal['image'][item]) : gal['image'];
      this.videos = gal['video'];
      this.customer = customer['customer'];
      this.galleryInit();
    }
  }

  restIns(): void {
    this.arrayFlies = { 'images': [], 'video': [], 'loggo': [] };
    this.guard = {};
    this.filesDl = { 'loggo': [],'video': [],'images': []};
    this.messages = {};
    this.galleries = {};
    this.videos = {};
  }

  handleFilesBeforSend() { }

  async galleryInit() {

    let imgs = await this.formFiles.createFilesOb(this.galleries);
    let vid = await this.formFiles.createFilesOb(this.videos);
    let loggo = await this.formFiles.createFilesOb([this.customer.loggo]);

    this.selectedFiles(imgs, 'images');
    this.selectedFiles(vid, 'video');
    this.selectedFiles(loggo, 'loggo');
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

  extractDelFiles(delFiles?) {
    let del = delFiles ? delFiles : this.filesDl,
      delFilesLink = {};

    this.getFileObject(Object.keys(del), (item) => {
      if (del[item].length) delFilesLink[item] = del[item];
    });
    return delFilesLink;
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

  rmFromGall(target, item: string) {
    let targetElem = this.formIns.controls[target];
    targetElem.value.forEach((element, idx) => (element.id == item)? (<FormArray>this.formIns.get(target)).removeAt(idx):'');
  }

  addToGall(target, item) {
    (<FormArray>this.formIns.get(target)).push(new FormControl(item));//, [this.validateSize.bind(this), this.validateType, this.validateExsst]
  }

  allTodefault() {

    let controls = this.formIns.controls;
    for (let ii in controls) {
      if (ii == "images" || ii == "loggo" || ii == "video") continue;
      if (controls.hasOwnProperty(ii)) {
        if (controls[ii].value !== this.customer[ii]) {
          if (this.customer[ii]) controls[ii].setValue(this.customer[ii]);
        }
      }
    }
    ['loggo', 'video', 'images'].forEach(el => {

      this.galReset(el);
      this.filesDl[el] = [];
    });
    this.galleryInit();
  }

  galReset(item?, type?) {
    console.log(item, type);

    let input = (typeof item === "string") ? document.getElementById(item) : false;
    let elem = input ? input.parentElement.nextElementSibling : item;
    let childrens = elem.querySelectorAll('A');
    console.log(childrens);

    for (let ii = 0, len = childrens.length; ii < len; ii++) {
      if (childrens[ii] && childrens[ii].id) this.unSelectFiles(childrens[ii]);
      // this.filesDl[childrens[ii].getAttribute('data-target')] = [];
    }
    if (type) type.value = "";
    if (input) input.nodeValue = "";
  }

  async resetMessages() {
    let response = await this.filesValidator.resetMessages();
    this.messages = await response;
    return this.messages;
    /* await this.filesValidator.resetMessages().then(res => {
      this.messages = res;
    }); */
  }

  async galDefault(galType) {
    // galType = typeof galType == "string" ? galType : galType.id.split('-')[0];

    let item = galType === "images" ? await this.formFiles.createFilesOb(this.galleries) :
      galType === "loggo" ? await this.formFiles.createFilesOb([this.customer.loggo]) :
        galType === "video" ? await this.formFiles.createFilesOb(this.videos) : false;

    if (item) {
      await this.selectedFiles(item, galType);
      this.filesDl[galType] = [];
    }
  }

  getFileObject(files, callBacked) {

    files.forEach(item => {
      callBacked(item);
    });
  }

  buildSendingFiles(fUp, fDel, customer?) {

    customer = customer ? customer : this.customer;

    let fData: FormData = new FormData(),
      gal = fUp['gallery'] ? fUp['gallery'] : [],
      inputs = fUp['inputs'] ? fUp['inputs'] : [],
      keys = Object.keys(gal),
      extractTargetName: string,
      isValid: boolean = true;

    if (keys.length && customer.company) {
      keys.forEach(key => {

        this.getFileObject(gal[key], (file) => {

          let splUrl = this.getUrl(customer).split('/');
          extractTargetName = key + ":" + splUrl[0] + ':' + splUrl[1] + ":" + file.target + ":" + file.name.split('.')[0];
          console.log(extractTargetName);

          fData.append('files[]', file, extractTargetName);
        });
      });
    } else {
      if (this.method == "post") isValid = false;
    }
    if (Object.keys(inputs).length) fData.set('formInputs', JSON.stringify(inputs));
    if (fDel) fData.set('filesToDelete', JSON.stringify(fDel));
    
    return isValid ? fData : false;
  }

  getValidatedItems(formItems: FormGroup) {
    let controls = formItems.controls,
      valItems = { gallery: {}, inputs: {} },
      galleryKeys = ['images', 'video', 'loggo'];

    Object.keys(controls).forEach(keyName => {
      /* if galleries set gallery items else set valid inputs items */
      let galObj = (galleryKeys.indexOf(keyName) >= 0) ? this.mapValidated(keyName, formItems) : [];

      (galObj.length) ? valItems['gallery'][keyName] = galObj : controls[keyName].valid ? valItems['inputs'][keyName] = controls[keyName].value : '';
    });
    return valItems;
  }

  protected mapValidated(keyName, formItems: FormGroup) {
    return (<FormArray>formItems.get(keyName)).controls.filter(item => item.valid).map(item => item.value);
  }

  selectedFiles(event, elemTarget) {

    let files = event.target;
    files = files && files.files ? files.files : event;

    // let targetElement = $('input.' + elemTarget)[0].parentElement.nextElementSibling;

    if (this.guard[elemTarget] == elemTarget) {
      console.log("You cant uplaod twise " + elemTarget);
      console.log(this.guard);
      return false;
    }

    if ((elemTarget != "images") && !this.guard[elemTarget]) this.guard[elemTarget] = elemTarget;


    for (let file of files) {// start for of loop
      let splitedName = file.name.split('.');
      let elemName = splitedName[splitedName.length - 1];
      file.id = elemName + '_' + file.size;
      file.target = elemTarget;

      if (!this.fileContains(this.arrayFlies[file.target], file)) {

        this.formFiles.filseReader(file).then(res => {
          // this.formFn(imgs, vid, loggo);
          // let elemOb = this.createElements(res);
          // elemOb['atag'].addEventListener("click", this.unSelectFiles.bind(this));
          this.arrayFlies[file.target].push(res);

          this.addToGall(file.target, res);
          // targetElement.appendChild(elemOb['elemDiv']);
          // targetElement.firstElementChild.setAttribute("formControlName", elemOb['theElem']);
          // this.toggleHiddenMediaBox(targetElement, targetElement.children);
        },
          (error) => {
            console.log(error);
          });
      }
    }//END for loop
  }

  restInput(selectot: string) {
    let input = <HTMLInputElement>document.getElementById(selectot);
    (input && input.value) ? input.value = "" : "";
  }

  unSelectFiles(evt) {

    let aTag = evt && evt.target ? (typeof evt.target == "string") ? evt : evt.target.parentElement : evt,
      div = aTag.parentElement,
      parent = div.parentElement,
      childrens = parent.children,
      target = aTag.getAttribute('target'),
      targetIsVideoOrLoggo = (target == "loggo") || (target == "video");

    if (this.method == "update" && (targetIsVideoOrLoggo || target == "images")) {
      this.updateFileTodelete(target, aTag.id);
    }
    this.rmFromGall(target, aTag.id);

    this.restInput(target);
    if (targetIsVideoOrLoggo) this.guard[target] = false;
    for (let ii = 0, len = childrens.length; ii < len; ii++) {

      if (childrens[ii] && aTag.id === childrens[ii].id) {
        this.arrayFlies[target] = this.removeItem(this.arrayFlies[target], childrens[ii]);
        parent.removeChild(childrens[ii]);
        break;
      }
    }
    this.toggleHiddenMediaBox(parent, childrens);
  }

  toggleHiddenMediaBox(parent, ch) {
    ch.length && $(parent).is(":hidden") ? $(parent).show() : !ch.length && $(parent).is(":visible") ? $(parent).hide() : '';
  }

  updateFileTodelete(target, id) {

    if ((target == "loggo") || (target == "video") && this.filesDl[target]) {
      let link = this.findElemLinks(id, target);
      (link && link != this.filesDl[target][0]) ? this.filesDl[target].push(link) : "";
    }

    if (target == "images") {
      let linnkName = this.findElemLinks(id, target);
      let galLinksExists = this.findItemInArrayFiles(target, this.filesDl[target]);
      (linnkName && !galLinksExists) ? this.filesDl['images'].push(linnkName) : "";
    }
  }

  private findElemLinks(id, target) {

    let ob = this.arrayFlies[target].find(elem => elem['id'] == id);

    console.log(target, id, ob, this.arrayFlies);
    let item = (ob && target == 'images') ? this.galleries.find(el => el.indexOf(ob.name) >= 0) :
      (ob && target == 'video') ? this.videos.find(el => el.indexOf(ob.name) >= 0) : (ob && target == 'loggo') ? this.customer.loggo : false;
    return item;
  }

  findItemInArrayFiles(type, arr?, exisst?) {

    let mySearchArray = (arr && arr[type]) ? arr[type] : arr && Array.isArray(arr) ? arr : this.arrayFlies[type];

    let item = exisst ? mySearchArray.find(elem => {
      return elem.target == type && !elem['exisst'];
    }) : mySearchArray.find(elem => {
      return elem.target == type;
    });
    return item;
  }
}
