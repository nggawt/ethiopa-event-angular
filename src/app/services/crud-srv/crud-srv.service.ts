import { Injectable } from '@angular/core';
import { HttpService } from '../http-service/http.service';
declare var $: any;

@Injectable({
  providedIn: 'root'
})

export class CrudSrvService {

  constructor(private http: HttpService) { }

  destroy(items){
    
    let url = "users/"+items.id+"? _method=DELETE";
    this.http.postData(url, null).subscribe(response => {
      console.log(response);
    });
  }

/*   send(items: { [key: string]: string }, method: string): void {

    let url = 'users/' + this.itemData.id + '?_method=' + method;
    this.http.postData(url, items).subscribe(response => {
      console.log('response: ', response);
      if (response['status']) this.update(items, response);
    });
  }

  update(items, response?) {

    Object.keys(items).forEach(item => {
      this.itemData[item] = items[item];
    });

    this.mdProps.message = "אדמין עודכן בהצלחה";// "אדמין עודכן בהצלחה"; //response.messages.success.update[0];
    setTimeout(() => {
      $('#' + this.mdProps.id).click();
      this.mdProps.message = false;
    }, 3000)
  } */
}
