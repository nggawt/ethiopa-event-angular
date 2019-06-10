
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../services/http-service/http.service';
import { Observable, of } from 'rxjs';
import { CanDeactivateComponent } from '../services/can-deactivate-guard/can-deactivate-guard.service';
import { CustomersDataService } from '../customers/customers-data-service';
import { FormProccesorService } from '../customers/form-proccesor.service';
import { FormFilesProccesorService } from '../customers/form-files-proccesor.service';
import { FormValidationsService } from '../customers/form-validations.service';

declare let $: any;

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['../styles/style.component.css']
})
export class JoinComponent implements OnInit, CanDeactivateComponent {

 /*************** user and form group ********************/
 customer;
 addCostumerForm: FormGroup;

 /* ************ valadition **************** */
 phoneNum: any = '^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})';
 emailPatteren: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';

 /* **************************** */
 isTrue: Observable<boolean>;
 allowdeactivate:boolean = true;

 /* *********** gallery ***************** */

  private guard = {};
  private messages: any = [];
 private arrayFlies: {} = {
  'gallery': [],
  'video': [],
  'loggo': []
  };

  constructor(private router: Router, 
              private valForm: FormProccesorService, 
              private http: HttpService,
              private filesValidator: FormValidationsService,
              private formFiles: FormFilesProccesorService) { }

  ngOnInit() {

    this.http.isLogedIn.subscribe(
      (isLogged) => {
        this.isTrue = of(isLogged);

        if(isLogged){
    
          this.formInt();
        }else{
          
          this.router.navigate(['/']);
        }
      }
    );
    
  }

  inputReset(customer) {
    let comp = customer['id'];
    this.addCostumerForm.controls[comp].reset();
    // console.log(customer);
    
  }

  default(customer) {
    let comp = customer.id;
    this.addCostumerForm.controls[comp].setValue(this.customer[comp])
  }

  reset() {

    this.addCostumerForm.reset();
    ['loggo', 'video', 'gallery'].forEach((el) => {
      
      this.galReset(el);
    });
  }

  galReset(item?) {
    
    let elem = (typeof item === "string")? document.getElementById(item).parentElement.nextElementSibling:item;
    let childrens = elem.querySelectorAll('A');
    // if(typeof item === "string") this.filesDl[item] = [];

    for (let ii = 0, len = childrens.length; ii < len; ii++) {
      this.unSelectFiles(childrens[ii]);
    }
  }

