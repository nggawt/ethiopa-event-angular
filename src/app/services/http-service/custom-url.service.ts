import { Injectable } from '@angular/core'; 

@Injectable({
  providedIn: 'root'
})

export class CustomUrlService {

  public intendedUri: string;
  public currentUrl: string;

  public requestUrl: string | boolean;
  public loginTo: string | boolean;
  public sendTo: string;

  constructor() { }

}
