import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { Observable } from 'rxjs';
import { filter, tap, endWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service/auth.service';


@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
  itemsResources$: Observable<{}>;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.itemsResources$ = this.auth.userObs.pipe(filter(item => typeof item == "boolean" || typeof item == "object"), endWith(false),tap(item => console.log(item)));//.subscribe(user => console.log(user));takeWhile(item => typeof item == "boolean" || typeof item == "object"),
    // last
  }

  checked(item){
    item.value = ! item.value;
  }
}
