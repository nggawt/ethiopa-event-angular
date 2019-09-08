import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, filter, first } from 'rxjs/operators';
import { HttpService } from '../http-service/http.service';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
  
  private resources: {
    users: BehaviorSubject<{}[] | boolean>,
    customers: BehaviorSubject<{}[] | boolean>,
    messages: BehaviorSubject<{}[] | boolean>,
    articles: BehaviorSubject<{}[] | boolean>,
    events: BehaviorSubject<{}[] | boolean>,
    admins: BehaviorSubject<{}[] | boolean>,
    forbidden: BehaviorSubject<{}[] | boolean>
  } = {
      users: new BehaviorSubject(false),
      customers: new BehaviorSubject(false),
      messages: new BehaviorSubject(false),
      articles: new BehaviorSubject(false),
      events: new BehaviorSubject(false),
      admins: new BehaviorSubject(false),
      forbidden: new BehaviorSubject(false)
  };

  public users = this.resources.users.asObservable();
  public customers = this.resources.customers.asObservable();
  public articles = this.resources.articles.asObservable();
  public events = this.resources.events.asObservable();
  public admins = this.resources.admins.asObservable();
  public forbidden = this.resources.forbidden.asObservable();

  private itemResources = {};
  private regItems = [];

  constructor(private http: HttpService) { }

  async initResources(items, paginate?: boolean) {
    await this.regiterResources(items, paginate);
    return true;
  }

  emitResources(key: string, resources) {
    if (this.resources[key]) this.resources[key].next(resources);
  }

  update(key: string, resource: {}, method?:string): void {
    let items =  this.resources[key].getValue();
    // console.log(items);
    if(items && key == "customers"){
      let customers = items[resource['businessType']];
      customers.map(item => item.customer.id == resource['id']? resource: item);
      items = {[resource['businessType']]: customers};
    }else if(items) items.map(item => item.id == resource['id']? resource: item);
    // console.log(items);
    if (this.resources[key]) this.resources[key].next(items);
  }

  forbiddenUser(key, items, isForbidden: boolean){
    // let users =  this.resources[key].getValue();

    let forbidden =  this.resources['forbidden'].getValue(), id = (key == "users")? items.id: items.user_id;
    console.log(forbidden);
    
    let forbiddenItems = (isForbidden)? this.removeForbidden(forbidden, id): this.pushForbidden(forbidden, items);
    
    
    // if(users) users.map(user => user.id == items['user_id']? user['forbidden'] = items.forbidden: user);
    // if (this.resources[key]) this.resources[key].next(users);
    if (this.resources['forbidden'] && forbidden) this.resources['forbidden'].next(forbiddenItems);

    console.log("users: ", 'users', " forbidden: ", forbiddenItems, ' items: ', items);
  }

  removeForbidden(forbiddens, id){
    if(Array.isArray(forbiddens)) forbiddens.forEach((forbiddenUser, index) => (forbiddenUser['user_id'] == id)? forbiddens.splice(index, 1) : '');
    return forbiddens;
  }

  pushForbidden(forbiddens, items){
    forbiddens.push(items);
    return forbiddens;
  }

  protected regiter(url): Promise<any> {

    this.regItems.push(url);
    return this.http.getData(url).pipe(first(),
      map(items => this.checkHasKey(items, 'status')? false: items),
      tap(item => {
        console.log(url, " : ", item);
        // this.itemResources[url] = item;
      })).toPromise();

    // const sleep = ms => {
    //   return new Promise(resolve => setTimeout(resolve, ms))
    // };
    // return sleep(1000).then(v => this.req(url));

  }

  dataTransform(key:string, items?: {}){
    // if(!items || this.checkHasKey(items, 'status')) return false;
    console.log("calll");
    
    ! items? this.getResources(key, false).then(item => {
      items = this.usersTransform(items);
    }):  items = this.usersTransform(items);
    return items;
  }

  usersTransform(users){

    this.getResources('forbidden', false).then(forbidden => {
      console.log(forbidden);
      
      users = (forbidden && Array.isArray(users))? 
          users.map(user => user['forbidden'] = forbidden.find(forbidden => (forbidden.user_id == (user.user_id || user.id)))? true: false): false;
    });
    return users;
  }

  req(url) {
    return this.http.getData(url).pipe(first(),
      tap(item => {
        // console.log(url);

      })).toPromise();
  }

  sleepFn(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  };

  async regiterResources(items: string | string[], paginate) {

    if (typeof items == "string") items = [items];
    for (let ii of items) {

      let isResExisst = (this.regItems.indexOf(ii) != -1) && this.resources[ii] && this.resources[ii].getValue();
      // console.log(this.resources[ii]);
      
      if (isResExisst) continue; 
      let itemsData = await this.regiter(ii);
      if (itemsData) this.setResourcesData(ii, itemsData); 
    }
  }

  protected setResourcesData(res: string, data: any) {
    let item = (data && data[res]) ? data[res] : data;
    // console.log(item);
    

    if (item) this.emitResources(res, item);
    // console.log("data current: ", data, "name: ", res, "rsources: ", this.itemResources);
  }

  pagination(resource: {}, resourceName: string) {

    (resourceName == "customers" && !resource[resourceName]) ? resource = { [resourceName]: resource } : '';
    let mapedItems = this.mapItems(resource),
      paginated = this.dataPaginated(resourceName, mapedItems);
    return paginated;
  }

  protected mapItems(items) {

    let arr = {
      activeated: [],
      pending: []
    };

    if (items['customers'] && typeof items['customers'] == "object") {

      let customers = this.getCustomersItems(items['customers']);
      arr['activeated'] = this.getActivivated(customers, 'confirmed');
      arr['pending'] = this.getPendinding(customers, 'confirmed');

    } else if (items && items.length) {
      arr['activeated'] = this.getActivivated(items, 'confirmed');
      arr['pending'] = this.getPendinding(items, 'confirmed');
    }
    return arr;
  }

  protected dataPaginated(urlIndicetor: string, resources) {

    return {
      count: resources.activeated.length,
      data: resources.activeated,
      pending: resources.pending,
      resName: urlIndicetor,
      config: {
        id: urlIndicetor,
        itemsPerPage: 6,
        currentPage: 1,
        totalItems: resources.activeated.length
      }
    };
  }

  objectToArray(items) {
    let arr = [];
    for (let item of items) {
      arr.push(item);
    }
    return arr;
  }

  protected getCustomersItems(customers) {
    let customersArray = [];
    Object.keys(customers).forEach(customersType => customers[customersType].forEach(item => {
      let customer = { customer: item['customer'], gallery: item['gallery'] };
      customersArray.push(customer);
    }));
    return customersArray;
  }

  findItem(id, itemType) {
    // console.log('id: ' + id, 'item type: ' + itemType);
    // return this.resourcesObsever.pipe(
    //   // tap(item => console.log(item)),
    //   filter(items => items[itemType] && items[itemType].data),
    //   map(items => [...items[itemType].data, ...items[itemType].pending].find(item => this.checkTypeId(item, 'customer').id == id)));//item? this.itemForm(item): ''
  }

  checkTypeId(itemOb, key) {
    return itemOb[key] ? itemOb[key] : itemOb;
  }

  protected getActivivated(items, key) {
    return items.filter(item => this.checkTypeId(item, 'customer')[key] || !this.checkHasKey(this.checkTypeId(item, 'customer'), key));
  }

  protected getPendinding(items, keyObj: string) {
    return items.filter(item => (this.checkHasKey(this.checkTypeId(item, 'customer'), keyObj) && this.checkTypeId(item, 'customer')[keyObj] === false));
  }

  protected checkHasKey(item, key) {
    return (key in item) ? true : false;
  }

  async getResources(items: string, paginate: boolean) {

    paginate ? paginate : false;
    let resource = this.resources[items]? this.resources[items].getValue(): false;
    
    if (resource) {
      return resource;
    } else {
      await this.regiterResources(items, paginate);
    return this.resources[items]? this.resources[items].getValue(): resource;
    }
  }

  getItemResource(itemType, id, resource, paginate) {

    paginate = paginate ? paginate : false;

    console.log(this.itemResources, itemType, id, resource, paginate);
    if (this.itemResources[itemType]) {
      // let items = itemType == "customers"? this.itemResources[itemType][resource]: this.itemResources[itemType];

      let itemRes = this.getItem(this.itemResources[itemType], id, resource);

      return new Promise((res, rej) => res(itemRes));
    }
    let getedItem = this.getResources(itemType, paginate);
    console.log("getedItem: ", getedItem, " ", itemType, id, resource, " itemsA: ", this.itemResources[itemType], " itemsB: ", this.itemResources[itemType]);
    return getedItem.then(itemRes => this.getItem(itemRes, id, resource));
  }

  protected getItem(data, id, resource) {
    console.log(data);
    return data[resource].find(item => this.checkTypeId(item, 'customer').id == id);
  }

}
