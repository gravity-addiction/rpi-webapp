import { Injectable, Inject, InjectionToken } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError, timeout } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');


@Injectable()
export class AppInterceptor implements HttpInterceptor {
  private _storageService;


  constructor(
    @Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number
  ) { }


  processSuccessResponse(request: HttpRequest<any>, next: HttpHandler, event: HttpResponse<any>): void {

  }

  processErrorResponse(request: HttpRequest<any>, next: HttpHandler, error: any): HttpRequest<any> {
    if (error.status === 401) { // No Token Force Full Login


    } else if (error.status === 403) {
      // console.log('Error 403', error.error);
      // alert('You do not have permission to access this resource.');

    } else if (error.status === 498) {
      // console.log('Error 498', error.error);

    } else if (error.status === 500) {
      // console.log('Error 500', error.error);
      // alert('Server Error, Please try Again.');

    } else if (error.status === 503) {
      // console.log('Error 503', error.error);
      // alert('Service Current Unavailable, Please Try Again.');

    } else {
      // console.log('Error UnSpecd ', error.status, error.error);
    }

    return request;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const timeoutValue = request.headers.get('timeout') || this.defaultTimeout;
    const timeoutValueNumeric = Number(timeoutValue);

    return next.handle(request).pipe(
      timeout(timeoutValueNumeric),
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.processSuccessResponse(request, next, event);
        }
        return event;
      }),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          return throwError(this.processErrorResponse(request, next, err));
        } else {
          return throwError(err);
        }
      })
    );  
  }

}
