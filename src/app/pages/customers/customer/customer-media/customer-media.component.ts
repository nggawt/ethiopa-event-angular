
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { HallType } from '../../../../customers/hall-type';
import { CustomersDataService } from '../../../../customers/customers-data-service';
import { Observable, of, Subscription } from 'rxjs';
import { HelpersService } from 'src/app/services/helpers/helpers.service';
declare var $: any;

@Component({
  selector: 'app-customer-media',
  templateUrl: './customer-media.component.html',
  styleUrls: ['./customer-media.component.css']
})
export class CustomerMediaComponent implements OnInit, OnDestroy {
  customer: Observable<HallType>;;
  galleries:any;
  videos:any;
  snap: boolean = true;
  custSubscriber: Subscription;

  @Input() currentCustomer: Observable<{}>;
  constructor(private hlFn: HelpersService) { }

  ngOnInit() {
    
    // this.allowPage.emit(false);
    
    this.custSubscriber = this.currentCustomer.subscribe(data =>{
      let co = data['customer'];
      let gal = data['gallery'];
      
      this.snap = true;
      this.customer = of(co); 
      this.galleries = Array.isArray(gal['images'])? gal['images']: typeof gal['images'] == "object"? this.hlFn.itemsToArray(gal['images']): [];
      this.videos = Array.isArray(gal['video'])? gal['video']: typeof gal['video'] == "object"? this.hlFn.itemsToArray(gal['video']): [];
      // let msgs = localStorage.getItem('msgs');
      // console.log(JSON.parse(msgs));
      // console.log(this.allowPage);
      
      this.carouselInit();
    });
  }

  carouselInit(){
    setTimeout(() =>{
      $(".carousel").carousel();
    },1000)
  }

  itemsToArray(items: {}){
    let arr = [];
    for(let ii in items){
      arr.push(items[ii]);
    }
    return arr;
  }

  galActiveItem(ii){
    let item = $(".carousel-indicators")[0].children[ii];
    item.click();
  }

  vidActiveItem(ii){
    
    //$(".carousel-indicators")[0].children[ii].click();

  }

  setSnapShut(event){
    //timeupdate//vid.currentTime;
    // console.log(event);
    let video = event.target;
    video.removeEventListener(event.type, this.setSnapShut);
    if(this.snap){
      video.currentTime = 5;
      video.load;

      /* Test */
        /* let vidUrl = this.videos[0],
        video = document.createElement('video'),
        vidSource = document.createElement('source'),
        vidName = vidUrl.slice(vidUrl.indexOf('video/')).split('video/')[1];
        vidSource.src = vidUrl;
        vidSource.type = "video/mp4";
        vidSource['alt'] = vidName;
        video.appendChild(vidSource);
        video.currentTime = 5;
        video.load; */
        // console.log(video);
        // resualt:: fire fox wont work
      /* END Test */

      let imgParent = document.getElementById("canvasImage"),
        img = new Image(120, 90);
        // img['src'] = '/';
      img.style.cursor = "pointer";
      imgParent.className += " p-1";
      imgParent.appendChild(img);


      // START Test 2
      // this.drawImageSnapShut(video, (imgUrl, evt, fn/* vid, canvas, ctx, w, h, cbk */) => {
      //   img['src'] = imgUrl;
      //   video.removeEventListener("oncanplaythrough", fn);
      //   console.log(fn);
        /* if(vid.readyState == 4){
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(vid, 0, 0, w, h);
          let imgData:string = canvas.toDataURL('image/jpeg', 1.0);
          img['src'] = imgData;
          // video.currentTime = 1;
          // video.load;
          console.log(cbk);
          console.log(imgData);
          // vid.removeEventListener("oncanplaythrough", cbk);
        } */
        // video.currentTime = 0;
        // video.load;
      // });
      // setTimeout(() =>{
      //   // video.currentTime = 0;
      //   video.load;
      // }, 2000);
      // let promissStr:string = await promise;
      // img['src'] = await promise;
      // console.log(promise);
      
      // END Test 2

      // Test 3
      this.drawImageSnapShut(video, async (imgSrc, evt, cbk) => {

            if(this.snap){
              
              img['src'] = await imgSrc;
              video.currentTime = 0;
              video.load;
              img.addEventListener("click", this.playVideo.bind(null, video),false);
              video.removeEventListener(evt.type, cbk);
              // console.log(evt.type);
            }
          });

        // END Test 3
    }else{
      // video.addEventListener("canplaythrough", this.playVideo);
    }

  }

  async drawImageSnapShut(video, callback?){
   
    // console.log("drawImageSnapShut called");
    if(this.snap){

      let canvas = document.createElement('canvas'),
        context = canvas.getContext("2d"),
        ratio = video.videoWidth / video.videoHeight, w, h;

      w = video.videoWidth - 100;
      h = w / ratio;
      canvas.width = w;
      canvas.height = h;

        let fn;
        fn = await video.addEventListener("canplaythrough", async (evt) => {
          // console.log(video.readyState);
          if(await video.readyState == 4 && this.snap){
            await context.fillRect(0, 0, w, h);
            await context.drawImage(video, 0, 0, w, h);
            
            let imgData:string = await canvas.toDataURL();//'image/jpg'
            await callback(imgData, evt, fn);
             
            this.snap = false;
            // console.log(evt.type);
          }
        }, false);
      }
  }

  playVideo(vid){
    let video: HTMLVideoElement = typeof vid == "string"?<HTMLVideoElement>document.getElementById(vid):vid;
    
    // console.log(video);
    video.paused? video.play(): video.pause();
  }

  ngOnDestroy(){
    this.custSubscriber.unsubscribe();
  }
}
