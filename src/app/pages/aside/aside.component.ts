import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  /*
  displayItems(){

    $(function(){
      if (window.matchMedia('(min-width: 1200px)').matches) {
        //...
        console.log("yes");
        this.displayItem = true;
      } else {
          //...
          console.log("no");
          this.displayItem = false;
      }
      //console.log($("aside ul li")[0]);
      
    });
    
  }
  */
}
