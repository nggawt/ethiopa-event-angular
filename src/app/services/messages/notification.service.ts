import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { 
    toastr.toastrConfig.positionClass = "toast-top-left";
  }

  showSuccess(message, title, pos?) {
    this.toastr.success(message, title, pos);
  }

  showErrors(title, message, pos?) {

    this.toastr.error(title, message, pos);
  }
}
