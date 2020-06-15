import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '../../../../node_modules/@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {
  errorsMsg:any;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    //console.log(this.route.snapshot.url);
    this.route.data.subscribe(
      (data:Data) => {
        this.errorsMsg = data["errorMsg"];
      }
    );
  }

}
