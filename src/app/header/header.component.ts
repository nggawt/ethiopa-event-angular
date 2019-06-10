import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { HttpService } from '../services/http-service/http.service';
import { Observable, of } from 'rxjs';
import { first, filter, tap, map, skipWhile } from 'rxjs/operators';
import { CustomersDataService } from '../customers/customers-data-service';
import { User } from '../types/user-type';
declare let $:any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  // encapsulation: ViewEncapsulation.None

})
export class HeaderComponent implements OnInit {
 /*********Log-in props *********/
  phoneNum: any = '^((?=(02|03|04|08|09))[0-9]{2}[0-9]{3}[0-9]{4}|(?=(05|170|180))[0-9]{3}[0-9]{3}[0-9]{4})';
  emailPatt: string = '^[a-z]+[a-zA-Z_\\d]*@[A-Za-z]{2,10}\.[A-Za-z]{2,3}(?:\.?[a-z]{2})?$';
  passwordPatt: string = '\\w{6,}$';

  private url:string;
  logInform: FormGroup;
  resetPassword: FormGroup;
  sendResetPasswordToEmail: FormGroup;

  @ViewChild('logInTemplate', {static: true}) logInTemplate;
  @ViewChild('sendResetEmailTemplate', {static: true}) sendResetEmailTemplate; 
  @ViewChild('sendResetPasswordTemplate', {static: true}) sendResetPasswordTemplate; 

  private resetPass:boolean = false;
  formType: any;
  token: string | boolean;
  userProfil:string;
  customerPage: string | boolean;
 /*********Header props *********/
  auth: Observable<boolean>;
  msgTo;

  user$: Observable<User | boolean> ;
  private customersSrc: {}[];
  private articles: {}[];
  private events: {}[] ;
  private itemsSearch: {customers: {}[], events: {}[], blog: {}[]} = {
    customers: [],
    events: [],
    blog: []
  };

  constructor(
    private http: HttpService, 
    private customers: CustomersDataService,
    private router: Router, 
    private route: ActivatedRoute) {}

  ngOnInit() {
    console.log("header");
    
    this.url = decodeURIComponent(location.pathname);
    // this.http.isAuthenticeted();
    // this.auth = this.http.isAuthenticeted();
    this.msgTo ={
      name: "אתיופיה אירועים"
    };
    this.http.userObs.pipe(skipWhile(item => typeof item == "number")).subscribe((user) => {
      // console.log(user);
      
      this.user$ = typeof user == "number"? of(false): of(user);
      
      if(! user['status']){
        // let token = this.route.snapshot.queryParamMap['params']['token'];
        ///password/email/
        // this.initRestPasswordForm();
        
        // default
        //this.currentForm();
        
        // this.initFormLogin();
      }
    },
    (noUser) =>{
      // console.log(noUser);
      
    });

    // this.http.userObs.pipe(first((user) => user['id'])).subscribe((user) => {
      // console.log(user);
    //   if(user['customer']) this.setUrlPage(user['customer']);
    //   if(user) this.setUrlProfile(user);
    // });

    this.http.allowLogIn.subscribe((allow) => {
       if(allow){
        $('#myFormModel').modal();
        this.initFormLogin();
        this.formType = this.logInTemplate;
       } 
       this.url = decodeURIComponent(location.pathname);
      //  this.formType = this.logInTemplate;
      // this.formType = this.logInTemplate;
      // this.initFormLogin();
    });
  }

  contactModel(param){
    
    $('#contactModel').modal();
  }

