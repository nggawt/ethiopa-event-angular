import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersDataService } from '../../../../../customers/customers-data-service';
import { Observable, of } from 'rxjs';
import { HallType } from '../../../../../customers/hall-type';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from '../../../../../services/http-service/http.service';
import { first, find, tap } from 'rxjs/operators';
import { CanDeactivateComponent } from '../../../../../services/can-deactivate-guard/can-deactivate-guard.service';
import { FormProccesorService } from 'src/app/customers/form-proccesor.service';
import { FormFilesProccesorService } from 'src/app/customers/form-files-proccesor.service';

declare var $: any;


@Component({
  selector: 'app-all-edit',
  templateUrl: './all-edit.component.html',
  styleUrls: ['../../../../../styles/style.component.css']

})
export class AllEditComponent implements OnInit, CanDeactivateComponent {

  /*************** customer and form group ********************/
  customer: HallType;
  addCostumerForm: FormGroup;

  /* ************ valadition **************** */
  phoneNum: any = '^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})';
  emailPatteren: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';

  /* **************************** */
  isTrue: Observable<boolean>;
  childInstans:{};
  /* *********** gallery ***************** */
  private galleries: any;
  private videos: any;
  private guard = {};

  private arrayFlies: {} = {
    'gallery': [],
    'video': [],
    'loggo': []
  };

  private messages: any = [];

  private filesDl: {} = {
    'loggo': [],
    'video': [],
    'gallery': []
  };

  constructor(private router: Router,
    private halls: CustomersDataService,
    private http: HttpService,
    private valForm: FormProccesorService,
    private formFiles: FormFilesProccesorService) { }

  ngOnInit() {

    this.halls.customerObsever.pipe(
      find((val) => { return val['customer']['id'] })
    ).subscribe(cost => {
      let co = cost['customer'];
      let gal = cost['gallery'];

      let cId = (co && co["user_id"]) ? co["user_id"] : false;
      let authUser: any = this.auth.authUser;
      let uId = authUser ? authUser["id"] : false;

      if (cId === uId) {
        this.galleries = gal['image'];
        this.videos = gal['video'];

        this.customer = co;
        this.formInt();
        this.galleryInit();
        this.isTrue = of(true);
      } else {
        this.isTrue = of(false);
      }

    });
  }

  childIns(evt){
    this.childInstans = evt;
  }


  async galleryInit() {

    let imgs = await this.formFiles.createFilesOb(this.galleries);
    let vid = await this.formFiles.createFilesOb(this.videos);
    let loggo = await this.formFiles.createFilesOb([this.customer.loggo]);
    
    this.selectedFiles(imgs, 'gallery');
    this.selectedFiles(vid, 'video');
    this.selectedFiles(loggo, 'loggo');
  }

  update(customer) {

    let input: FormData = new FormData();
    let comp = customer['id'];
    if (this.addCostumerForm.controls[comp].status) {
      let controls = this.addCostumerForm.controls[comp];
      let items = this.valForm.validate(controls, this.customer, comp);
      console.log("update inputs called");

      if (items['status']) {
        input.append('formInputs', JSON.stringify(items['success']));
        this.send(input, 'PATCH');
      } else {
        this.messages = items['errors'];
        this.valForm.resetMessages().then(res => {

          this.messages = res;
        });

      }
    }
  }

  inputReset(customer) {
    let comp = customer['id'];
    this.addCostumerForm.controls[comp].reset();
  }

  default(customer) {
    let comp = customer.id;
    this.addCostumerForm.controls[comp].setValue(this.customer[comp])
  }