  resetMessages(){
    this.filesValidator.resetMessages().then(res => {
      this.messages = res;
    });
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
      /* let delLen = this.filesDl[el].length > 0;
      let elem = this.findItemInArrayFiles(el)

      if((elem && delLen) || (delLen && el == "gallery")){
        this.galReset(el);
        this.galDefault(el);
      }  */
    });
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    
      let filesLoggo = this.arrayFlies['loggo'].length >= 1;
      let filesGallery = this.arrayFlies['gallery'].length >= 1;
      let filesVideo = this.arrayFlies['video'].length >= 1;
  
      let haveFiles = filesGallery || filesLoggo || filesVideo;
  
      /* if (haveFiles) {
        return true;
      } else {
        return false;
      } */
    if ((this.addCostumerForm.dirty || this.addCostumerForm.touched || haveFiles) && this.allowdeactivate) {
      return confirm("לא שמרתה את הפרטים. תרצה לעזוב דף זה בכל זאת?")
    } else {
      return true;
    }
  }

  get f() { return this.addCostumerForm.controls; }
  get formAll() { return this.addCostumerForm; }

  private formInt() {

    this.addCostumerForm = new FormGroup({
      'company': new FormControl(null,[Validators.required]),
      'businessType': new FormControl(null,[Validators.required]),
      'title': new FormControl(null,[Validators.required]),
      'contact': new FormControl(null,[Validators.required]),
      'tel': new FormControl(null,[Validators.required]),
      'email': new FormControl(null,[Validators.required]),
      'address': new FormControl(null,[Validators.required]),
      'discription': new FormControl(null,[Validators.required])
    });
  }

  buildSendingFiles(fUp,fDel?){
    let fData:FormData = new FormData();
    let keys = Object.keys(fUp);
    let extractTargetName:string;

    if(fUp){
      keys.forEach(key => {
        let itemes = fUp[key].slice(0);
        
        this.filesValidator.getFileObject(itemes, (file) => {
          let splUrl = this.formFiles.getUrl(this.addCostumerForm.value).split('/');
          extractTargetName = key +":"+splUrl[0] +':'+splUrl[1] + ":" + file.target + ":" + file.name.split('.')[0];
          
          fData.append('files[]', file, extractTargetName);
          
        });
      });
    }
    fDel? fData.set('filesToDelete', JSON.stringify(fDel)): "";
    return fData;
  }

  private handleFilesBeforSend(filesSend){
    console.log(filesSend);
    
    /****** handel form files and validate *****/
    let filesToSend = filesSend? filesSend: this.formFiles.extractSendingFiles(this.arrayFlies);
    let validator = this.filesValidator.validateInit(filesToSend);

    let messages = validator.geAlltMessges();

    let haveFilesToSend: boolean = ((filesToSend['gallery'] && filesToSend['gallery'].length) || (filesToSend['video'] && filesToSend['video'].length) || 
                                    (filesToSend['loggo'] && filesToSend['loggo'].length))? true: false;

    return {
      filesToSend: filesToSend,
      validator: validator,
      haveFilesToSend: haveFilesToSend,
      messages:  messages
    };
  }

  onSubmit() {
    
    let formInputes = this.addCostumerForm;
    this.customer = formInputes.value;
    
    /****** handel form inputs *****/
    let controls = formInputes.controls;
    
    
    let items = this.valForm.validate(controls);
    let success = items['status'] ? items['success'] : false;
  

    /****** handel form files and validate *****/
    let extractFilesSend = this.formFiles.extractSendingFiles(this.arrayFlies);
    let filestObject = this.handleFilesBeforSend(extractFilesSend);

    let messages = filestObject['messages'];


    if(messages['success'] && !messages['warning'] && (filestObject['haveFilesToSend'] || filestObject['filesToDelete'])){
      
      console.log(filestObject);
      let fToSend = this.buildSendingFiles(filestObject['filesToSend'], filestObject['filesToDelete']);

      if (success && filestObject['filesToSend']['loggo'].length){
        let findLinkCust = filestObject['filesToSend']['loggo'][0];
        
        success['loggo'] = this.formFiles.getUrl(formInputes.value)+"/"+findLinkCust.target+"/"+
        findLinkCust.name.split('.')[0]+'.'+findLinkCust.name.split('.')[(findLinkCust.name.split('.').length) - 1];
        fToSend.set('formInputs', JSON.stringify(success));
      } 

      /****** if we have callback send back to requested component else send to server *****/
      this.send(fToSend, formInputes.value);
    }else{
      
      this.messages = messages['errors']?  messages['errors']:  messages['warning'];
      console.log(messages);
      
      // this.reset();
      this.resetMessages();
    }

    /* if (! erorsOb['status'] && filesToSendLen && success && formInputes.valid) {
      // (ii.target === "loggo")? formInputs['loggo'] = 
      //extractTargetName+'.'+ii.name.split('.')[(ii.name.split('.').length) - 1]: null;
      if(!success['loggo']){
      let findLinkCost = this.findItemInArrayFiles('loggo',filesToSend['toUpdate']);

        success['loggo'] = this.formFiles.getUrl(formInputes.value)+"/"+findLinkCost.target+"/"+
        findLinkCost.name.split('.')[0]+'.'+findLinkCost.name.split('.')[(findLinkCost.name.split('.').length) - 1];
      } 
      if (success) input.append('formInputs', JSON.stringify(success));
      console.log("send to server!");
      this.send(input, formInputes.value);

    }else {
      let inputsErr = (!items['status'] && items['errors']);
      let inputErrors = inputsErr ? items['errors'] : false;
      let margedErrors:{} = {};
      
      if(erorsOb['status'] || handelFiles['errors']){
        margedErrors = {...inputErrors, ...handelFiles['errors'] };
      }
      
      let haveErrorsToMerge = Object.keys(margedErrors).length > 0;
      let resualt = haveErrorsToMerge? margedErrors:inputErrors;
      this.messages = resualt;
      
      this.resetMessages();
    } */
  }

  selectedFiles(event, elemTarget) {

    let files = event.target;
    let targetElement = $('input.' + elemTarget)[0].parentElement.nextElementSibling;

    if (this.guard[elemTarget] == elemTarget) {
      console.log("You cant uplaod twise " + elemTarget);
      console.log(this.guard);

      return false;
    }///hiii thre my name is buzzi wt wellcome to my site

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

    if ((index == "loggo") || (index == "video")) {
    
      this.guard[index] = false;
    }

    for (let ii = 0, len = childrens.length; ii < len; ii++) {

      if (childrens[ii] && aTag.id === childrens[ii].id) {

        this.arrayFlies[index] = this.formFiles.removeItem(this.arrayFlies[index], childrens[ii]);
        parent.removeChild(childrens[ii]);
        break;
      }
    }
  }

  send(body, customer?) {

    let updaterUrl = "http://ethio:8080/api/customers";

    this.http.postData(updaterUrl, body)
      .subscribe(evt => {

        // if(evt['errors']){
          console.log(evt);
          let msgs = this.valForm.getMassages(evt);
          this.messages = msgs;
          console.log(msgs);
          this.allowdeactivate = false;

          this.valForm.resetMessages().then(response => {
            // let url = "/customers/"+ this.formFiles.getUrl(customer) + "/media";
            this.messages = response;
            // this.router.navigate([url]);
          });
        // }else{
          // location.reload();
        // }
        /**** send new customer to his own page *****/
        
      }, (err) => {

        console.log(err);
        if (err["status"] === 401) {
          console.log(err['status']);
          
          this.http.nextIslogged(false);
         // window.sessionStorage.removeItem('user_key');
          window.location.reload();
        }
      });
  }

  close() {
    this.router.navigate(['../']);
  }

}
