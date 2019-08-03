import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { HttpService } from '../services/http-service/http.service';
import { Observable, of } from 'rxjs';
import { first, filter, tap, map, skipWhile, take, skipUntil } from 'rxjs/operators';
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
 
  private url:string;
  eeMessage: {
    id:string, 
    modalSize: string, 
    nameTo: string | boolean, 
    emailTo: string | boolean, 
    title: string
  } = {
    id:'contact_ee', 
    modalSize: "modal-lg", 
    nameTo: 'ethiopia-events', 
    emailTo: false, 
    title: 'שלח הודעה'
  };

  user$: Observable<User| boolean>;
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
    
    
    this.url = decodeURIComponent(location.pathname);
    this.user$ = this.http.userObs.pipe(filter(item => typeof item == "object"));
  }

  contactModel(param){
    this.http.requestUrl = decodeURIComponent(location.pathname);
    console.log(this.http.requestUrl);
    this.eeMessage = {
      id:'contact_ee', 
      modalSize: "modal-lg", 
      nameTo: 'אתיופיה אירועים', 
      emailTo: "ethiopia-events@gmail.com", 
      title: 'שלח הודעה'
    };
    // $('#forgotPassword').modal();
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


  logOut(){
    this.url = decodeURIComponent(location.pathname);

    this.http.logOut().subscribe(evt =>{
      console.log(evt);
      
      // location.reload();
    });
    this.user$ = of(false);
    this.redirect();
  }

  logIn(){
    this.http.requestUrl = decodeURIComponent(location.pathname);
    console.log(location.pathname);
    
    this.router.navigate(['/login']);
  } 
  
  register(path){
    // $('.close').click(); 
    this.http.requestUrl = decodeURIComponent(location.pathname);
    console.log(this.http.requestUrl);
    
    this.router.navigate([path]);
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

  redirect(){
    let splitUrl:any = ( this.url.indexOf('halls-events') >= 0)?  this.url.split("/"): false;
        splitUrl = (splitUrl && (splitUrl[1] && splitUrl[2])) ?  splitUrl[1]+"/"+splitUrl[2] :(splitUrl && splitUrl[1])? splitUrl[1]: "/";
        this.router.navigate([splitUrl]);//, { relativeTo: this.route }
  }
}
