import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  constructor() { }/* private route: ActivatedRoute */

  ngOnInit() {

    /* this.messages$ = this.route.paramMap
      .pipe(map(() => window.history.state.data), tap(item => console.log(item))); */
      // console.log(this.msgs);
  }

}
