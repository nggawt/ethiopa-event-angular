import { Injectable } from '@angular/core';
import { FormValidationsService } from 'src/app/customers/form-validations.service';
import { FormFilesProccesorService } from 'src/app/customers/form-files-proccesor.service';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class FormFilesAndInputsProccesorService {

  private galleries: any;
  private videos: any;
  private guard = {};

  public arrayFlies: {} = {
    'gallery': [],
    'video': [],
    'loggo': []
  };

  private filesDl: {} = {
    'loggo': [],
    'video': [],
    'gallery': []
  };

  customer;
  method:string = "post";

  private messages: {} = {};

  constructor(
    private formFiles: FormFilesProccesorService,
    private filesValidator: FormValidationsService) { }

  ngOnInit() { }

  initApp(customer) {

    if (customer && customer['gallery']) {
      let gal = customer['gallery'];
      let cu = customer['customer'];

      this.galleries = gal['image'];
      this.videos = gal['video'];
      this.customer = cu;
      this.galleryInit();
    }
  }

  async galleryInit() {

    let imgs = await this.formFiles.createFilesOb(this.galleries);
    let vid = await this.formFiles.createFilesOb(this.videos);
    let loggo = await this.formFiles.createFilesOb([this.customer.loggo]);

    this.selectedFiles(imgs, 'gallery');
    this.selectedFiles(vid, 'video');
    this.selectedFiles(loggo, 'loggo');
  }

  reset() {
    ['loggo', 'video', 'gallery'].forEach((el) => {

      this.galReset(el);
    });
  }

  resetToDefualt(fdel?, filesToSend?) {

    fdel = fdel ? fdel : this.filesDl;

    for (let item in fdel) {
      let galLen: boolean = (filesToSend && filesToSend[item] && item == "gallery") ? ((this.galleries.length + filesToSend[item].length) - (fdel[item].length) < 3) :
        (item == "gallery" && fdel[item].length) ? true : false;// || (this.findItemInArrayFiles(item, false, true)

      let loggoAndVideoDel = (item == "loggo" || item == "video") && (fdel[item].length && (!filesToSend[item] || filesToSend[item].length === 0));

      if (galLen || loggoAndVideoDel) {

        console.log("inside resetToDefualt FN!");
        this.galReset(item);
        this.galDefault(item);
      }
    }
  }

  galReset(item?, type?) {

    let input = (typeof item === "string") ? document.getElementById(item) : false;
    let elem = input ? input.parentElement.nextElementSibling : item;
    let childrens = elem.querySelectorAll('A');

    for (let ii = 0, len = childrens.length; ii < len; ii++) {
      this.unSelectFiles(childrens[ii]);
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

    let item = galType === "gallery" ? await this.formFiles.createFilesOb(this.galleries) :
      galType === "loggo" ? await this.formFiles.createFilesOb([this.customer.loggo]) :
        galType === "video" ? await this.formFiles.createFilesOb(this.videos) : false;

    if (item) {
      await this.selectedFiles(item, galType);
      this.filesDl[galType] = [];
    }
  }

  findItemInArrayFiles(type, arr?, exisst?) {

    let mySerchArray = (arr && arr[type]) ? arr[type] : arr && Array.isArray(arr) ? arr : this.arrayFlies[type];

    let item = exisst ? mySerchArray.find(elem => {
      return elem.target == type && !elem['exisst'];
    }) : mySerchArray.find(elem => {
      return elem.target == type;
    });

    return item;
  }

  buildSendingFiles(fUp, fDel, customer) {
    let fData: FormData = new FormData();
    let keys = Object.keys(fUp);
    let extractTargetName: string;

    if (fUp) {
      keys.forEach(key => {
        let itemes = fUp[key].slice(0);
        
        this.filesValidator.getFileObject(itemes, (file) => {
          let splUrl = this.formFiles.getUrl(customer).split('/');
          extractTargetName = key + ":" + splUrl[0] + ':' + splUrl[1] + ":" + file.target + ":" + file.name.split('.')[0];

          fData.append('files[]', file, extractTargetName);

        });
      });
    }
    fDel ? fData.set('filesToDelete', JSON.stringify(fDel)) : "";
    return fData;
  }

  handleFilesBeforSend(filesToSend?, filesDel?) {

    /****** handel form files and validate *****/
    filesToSend = filesToSend ? filesToSend : this.formFiles.extractSendingFiles(this.arrayFlies);
    filesDel = filesDel ? filesDel : this.filesDl;
    let validator = this.filesValidator.validateInit(filesToSend, filesDel, this.galleries, this.customer);

    let messages = validator.geAlltMessges();

    let filesToDel: {} | boolean = (filesDel['gallery'] && filesDel['gallery'].length || filesDel['video'] && filesDel['video'].length || filesDel['loggo'] && filesDel['loggo'].length) ? filesDel : false;
    let haveFilesToSend: boolean = (filesToSend['gallery'] && filesToSend['gallery'].length || filesToSend['video'] && filesToSend['video'].length || filesToSend['loggo'] && filesToSend['loggo'].length) ? true : false;

    return {
      filesToSend: haveFilesToSend ? filesToSend : false,
      validator: validator,
      filesToDelete: filesToDel,
      haveFilesToSend: haveFilesToSend,
      messages: messages
    };
  }

  getUrl(param){
    return this.formFiles.getUrl(param);
  }

  selectedFiles(event, elemTarget) {

    let files = event.target;
    let targetElement = $('input.' + elemTarget)[0].parentElement.nextElementSibling;

    if (this.guard[elemTarget] == elemTarget) {
      console.log("You cant uplaod twise " + elemTarget);
      console.log(this.guard);
      return false;
    }

    if ((elemTarget !== "gallery") && !this.guard[elemTarget]) this.guard[elemTarget] = elemTarget;

    files = files && files.files ? files.files : event;

    for (let file of files) {// start for of loop

      let elemName = file.name.split('.')[0];
      file.id = elemName + '_' + file.size;
      file.target = elemTarget;

      if (!this.formFiles.fileContains(this.arrayFlies[file.target], file)) {

        this.formFiles.filseReader(file).then(res => {

          let elemOb = this.formFiles.createElements(res);
          elemOb['atag'].addEventListener("click", this.unSelectFiles.bind(this));
          this.arrayFlies[file.target].push(elemOb['theElem']);
          targetElement.appendChild(elemOb['elemDiv']);
          this.toggleHiddenMediaBox(targetElement, targetElement.children);
        },
          (error) => {
            console.log(error);
          });
      }
    }//END for loop
  }

  unSelectFiles(evt) {

    let aTag = evt && evt.target ? evt.target.parentElement : evt;

    let div = aTag.parentElement;
    let parent = div.parentElement;
    let childrens = parent.children;

    let target = aTag.getAttribute('data-target');
    let input = <HTMLInputElement>document.getElementById(target);
    (input.value) ? input.value = "" : "";

    console.log("aTag.id: ", aTag.id, "target: ", target, "this.arrayFlies: ", this.arrayFlies);

    if(this.method == "update") this.updateFileTodelete(target, aTag.id);
    if ((target == "loggo") || (target == "video")) this.guard[target] = false;

    for (let ii = 0, len = childrens.length; ii < len; ii++) {

      if (childrens[ii] && aTag.id === childrens[ii].id) {

        this.arrayFlies[target] = this.formFiles.removeItem(this.arrayFlies[target], childrens[ii]);
        parent.removeChild(childrens[ii]);
        break;
      }
    }
    this.toggleHiddenMediaBox(parent, childrens);
  }

  toggleHiddenMediaBox(parent, ch) {
    // console.log("hidden: ", $(parent).is(":hidden"),"visible: ", $(parent).is(":visible"));
    ch.length && $(parent).is(":hidden") ? $(parent).show() : !ch.length && $(parent).is(":visible") ? $(parent).hide() : '';
  }

  updateFileTodelete(target, id){
    if ((target == "loggo") || (target == "video") && this.filesDl[target]) {
      let LinksToVideoOrloggo = this.findElemLinks(id, target);

      (LinksToVideoOrloggo != this.filesDl[target][0]) ? this.filesDl[target].push(LinksToVideoOrloggo) : "";
    }

    if (target == "gallery") {
      
      let linnkName = this.findElemLinks(id, target);
      let galLinksExists = this.findItemInArrayFiles(target, this.filesDl[target]);

      (linnkName && !galLinksExists) ? this.filesDl['gallery'].push(linnkName) : "";
    }
  }

  private findElemLinks(id, target) {

    let ob = this.arrayFlies[target].find(elem => elem['id'] == id);
    let item = (ob && target == 'gallery') ? this.galleries.find(el => el.indexOf(ob.name) >= 0) :
      (ob && target == 'video') ? this.videos.find(el => el.indexOf(ob.name) >= 0) : (ob && target == 'loggo') ? this.customer.loggo : false;

    return item;
  }
}
