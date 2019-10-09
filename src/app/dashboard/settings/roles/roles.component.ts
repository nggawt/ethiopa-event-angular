import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from 'src/app/services/http-service/http.service';
import { Observable } from 'rxjs';
import { finalize, take, filter, takeWhile, first, last, takeLast, tap, endWith } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {

  admin$: Observable<{}>;

  constructor(private http: HttpService, private router:Router) { }

  ngOnInit() {
    this.admin$ = this.http.userObs.pipe(filter(item => typeof item == "boolean" || typeof item == "object"), endWith(false),tap(item => console.log(item)));//.subscribe(user => console.log(user));takeWhile(item => typeof item == "boolean" || typeof item == "object"),
    // last
  }

  checked(item){
    item.value = ! item.value;
  }
}