  galUpdate(elem, type) {

    let files = elem.files;
    if(files.length) this.selectedFiles(files,type);
    console.log(files);
    let sendFileToproccesor = {};
    
    sendFileToproccesor[type] = (files.length > 0)? files: this.arrayFlies[type];
    let delFiles = {[type]: this.filesDl[type]};

    let filesInput = this.formFiles.handelInputFiles(sendFileToproccesor, this.customer, delFiles, this.galleries);
    let filesToSend = filesInput['toSend'];
    let fUpdateLen = (filesToSend['toUpdate'].length > 0);
    let method = fUpdateLen ? "PUT" : "PATCH";
    let fd = filesToSend['toDelete'];
    let input = filesInput['inputs'];
    let errorsFiles = filesInput['errors'];
    // console.log(filesToSend);
    // console.log(errorsFiles);
    
    if(!errorsFiles['status'] && !errorsFiles[type] && (fUpdateLen || (fd && fd.length))){// && files.length
      if (fd && fd.length > 0) input.append('filesToDelete', JSON.stringify(fd));
      this.send(input, method);
    }else {
      this.resetToDefualt(delFiles,filesToSend['toUpdate']);
      this.messages = errorsFiles;
      this.resetMessages();
    }

  }

  reset() {
    this.addCostumerForm.reset();
    ['loggo', 'video', 'gallery'].forEach((el) => {
      
      this.galReset(el);
    });
  }

   resetToDefualt(fdel, arrToSearch?){
    
    fdel = fdel? fdel: this.filesDl;
    let galLen = (this.galleries.length - this.filesDl['gallery'].length < 4);
    for (let item in fdel) {
      
    let elem = this.findItemInArrayFiles(item, arrToSearch);
      if((item == "loggo" || item == "video") && (fdel[item].length > 0) || ( (item == "gallery" && galLen)  || elem)){
        console.log("inside resetToDefualt FN!");
        this.galReset(item);
        this.galDefault(item);
      }
    }
  }

  galReset(item?, type?) {
    
    let input = (typeof item === "string")? document.getElementById(item):false;
    let elem = input? input.parentElement.nextElementSibling:item;
    let childrens = elem.querySelectorAll('A');

    for (let ii = 0, len = childrens.length; ii < len; ii++) {
      this.unSelectFiles(childrens[ii]);
      // this.filesDl[childrens[ii].getAttribute('data-target')] = [];
    }
    if(type) type.value = "";
    if(input) input.nodeValue = "";
  }

  async resetMessages(){
    let response = await this.valForm.resetMessages();
    this.messages = await response;
    
    /* await this.valForm.resetMessages().then(res => {
      this.messages = res;
    }); */
  }

  async galDefault(galType) {
    
    let gal = galType === "gallery" ? await this.formFiles.createFilesOb(this.galleries) :
              galType === "loggo" ? await this.formFiles.createFilesOb([this.customer.loggo]) :
              galType === "video" ? await this.formFiles.createFilesOb(this.videos) : null;

    await this.selectedFiles(gal, galType);
    this.filesDl[galType] = [];
  }

  allTodefault() {
    let controls = this.addCostumerForm.controls;
    
    for (let ii in controls) {
      if (controls.hasOwnProperty(ii)) {
        if (controls[ii].value !== this.customer[ii]) {
          if (this.customer[ii]) controls[ii].setValue(this.customer[ii]);
        }
      }
    }
    ['loggo', 'video', 'gallery'].forEach(el => {

        this.galReset(el);
        this.filesDl[el] = [];
    });
    this.galleryInit();
  }

