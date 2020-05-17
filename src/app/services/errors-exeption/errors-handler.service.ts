import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorsHandler implements ErrorHandler {

  handleError(error: Error | HttpErrorResponse) {
    
    if (error instanceof HttpErrorResponse) {
    console.warn('It happens: ', error);
    // Server or connection error happened
      if (!navigator.onLine) {
        // Handle offline error
      } else {
        // Handle Http Error (error.status === 403, 404...)
      }
    } else {
      // Handle Client Error (Angular Error, ReferenceError...)     
    }
    // Log the error anywa
  }
}