  async searchItems(evt){
    let input:HTMLInputElement = evt.target,
        div: HTMLDivElement = <HTMLDivElement>input.parentElement.parentElement.parentElement;

    let allowCharSets = '(){}+\'\"<>?/\\:,+*&^%$#@!`~[]|=-.  ';
    
    let allowed = await allowCharSets.split('').filter(char => {
      return input.value.indexOf(char) != -1;
    });
    // console.log(allowed.length);

    if(! allowed.length && input.value.length >= 2){
      let searchItems:{}[] = [];
      /* filter customres */
      let divSearch = $(".search-div")[0];
      
      // input, url?, propsArray?, link?
      const customersProps = ['id', 'title','company', 'businessType', 'address', 'discription'];
      let customers = await this.gatItems(input, "customers", customersProps);
      // console.log(customers);
      if(customers.length) searchItems = [...searchItems, ...customers];

      /* filter scedule events */
      let eventsProps = ['id', 'address', 'description', 'date'];
      let sceduleEvents = await this.gatItems(input, 'events', eventsProps);
      // console.log(sceduleEvents);
      if(sceduleEvents.length) searchItems = [...searchItems, ...sceduleEvents];

      /* filter Blog && Articles*/
      let articleProps = ['id', 'title', 'body', 'date'];
      let blog = await this.gatItems(input, 'blog', articleProps);
      // console.log(blog);
      if(blog.length) searchItems = [...searchItems, ...blog];

      /* filter pages(contact EE and Customers) */

      /* Execute Search FN */
      // console.log(searchItems);
      
      let cHtm = await this.createHtms(searchItems);
          
      if(divSearch.firstElementChild) divSearch.removeChild(divSearch.firstElementChild);
      divSearch.appendChild(cHtm);
      divSearch.className += " shadow-sm";
      divSearch.style.top = divSearch.parentElement.clientHeight + "px";
      divSearch.style.width = (divSearch.parentElement.clientWidth * 2) + "px";
      divSearch.style.left = 0+"px";
      
    }
  }

  gatItems(input, url?, propsArray?){

    let link = (url == "events")? 'scedule-events': url;
    if(this.itemsSearch[url].length){
      return this.filterItems(this.itemsSearch[url], input.value, link);
    }else{
      return this.http.getData(url).pipe(map(items => {
        // console.log(Object.keys(items['customers']));//['halls-events']
        items = (items['customers']) ? Object.keys(items['customers']).map(item => items['customers'][item].map(customer => customer['customer']))[0]: items;
        
        // let evt = events[0].map(item => this.extractProps(item, ['address', 'description', 'date']));
        let evts = Array.prototype.map.call(items,item => this.extractProps(item, propsArray));
        // console.log(evts);
        this.itemsSearch[url] = evts;
        let filteredEvt  = this.filterItems(evts, input.value,link);
        return filteredEvt;
      })).toPromise();
    }
  }

  createHtms(items: Array<{}>){
    let ul: HTMLUListElement = <HTMLUListElement>document.createElement("UL");
    items.forEach(element => {
      let li: HTMLLIElement = <HTMLLIElement>document.createElement("LI"),
          aTag:HTMLAnchorElement = <HTMLAnchorElement>document.createElement("A");

      ul.className = "list-group list-group-flush";
      li.className = "list-group-item";
      let match = element['match'].split('::');
      
      match.forEach((txt) => {

        let span = document.createElement("SPAN"),
        txtSplit = txt.split(element['key']);

        span.className ="bg-warning";
        span.innerHTML = element['key'];
        
        aTag.innerHTML += this.sliceLastTxt(txtSplit[0]);
        aTag.appendChild(span);
        aTag.innerHTML += this.sliceFirstTxt(txtSplit[1]);
      });
      aTag.addEventListener("click", this.navigatToPage.bind(this, element, ul), false);
      li.appendChild(aTag);
      ul.appendChild(li);
    });
    this.attachEvents(ul);
    
    return ul;
  }
  
  sliceLastTxt(txt: string){
    let explodedTxt = (txt.lastIndexOf('.') >= 15)? (txt.lastIndexOf('.', txt.length - 5) >= 0) ? txt.slice(txt.lastIndexOf('.', txt.length - 5)+1):txt.slice(txt.lastIndexOf('.')+1): 
          (txt.lastIndexOf(',') >= 15)? (txt.lastIndexOf(',', txt.length - 5) >= 0) ? txt.slice(txt.lastIndexOf(',', txt.length - 5)+1):txt.slice(txt.lastIndexOf(',')+1):txt;
    return explodedTxt;
  }