  findItemInArrayFiles(type, arr?){
    return !arr?this.arrayFlies[type].find(elem => {
      return elem.target == type;
    }):arr.find(elem => {
      return elem.target == type;
    });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {

    if (this.addCostumerForm.dirty || this.addCostumerForm.touched) {
      return confirm("לא שמרתה את הפרטים. תרצה לעזוב דף זה בכל זאת?")
    } else {
      return true;
    }
  }

  textAreaAdjust(o) {
    let target = o.target;
    // target.style.height = "1px";
    target.style.height = (25 + target.scrollHeight) + "px";
  }

  textAreamouseleave(o) {
    let target = o.target;
    target.style.height = "1px";
    target.style.height = ((target.scrollHeight) - 50 + '%') + "px";
  }

  get f() { return this.addCostumerForm.controls; }

  private formInt() {

    this.addCostumerForm = new FormGroup({
      'company': new FormControl(this.customer.company, [Validators.required]),
      'title': new FormControl(this.customer.title, [Validators.required]),
      'contact': new FormControl(this.customer.contact, [Validators.required]),
      'tel': new FormControl(this.customer.tel, [Validators.required]),
      'email': new FormControl(this.customer.email, [Validators.required]),
      'address': new FormControl(this.customer.address, [Validators.required]),
      'descriptions': new FormControl(this.customer.descriptions, [Validators.required])
    });
  }



  onSubmit() {

    let handelFiles = this.formFiles.handelInputFiles(this.arrayFlies, this.customer, this.filesDl,this.galleries);
    let input = handelFiles['inputs'];
    let filesToSend = handelFiles['toSend'];
    let toDelete = filesToSend['toDelete'];
    let erorsOb = handelFiles['errors'];
    let filesToSendLen = filesToSend['toUpdate'].length >= 1;

    /****** handel form inputs *****/
    let controls = this.addCostumerForm.controls;
    let items = this.valForm.validate(controls, this.customer);
    let success = items['success'] ? items['success'] : false;

    let haveFileToSend =  (filesToSendLen || toDelete.length >= 1);

    if (! erorsOb['status'] && haveFileToSend) {

      if (toDelete.length >= 1) input.append('filesToDelete', JSON.stringify(toDelete));
      if (success) input.append('formInputs', JSON.stringify(success));
      this.send(input, 'PUT');

    } else if (this.filesDl['gallery'].length >= 1 && !erorsOb['status']) {
      

      input.append('filesToDelete', JSON.stringify(this.filesDl['gallery']));
      if (success) input.append('formInputs', JSON.stringify(success));
      this.send(input, 'PATCH');
    } else {
      let inputsErr = (!items['status'] && items['errors']);
      let inputErrors = inputsErr ? items['errors'] : false;
      let margedErrors:{} = {};
      
      if(erorsOb['status'] || handelFiles['errors']){
        margedErrors = {...inputErrors, ...handelFiles['errors'] };
      }
      
      let haveErrorsToMerge = Object.keys(margedErrors).length > 0;
      let resualt = haveErrorsToMerge? margedErrors:inputErrors;
      this.messages = resualt;
      
      this.resetToDefualt(this.filesDl, filesToSend['toUpdate']);
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

    if((elemTarget !== "gallery") && !this.guard[elemTarget]) this.guard[elemTarget] = elemTarget;

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
        (input.value) ? input.value = "":"";
      
      if ((index == "loggo") || (index == "video") && this.filesDl[index]){
        let LinksToVideoOrloggo = this.findElemLinks(aTag.id, index);
        
        (LinksToVideoOrloggo != this.filesDl[index][0])? this.filesDl[index].push(LinksToVideoOrloggo):"";
        this.guard[index] = false;
      } 
      if (index == "gallery"){
        let linnkName = this.findElemLinks(aTag.id, index);
        let galLinksExists = this.findItemInArrayFiles(index, this.filesDl[index]);

        (linnkName && !galLinksExists)? this.filesDl['gallery'].push(linnkName): "";
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

    let updaterUrl = "http://lara.test/api/customers/" + this.customer["id"] + "? _method=" + method;

    this.http.postData(updaterUrl, body)
      .subscribe(evt => {

        console.log(evt);
        let msgs = this.valForm.getMassages(evt);
        console.log(msgs);
        this.messages = msgs;
        this.resetMessages();
        
      }, (err) => {

        console.log(err);
        if (err["status"] === 401) {
          this.http.nextIslogged(false);
          window.localStorage.removeItem('user_key');
          window.location.reload();
        }
      });
  }

  close() {
    this.router.navigate(['../']);
  }

}
