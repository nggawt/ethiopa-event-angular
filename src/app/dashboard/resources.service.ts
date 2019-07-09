import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';
import { HttpService } from '../services/http-service/http.service';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
  private resources: BehaviorSubject<{}> = new BehaviorSubject(1);
  public resourcesObsever = this.resources.asObservable();

  private itemResources = {};

  constructor(private http: HttpService) { }

  async initResources(items) {
    Array.isArray(items)? this.loopItems(items): await this.loopItems([items]);
    if(typeof items == "string") return this.getItems(items);
  }

  emitResources(resources) {
    this.resources.next(resources);
  }

  async resourceCaller(url) {
      
      return await this.http.getData(url).pipe(map(resources => this.checkHasKey(resources, 'status') ? false : this.mapItems(resources))).toPromise();
  }

  protected handleError(err){
    console.log(err);
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

  async loopItems(items){
    
    for await (let element of items){
      let itemsData = await this.resourceCaller(await element)
      console.log(itemsData, element);
      
      itemsData? this.itemResources[element] = await this.dataPaginated(element, itemsData): itemsData;
    }
    this.resources.next(this.itemResources);
  }

  protected getCustomersItems(customers) {
    let customersArray = [];
    Object.keys(customers).forEach(customersType => customers[customersType].forEach(item => {
      let customer =  { customer: item['customer'], gallery: item['gallery'] };
      customersArray.push(customer);
    }));
    return customersArray;
  }

  checkHasKey(item, key) {
    return (key in item) ? true : false;
  }

  protected mapItems(items) {

    let arr = {
      activeated: [],
      pending: []
    };
    
    if (items['customers'] && typeof items['customers'] == "object") {
      
      let customers = this.getCustomersItems(items['customers']);
      // console.log(customers);
      arr['activeated'] = customers.filter(item => item['customer'].confirmed || !this.checkHasKey(item['customer'], 'confirmed'))
      arr['pending'] = customers.filter(item => this.checkHasKey(item['customer'], 'confirmed') && item['customer'].confirmed === false)

    } else if(items && items.length){
      arr['activeated'] = items.filter(item => item.confirmed || !this.checkHasKey(item, 'confirmed'));
      arr['pending'] = items.filter(item => this.checkHasKey(item, 'confirmed') && item.confirmed === false);
    }
    return arr;
  }

  findItem(id, itemType) {
    // console.log('id: ' + id, 'item type: ' + itemType);
    return this.resourcesObsever.pipe(
      filter(items => items[itemType] && items[itemType].data),
      map(items => [...items[itemType].data, ...items[itemType].pending].find(item => this.checkTypeId(item).id == id)));//item? this.itemForm(item): ''
  }

  checkTypeId(itemOb) {
    return itemOb['customer'] ? itemOb['customer'] : itemOb;
  }

  getAll(){

  }

  async getItems(items: string){
    return await this.itemResources[items];
  }
}
