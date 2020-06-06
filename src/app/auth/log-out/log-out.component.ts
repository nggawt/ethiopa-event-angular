import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http-service/http.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.css']
})
export class LogOutComponent implements OnInit {

  constructor(private http: HttpService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    
    // this.http.logOut().subscribe(evt =>{

     
    //   // prevUrl.splice(prevUrl.length -1,1);
    //   //let redirectUrl = prevUrl.join('/')?  prevUrl.join('/') : "/";

    //   //console.log(redirectUrl);
    //   // this.router.navigate([splitUrl], { relativeTo: this.route });

    //   // this.router.navigate(['/']);
    // });
    // let prevUrl =  decodeURIComponent(this.http.redirectUrl);

    // let splitUrl:any = (prevUrl.indexOf('halls-events') >= 0)? prevUrl.split("/"): false;
    //     splitUrl = splitUrl && (splitUrl[1] && splitUrl[2])? splitUrl[1]+"/"+splitUrl[2]+"/media" : "/";
    //       console.log(splitUrl);
    //   this.router.navigate([splitUrl]);
    //       // this.router.navigate(['/']);
  }
}