  sliceFirstTxt(txt: string){//lastIndexOf
    let explodedTxt = (txt.indexOf('.') >= 15)? txt.slice(0, txt.indexOf('.')): 
          (txt.indexOf(',') >= 15)? txt.slice(0, txt.indexOf(',')):txt;
    return explodedTxt;
  }

  attachEvents(ul){
    $(document).on("click", (e) => {  
      if(e.target.id == "search_form"){
        e.stopPropagation();
        return false;  
      } 
      $(ul).hide(); //hide the button
    });

    $("#search_form").on("focus",() => {
      $(ul).show();
    });
  }

  navigatToPage(items, ul){

    // let parent = ul.parentElement;
    // parent.removeChild(ul);
    console.log(items);
    this.router.navigate([items['link']]);
    $(ul).hide();
  }

  extractProps(customer, delimiters: string[]){
    let cust = {};
    delimiters.forEach(element => {
      cust[element] = customer[element];
    });
    return cust;
  }

  filterItems(itemsArray: Array<{}>, inputText,link?){
    
    let itemsFounded = [];
    let regex = new RegExp('.*?[\\S.]*?'+inputText+'.*?[,\\.]?$',"gmi");//?(?=\\s)

    itemsArray.forEach(item => {

      Object.keys(item).forEach(itemKey => {

        let foundedItem = (typeof item[itemKey] == "string")? item[itemKey].match(regex,"gmi"): false;
        if(foundedItem){
          let slicedItems = (foundedItem.length > 2)? foundedItem.slice(0,2):foundedItem;
          let url = (link == "customers")? (itemKey == "discription")? "/"+link+"/"+item['businessType']+"/"+item['company']+"/about":
          "/"+link+"/"+item['businessType']+"/"+item['company']:(link == "blog")? "/"+link+"/"+item['id']:"/"+link;

          let fd = {
            match: slicedItems.join('::'),
            key: inputText,
            link: url,
            [itemKey]: item[itemKey]
          };
          itemsFounded.push(fd);
        }
      });

    });
    return itemsFounded;
  }

  currentForm(){
    let token = this.route.snapshot.queryParamMap['params']['token'];
    let loc = decodeURIComponent(location.href).split("?token=")[1];
    let token1 = this.route.snapshot.paramMap.get('token');
    const snapshot: RouterStateSnapshot = this.router.routerState.snapshot;
    // console.log(snapshot);
    // console.log('length: '+loc.length+": token: "+loc);
    // console.log(token);
    // console.log(token1);
    // console.log(this.url);
    this.token = loc? loc: false;
    let rspurl = this.url.split("/password/")[1];
    
    if(loc && loc.length == 64 && (rspurl == "email" || rspurl == "email/")){
      this.initResetPasswordForm();
      // console.log($('#myFormModel'));
      
      this.formType = this.sendResetPasswordTemplate;
      setTimeout(() =>{
        $('#myFormModel').modal();

      }, 500)
    }else{
      this.formType = this.logInTemplate;
      this.initFormLogin();
    } 
  }
  
  logIn(){
    this.http.requestUrl = location.pathname;
    this.router.navigate(['/login']);
  } 

