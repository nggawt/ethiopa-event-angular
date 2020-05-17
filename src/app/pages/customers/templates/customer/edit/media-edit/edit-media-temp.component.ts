import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http-service/http.service';
import { FormValidationsService } from 'src/app/customers/form-validations.service';
import { FormFilesProccesorService } from 'src/app/customers/form-files-proccesor.service'; 
import { FormGroup } from '@angular/forms';
import { HallType } from 'src/app/customers/hall-type';
import { HelpersService } from 'src/app/services/helpers/helpers.service';
import { AuthService } from 'src/app/services/http-service/auth.service';
declare var $: any;


@Component({
  selector: 'edit-media-temp',
  templateUrl: './edit-media-temp.component.html',
  styleUrls: ['../../../../../../styles/style.component.css']
})
export class EditMediaTempComponent implements OnInit{

  @Input() cus:any;
  @Input('formInstans') addCostumerForm:FormGroup;
  @Output() ins: EventEmitter<any> = new EventEmitter<any>();
  customer: HallType;
  /* *********** gallery ***************** */
  private galleries: any;
  private videos: any;
  private guard = {};

  private arrayFlies: {} = {
    'gallery': [],
    'video': [],
    'loggo': []
  };

  private filesDl: {} = {
    'loggo': [],
    'video': [],
    'gallery': []
  };

  messages: {}  = {};

  constructor(private router: Router,
    private http: HttpService,
    private formFiles: FormFilesProccesorService,
    private filesValidator: FormValidationsService,
    private hlFn: HelpersService,
    private auth: AuthService) { }

  ngOnInit() {

      let gal = this.cus['gallery'];
      let cu = this.cus['customer'];

      if(localStorage.getItem('msgs')){
        console.log(localStorage.getItem('msgs'));
        localStorage.clear();
      }

      let cId = (cu && cu["user_id"]) ? cu["user_id"] : false;
      let uId = this.auth.authUser["id"];
      
      if (cId) {
        this.galleries = Array.isArray(gal['images'])? gal['images']: typeof gal['images'] == "object"? this.hlFn.itemsToArray(gal['images']): [];
        this.videos = Array.isArray(gal['video'])? gal['video']: typeof gal['video'] == "object"? this.hlFn.itemsToArray(gal['video']): [];
        this.customer = cu;
        this.galleryInit();
        this.ins.emit({media: this});
      }
  }

