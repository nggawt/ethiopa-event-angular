import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
  private resources: BehaviorSubject<any> = new BehaviorSubject(1);
  public resourcesObsever = this.resources.asObservable();
  
  constructor() { }

  emitResources(resources){
    this.resources.next(resources);
  }

  findItem(id, itemType){
    console.log('id: '+ id, 'item type: '+ itemType);
    return this.resourcesObsever.pipe(
      tap(item => console.log(item)),
      filter(items => items[itemType] && items[itemType].data),
      map(items => [...items[itemType].data, ...items[itemType].pending].find(item => this.checkTypeId(item).id == id)));//item? this.itemForm(item): ''
  }

  checkTypeId(itemOb){
    return itemOb['customer']? itemOb['customer']: itemOb;
  }
}
