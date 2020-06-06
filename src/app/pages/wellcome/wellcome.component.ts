import { Component, OnInit, OnDestroy } from '@angular/core';
import { PagesService } from '../../services/pages-service/pages-service';

declare var $: any;

@Component({
  selector: 'app-wellcome',
  templateUrl: './wellcome.component.html',
  styleUrls: ['./wellcome.component.css'],
  providers: [PagesService]
})

export class WellcomeComponent implements OnInit, OnDestroy {

  constructor(private pageSrv: PagesService) { }


  ngOnInit() {

    //let pt = decodeURIComponent(window.location.pathname).slice(1) === '' ? true : false;
    let id = this.pageSrv.getCurrentUrl()["id"];
    let currentUrl = this.pageSrv.getCurrentUrl()["currUrl"];

    //animate wellcome component
    if (id > 1 && currentUrl === "/"){
      $('.carousel').carousel();
    } 
    this.animateItems();
  }

  animateItems() {

    $(function () {
      let cef1 = $(".costum-effect1"),
        cef2 = $(".costum-effect2"),
        cef3 = $(".costum-effect3"),
        cef4 = $(".costum-effect4"),
        cef5 = $(".costum-effect5"),
        cef6 = $(".costum-effect6");
      $(window).scroll(function () {
        let scl = $(document).scrollTop();
        if (scl >= 600 && cef1.css("left") !== "0px") cef1.animate({ left: "0px", opacity: 1 }, 600);
        if (scl >= 600) cef2.addClass("scale-1");
        if (scl >= 1300 && cef3.css("right") !== "0px") cef3.animate({ right: "0px", opacity: 1 }, 600);
        if (scl >= 1300) cef4.addClass("scale-1");
        if (scl >= 1900) cef5.addClass("scale-1");
        if (scl >= 1900) cef6.addClass("scale-1");
      });
      $(".rounded-circle").addClass("scale-1");
      $(".market-text").addClass("scale-1");
    });
  }

  ngOnDestroy() {
    // console.log('page service destroyede!');
    if (this.pageSrv.pagesSubscription) this.pageSrv.pagesSubscription.unsubscribe();
  }
}