  canLeaveThePage(): Observable<boolean> | Promise<boolean> | boolean {
    
    let filesDelLoggo = this.filesDl['loggo'].length >= 1;
    let filesDelGallery = this.filesDl['gallery'].length >= 1;
    let filesDelVideo = this.filesDl['video'].length >= 1;

    let filesToDelete = filesDelGallery || filesDelLoggo || filesDelVideo;

    if (filesToDelete) {
      return true;
    } else {
      return false;
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

  galUpdate(elem, type) {

    let files = elem.files;
    let loggoOrVideo = (type == "loggo" || type == "video");

    (files.length && loggoOrVideo && this.arrayFlies[type].length < 1)? this.selectedFiles(files, type): type == "gallery"? this.selectedFiles(files, type):"";
    let sendFileToproccesor = loggoOrVideo? {[type]: (files.length > 0) ? [files[0]] : []}: this.formFiles.extractSendingFiles({[type]: this.arrayFlies[type]});
    let delFiles = { [type]: this.filesDl[type] };
    console.log(sendFileToproccesor);
    
    /****** handel form files and validate *****/
    let filestObject = this.handleFilesBeforSend(sendFileToproccesor, delFiles);
    let messages = filestObject['messages'];
    

  if(messages['success'] && (filestObject['haveFilesToSend'] || filestObject['filesToDelete'])){

    let fToSend = this.buildSendingFiles(filestObject['filesToSend'], filestObject['filesToDelete']);

    this.send(fToSend, 'PUT');
  }else{
      
    this.messages = messages['errors'];
    
    this.resetToDefualt(delFiles, filestObject['filesToSend']);
    this.resetMessages();
  }
}

  reset() {
    ['loggo', 'video', 'gallery'].forEach((el) => {

      this.galReset(el);
    });
  }

  resetToDefualt(fdel?, filesToSend?) {
    
    fdel = fdel ? fdel : this.filesDl;
    
    for (let item in fdel) {
    let galLen:boolean = (filesToSend && filesToSend[item] && item == "gallery")?  ((this.galleries.length + filesToSend[item].length) - (fdel[item].length) < 3): 
        (item == "gallery" && fdel[item].length)? true: false;// || (this.findItemInArrayFiles(item, false, true)
      
    let loggoAndVideoDel = (item == "loggo" || item == "video") && (fdel[item].length  && (! filesToSend[item] || filesToSend[item].length === 0));
      
      if (galLen || loggoAndVideoDel){
        
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

    /* await this.filesValidator.resetMessages().then(res => {
      this.messages = res;
    }); */
  }

  async galDefault(galType) {

    let item = galType === "gallery" ? await this.formFiles.createFilesOb(this.galleries) :
        galType === "loggo" ? await this.formFiles.createFilesOb([this.customer.loggo]) :
        galType === "video" ? await this.formFiles.createFilesOb(this.videos) : false;

    if(item){
      await this.selectedFiles(item, galType);
      this.filesDl[galType] = [];
    } 
    
  }

  findItemInArrayFiles(type, arr?, exisst?) {

    let mySerchArray = (arr && arr[type])? arr[type]: arr && Array.isArray(arr)? arr: this.arrayFlies[type];
    
    let item = exisst? mySerchArray.find(elem => {
      return elem.target == type && ! elem['exisst'];
    }): mySerchArray.find(elem => {
      return elem.target == type;
    });
    
    return item;
  }

  buildSendingFiles(fUp,fDel){
    let fData:FormData = new FormData();
    let keys = Object.keys(fUp);
    let extractTargetName:string;

    if(fUp){
      keys.forEach(key => {
        let itemes = fUp[key].slice(0);
        
        this.filesValidator.getFileObject(itemes, (file) => {
          let splUrl = this.formFiles.getUrl(this.customer).split('/');
          extractTargetName = key +":"+splUrl[0] +':'+splUrl[1] + ":" + file.target + ":" + file.name.split('.')[0];
          
          fData.append('files[]', file, extractTargetName);
          
        });
      });
    }
    fDel? fData.set('filesToDelete', JSON.stringify(fDel)): "";
    return fData;
  }

  private handleFilesBeforSend(filesToSend, filesDel?){

    /****** handel form files and validate *****/
    filesToSend = filesToSend? filesToSend: this.formFiles.extractSendingFiles(this.arrayFlies);
    filesDel = filesDel? filesDel: this.filesDl;
    let validator = this.filesValidator.validateInit(filesToSend, filesDel, this.galleries, this.customer);

    let messages = validator.geAlltMessges();

    let filesToDel: {} | boolean = (filesDel['gallery'] && filesDel['gallery'].length || filesDel['video'] && filesDel['video'].length || filesDel['loggo'] && filesDel['loggo'].length)? filesDel: false;
    let haveFilesToSend: boolean = (filesToSend['gallery'] && filesToSend['gallery'].length || filesToSend['video'] && filesToSend['video'].length || filesToSend['loggo'] && filesToSend['loggo'].length)? true: false;

    return {
      filesToSend: haveFilesToSend? filesToSend: false,
      validator: validator,
      filesToDelete:  filesToDel,
      haveFilesToSend: haveFilesToSend,
      messages:  messages
    };
  }

  onSubmit(clllback) {
    
    /****** handel form files and validate *****/
    let extractFilesSend = this.formFiles.extractSendingFiles(this.arrayFlies);
    let filestObject = this.handleFilesBeforSend(extractFilesSend);

    let messages = filestObject['messages'];

    if(messages['success'] && (filestObject['haveFilesToSend'] || filestObject['filesToDelete'])){//messages['success'] && (filestObject['haveFilesToSend'] || filestObject['filesToDelete'])
      /* 
      if(! filestObject['filesToDelete']) filestObject['filesToDelete'] = this.filesDl;
      (filestObject['filesToDelete']['video'] && filestObject['filesToDelete']['video'].length < 3)?  
      filestObject['filesToDelete']['video'].push("./assets/pages/customers/photographers/buzzi-company/video/test.png"):filestObject['filesToDelete']['video'].length >= 2?
      filestObject['filesToDelete']['video'] = filestObject['filesToDelete']['video']:
      filestObject['filesToDelete']['video'] = ["./assets/pages/customers/photographers/buzzi-company/video/test.png"];

      (filestObject['filesToDelete']['loggo'] && filestObject['filesToDelete']['loggo'].length < 3)?  
      filestObject['filesToDelete']['loggo'].push("./assets/pages/customers/photographers/buzzi-company/loggo/test.png"):filestObject['filesToDelete']['loggo'].length >= 2?
      filestObject['filesToDelete']['loggo'] = filestObject['filesToDelete']['loggo']:
      filestObject['filesToDelete']['loggo'] = ["./assets/pages/customers/photographers/buzzi-company/loggo/test.png"]; 
      */

      let fToSend = this.buildSendingFiles(filestObject['filesToSend'], filestObject['filesToDelete']);

      /****** if we have callback send back to requested component else send to server *****/
      if(clllback) return clllback(filestObject);
      this.send(fToSend, 'PUT');
    }else{
      
      this.messages = messages['errors'];
      console.log(messages);
      
      this.resetToDefualt(this.filesDl, filestObject['filesToSend']);
      this.resetMessages();
    }
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

      if (! this.formFiles.fileContains(this.arrayFlies[file.target], file)) {

        this.formFiles.filseReader(file).then(res => {

          let elemOb = this.formFiles.createElements(res);
          elemOb['atag'].addEventListener("click", this.unSelectFiles.bind(this));
          this.arrayFlies[file.target].push(elemOb['theElem']);
          targetElement.appendChild(elemOb['elemDiv']);

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

    let index = aTag.getAttribute('data-target');
    let input = <HTMLInputElement>document.getElementById(index);
    (input.value) ? input.value = "" : "";

    if ((index == "loggo") || (index == "video") && this.filesDl[index]) {
      let LinksToVideoOrloggo = this.findElemLinks(aTag.id, index);

      (LinksToVideoOrloggo != this.filesDl[index][0]) ? this.filesDl[index].push(LinksToVideoOrloggo) : "";
      this.guard[index] = false;
    }
    
    if (index == "gallery") {
      let linnkName = this.findElemLinks(aTag.id, index);
      let galLinksExists = this.findItemInArrayFiles(index, this.filesDl[index]);

      (linnkName && ! galLinksExists) ? this.filesDl['gallery'].push(linnkName) : "";
    }

    for (let ii = 0, len = childrens.length; ii < len; ii++) {

      if (childrens[ii] && aTag.id === childrens[ii].id) {

        this.arrayFlies[index] = this.formFiles.removeItem(this.arrayFlies[index], childrens[ii]);
        parent.removeChild(childrens[ii]);
        break;
      }
    }
  }

  private findElemLinks(id, target) {

    let ob = this.arrayFlies[target].find(elem => elem['id'] == id);
    let item = (ob && target == 'gallery') ? this.galleries.find(el => el.indexOf(ob.name) >= 0) :
      (ob && target == 'video') ? this.videos.find(el => el.indexOf(ob.name) >= 0) : (ob && target == 'loggo') ? this.customer.loggo : false;

    return item;
  }

  send(body, method) {

    let updaterUrl = "customers/" + this.customer["id"] + "? _method=" + method;

    this.http.postData(updaterUrl, body)
      .subscribe(evt => {

        console.log(evt);
        let msgs = this.filesValidator.getMessages(evt);
        localStorage.setItem('msgs', JSON.stringify(evt));
        console.log(msgs);
        this.messages = msgs;
        // this.resetMessages();

      }, (err) => {
        localStorage.setItem('msgs', JSON.stringify(err));

        console.log(err);
        if (err["status"] === 401) {
          // this.http.nextIslogged(false);
          window.localStorage.removeItem('user_key');
          // window.location.reload();
        }
      });
  }

  close() {
    this.router.navigate(['../']);
  }
}