  private initFormLogin(){
   
    this.logInform = new FormGroup({
      "name": new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required])
    });
    
    // this.formType = 'logIn';
  }
  
  sendReset(){
    console.log("called!");
    this.sendResetPasswordToEmail = new FormGroup({
      "userName": new FormControl(null, [Validators.required]),
      'logInEmail': new FormControl(null, [Validators.required])
    });
    this.resetPass = true;
    this.formType = this.sendResetEmailTemplate;
    // this.formType = this.sendResetEmailTemplate;
  }

  initResetPasswordForm(){
    
    this.resetPassword = new FormGroup({
      "userName": new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.required]),
      'newPassword': new FormControl(null, [Validators.required]),
      'password_conf': new FormControl(null, [Validators.required]),
    });
    // this.formType = 'resetPassword';
    // $('#myFormModel').modal();
  }

  logOut(){
    this.url = decodeURIComponent(location.pathname);

    this.http.logOut().subscribe(evt =>{
      console.log(evt);
      
      // location.reload();
    });
    this.user$ = of(false);
    this.redirect();
  }

  redirect(){
    let splitUrl:any = ( this.url.indexOf('halls-events') >= 0)?  this.url.split("/"): false;
        splitUrl = (splitUrl && (splitUrl[1] && splitUrl[2])) ?  splitUrl[1]+"/"+splitUrl[2] :(splitUrl && splitUrl[1])? splitUrl[1]: "/";
        this.router.navigate([splitUrl], { relativeTo: this.route });
  }

  onSubmit() {
    this.url = decodeURIComponent(location.pathname);
    if (this.logInform.valid) {
      console.log(this.logInform.value);
      
      this.http.logIn(this.logInform.value, 'login').
        subscribe(evt => {
          console.log(evt);
          this.user$ = of(evt['user']);
          let redirectUrl = this.http.intendedUri? this.http.intendedUri: this.url? this.url: "/";
          if(evt['user']) this.setUrlProfile(evt['user']);
          if(evt['user'] && evt['user']['customer']) this.setUrlPage(evt['user']['customer']);
          // this.router.navigate([redirectUrl]);
          $('.close').click();
          // location.reload();
        },
        (err) => {
          // this.http.nextIslogged(false);
          console.log(err);
        });
    }
  }

  sendPasswordResetEmail(){
    console.log(this.logInform);
    // this.logInform.controls.
    // resetPassword
    this.url = decodeURIComponent(location.pathname);
    if (this.sendResetPasswordToEmail.valid) {
      
      this.http.sendResetPassword(this.sendResetPasswordToEmail.value).
        subscribe(evt => {
          console.log(evt);
          
          // let redirectUrl = this.http.intendedUri? this.http.intendedUri: this.url? this.url: "/";
          // if(evt['user']) this.setUrlProfile(evt['user']);
          // if(evt['user'] && evt['user']['customer']) this.setUrlPage(evt['user']['customer']);
          // this.router.navigate([redirectUrl]);
          $('.close').click();
          // location.reload();
        },
        (err) => {
          // this.http.nextIslogged(false);
          console.log(err);
        });
    }
  }

  register(path){
    // $('.close').click(); 
    this.http.requestUrl = location.pathname;
    this.router.navigate([path]);
  }
  
  getForm(theForm) { 
    console.log(theForm);
    return theForm.controls;
   }

  f() { return this.logInform.controls; }

  reset(){
    console.log(this.resetPassword);
    let values = this.resetPassword.value;
    values['token'] = this.token;
    // values['token'] = this.route.snapshot.queryParamMap['params']['token'];

    if (this.resetPassword.valid && this.token) {
      console.log("sending");
      console.log(this.resetPassword.value);
      this.http.resetPassword(values).
        subscribe(evt => {
          console.log(evt);
          
          let redirectUrl = this.http.intendedUri? this.http.intendedUri: this.url? this.url: "/";
          if(evt['user']) this.setUrlProfile(evt['user']);
          if(evt['user'] && evt['user']['customer']) this.setUrlPage(evt['user']['customer']);
          this.router.navigate(['/']);
          $('.close').click();
          // location.reload();
        },
        (err) => {
          // this.http.nextIslogged(false);
          console.log(err);
        });
    }
    
  }
  private setUrlPage(customer){
    
    let compNameTrimed = customer['company'].trim(),
        bTypeTrimed = customer['businessType'].trim(),
        compName = (compNameTrimed.split(' ').length > 1)? this.appendSelashBetweenSpace(compNameTrimed, ' '):customer['company'],
        businessType = (bTypeTrimed.split(' ').length > 1)? this.appendSelashBetweenSpace(bTypeTrimed, ' '):customer['businessType'];

    return "customers/"+businessType+"/"+compName;
  }

  private setUrlProfile(obj){
    return "/users/"+obj['name'];
  }

  appendSelashBetweenSpace(text, delimiter?){
    let str:string;
    delimiter = delimiter? delimiter: " ";
    text.split(delimiter).forEach(element => {
      (str)? (element != "")? str += "-" + element: '': (element != "")? str = element: '';
    });
    return str;
  }
}
