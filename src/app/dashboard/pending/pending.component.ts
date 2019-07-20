import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.css']
})
export class PendingComponent implements OnInit {

  @Input() itemsLists;
  
  constructor() { }

  ngOnInit() {
    
    let conf = {
      config: {
        currentPage: 1,
        id: "pending",
        itemsPerPage: 3,
        totalItems: this.itemsLists.pending.length
      },
      count: this.itemsLists.pending.length,
      pending:  this.itemsLists.pending
    };
    // let copyConf = Object.assign({}, conf);

    this.itemsLists = Object.assign({}, conf);
    // console.log(this.itemsLists);
    // Object.assign(this.itemsLists.config, {totalItems: this.itemsLists.pending.length})
    
    // this.itemsLists.config.totalItems = this.itemsLists.pending.length
  }

}
