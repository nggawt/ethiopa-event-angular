import { Injectable } from '@angular/core';

@Injectable()
export abstract class UrlRedirect {
    protected urls = {
        sendEmail: "/password/email",
        passwordReset: '/password/reset',
        register: "/register",
        login: "/login"
      };

      exludedUrls(loc) {

        for (let url in this.urls) {
          if (url == loc) return true;
        }
        return false;
      }
    
      protected idxUrl(loc, path?: string): boolean {
        return (loc.indexOf(path) >= 0);
      }

      abstract redirect(urlParams?: string | boolean):void;
}