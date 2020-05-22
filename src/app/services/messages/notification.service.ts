import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) {
    toastr.toastrConfig.positionClass = "toast-top-left";
  }

  /** show toast */
  show(message?: string, title?: string, pos?) {
    this.toastr.show(message, title, pos);
  }

  /** show success toast */
  success(message, title, pos?) {
    this.toastr.success(message, title, pos);
  }

  /** show error toast */
  errors(title, message, pos?) {
    this.toastr.error(title, message, pos);
  }

  /** show info toast */
  info(message?: string, title?: string, pos?) {
    this.toastr.info(message, title, pos);
  };
  /** show warning toast */
  warning(message?: string, title?: string, pos?) {
    this.toastr.warning(message, title, pos);
  };

  /**
 * Remove all or a single toast by id
 */
  clear(toastId?: number): void{
    
  }

  /**
   * Remove and destroy a single toast by id
   */
  remove(toastId: number): boolean{
    return true;
  }

  /**
   * Determines if toast message is already shown
   */
  // findDuplicate(message: string, resetOnDuplicate: boolean, countDuplicates: boolean): ActiveToast<any>{
    
  // }
}
