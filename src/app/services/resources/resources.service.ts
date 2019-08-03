import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';
import { HttpService } from '../http-service/http.service';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
  /* pagination */
  private resources: BehaviorSubject<{}> = new BehaviorSubject(1);
  public resourcesObsever = this.resources.asObservable();

  private pagintedResources = {};

  private inProcces: {[key: string]: boolean} = {};
  private itemResources = {};

  constructor(private http: HttpService, private route: ActivatedRoute) { }

  async initResources(items, paginate?:boolean) {
     await this.regiterResources(items, paginate);
  }

  emmitResources(resources) {
    this.resources.next(resources);
  }

  protected regiter(url): Promise<any> {
      
    return (! this.itemResources[url])? this.http.getData(url).pipe(map(resources => this.checkHasKey(resources, 'status') ? false :resources), 
            tap(item => {
              // console.log("called to server whith url: ", url, " response: ", item, " this.inProcces ", this.inProcces);
              this.inProcces[url] = false;
              // this.itemResources[url] = item;
            })).toPromise().catch(this.handleError): this.itemResources[url];
  }

  protected handleError(err){
    console.log(err);
  }

  async regiterResources(items: string | string[], paginate){
    

    if(Array.isArray(items)){
      await items.reduce(
        async (resource: {}, ResourceName: string) => {

          if(! this.itemResources[ResourceName]) this.inProcces[ResourceName] = true;

          let itemsData = this.itemResources[ResourceName]? this.itemResources[ResourceName]: 
              this.pagintedResources[ResourceName]? this.pagintedResources[ResourceName]: await this.regiter(ResourceName);

          if(paginate &&  itemsData){
            this.pagintedResources[ResourceName] = await this.pagination(itemsData, ResourceName);
            await this.setResourcesData(ResourceName, itemsData);
          }else{
            itemsData? await this.setResourcesData(ResourceName, itemsData): [];
          }
        }, {});
    } else if(typeof items == "string"){
      let resource = this.itemResources[items]? this.itemResources[items]: 
              this.pagintedResources[items]? this.pagintedResources[items]: await this.regiter(items);

      paginate? this.pagintedResources[items] = await this.pagination(resource, items): '';
      await this.setResourcesData(items, resource);
    }
  
    if(Object.keys(this.pagintedResources).length && paginate){
      this.emmitResources(this.pagintedResources);
      // console.log("name: paginated ", items);
    } 
  }

  protected setResourcesData(res:string, data: any){

    this.itemResources[res] =  data && data[res]?  data[res]:  data;
    // console.log("data current: ", data, "name: ", res, "rsources: ", this.itemResources);
  }

  async pagination(resource: {}, resourceName:string){
    (resourceName == "customers" && ! resource[resourceName])? resource = {[resourceName]: resource}: '';
    let mapedItems = await this.mapItems(resource),
          paginated = await this.dataPaginated(resourceName, mapedItems);
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

    } else if(items && items.length){
      arr['activeated'] = this.getActivivated(items, 'confirmed');
      arr['pending'] = this.getPendinding(items, 'confirmed');
    }
    return arr;
  }

  protected dataPaginated(urlIndicetor, resources) {

    return {
      count: resources.activeated.length,
      data: resources.activeated,
      pending: resources.pending,
      config: {
        id: urlIndicetor,
        itemsPerPage: 3,
        currentPage: 1,
        totalItems: resources.activeated.length
      }
    };
  }

  objectToArray(items){
    let arr = [];
    for(let item of items){
      arr.push(item);
    }
    return arr;
  }

  protected getCustomersItems(customers) {
    let customersArray = [];
    Object.keys(customers).forEach(customersType => customers[customersType].forEach(item => {
      let customer =  { customer: item['customer'], gallery: item['gallery']};
      customersArray.push(customer);
    }));
    return customersArray;
  }

  findItem(id, itemType): Observable<{}> {
    console.log('id: ' + id, 'item type: ' + itemType);
    return this.resourcesObsever.pipe(
      // tap(item => console.log(item)),
      filter(items => items[itemType] && items[itemType].data),
      map(items => [...items[itemType].data, ...items[itemType].pending].find(item => this.checkTypeId(item, 'customer').id == id)));//item? this.itemForm(item): ''
  }

  checkTypeId(itemOb, key) {
    return itemOb[key] ? itemOb[key] : itemOb;
  }

  protected getActivivated(items, key){
    return items.filter(item => this.checkTypeId(item, 'customer')[key] || ! this.checkHasKey(this.checkTypeId(item, 'customer'), key));
  }

  protected getPendinding(items, keyObj: string){
    return items.filter(item => (this.checkHasKey(this.checkTypeId(item, 'customer'), keyObj) && this.checkTypeId(item, 'customer')[keyObj] === false));
  }
  
  protected checkHasKey(item, key) {
    return (key in item) ? true : false;
  }

  async getResources(items: string, paginate: boolean){
    
    paginate? paginate: false;

    // console.log(this.inProcces[items]);
    if(this.itemResources[items] && this.inProcces[items]){ 
      return await this.itemResources[items];
    }else{
      this.inProcces[items] = true;
      await this.initResources(items, paginate);
      return await this.itemResources[items];
    }
  }


  getItemResource(itemType, id,  resource, paginate){
    
    paginate = paginate? paginate: false;
    
    console.log(this.itemResources, itemType, id,  resource, paginate);
    if(this.itemResources[itemType]){
      // let items = itemType == "customers"? this.itemResources[itemType][resource]: this.itemResources[itemType];
      
      let itemRes =  this.getItem(this.itemResources[itemType], id, resource);
      
      return new Promise((res, rej) => res(itemRes));
    }
    let getedItem = this.getResources(itemType, paginate);
    console.log("getedItem: ", getedItem, " ", itemType, id,  resource, " itemsA: ", this.itemResources[itemType], " itemsB: ", this.itemResources[itemType]);
    return getedItem.then(itemRes =>  this.getItem(itemRes, id, resource));
  }

  protected getItem(data, id, resource){
    console.log(data);
    return data[resource].find(item => this.checkTypeId(item, 'customer').id == id);
  }

  public block(message){
    
    let url = 'messages/'+ message.id+'/block';
    console.log(message);
    let date = new Date();
    let nextTwoWeeks = new Date(date.setDate(date.getDate() + 14)),
        dt = nextTwoWeeks.getFullYear()+"-"+nextTwoWeeks.getMonth()+"-"+nextTwoWeeks.getDate()+" "+
        nextTwoWeeks.getHours()+":"+nextTwoWeeks.getMinutes();//+":"+nextTwoWeeks.getMilliseconds();
    
    let hardcodedUrl = 'users/3?_method=patch';
    console.log(dt);
    
    this.http.postData(url, { banned_until: dt, city: 'יבנה'}).subscribe(response =>{
      console.log(response);
    });
  }
}
