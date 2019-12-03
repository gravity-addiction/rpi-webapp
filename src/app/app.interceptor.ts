import { Injectable, Inject, Injector, InjectionToken } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError, timeout } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { AuthenticationService } from './_services/authentication.service';
import { StorageService } from './_services/storage.service';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');


@Injectable()
export class AppInterceptor implements HttpInterceptor {
  private _authService;
  private _storageService;


  private _allowAuthToHosts = ['localhost', 'skydiveorbust.com', 'd.skydiveorbust.com'];

  constructor(
    private injector: Injector,
    @Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number
  ) { }

  addAuthHeader(request) {
    this._authService = this.injector.get(AuthenticationService);
    const authToken = this._authService.authToken;
    this._storageService = this.injector.get(StorageService);
   
    if (!this._storageService.cookiesEnabled && authToken) {
      return request.clone({
        setHeaders: {
          "Authorization": `Bearer ${authToken}`
        }
      });
    }
    return request;
  }

  processSuccessResponse(request: HttpRequest<any>, next: HttpHandler, event: HttpResponse<any>): void {
    // do stuff with response if you want
    const body = request.body || {},
          rememberme = !!body.rememberme || false;

    this._authService = this.injector.get(AuthenticationService);
    const jwt = event.headers.get('x-jwt');
    
    if (jwt === 'unset') {
      // this._authService.logout([]);
    } else if (jwt) {
      this._authService.setAuthToken(jwt, rememberme);
    }
  }

  processErrorResponse(request: HttpRequest<any>, next: HttpHandler, error: any): Observable<HttpEvent<any>> {
    if (error.status === 401) { // No Token Force Full Login
      this._authService = this.injector.get(AuthenticationService);
      const jwt = request.headers.get('x-jwt');
      this._authService.setAuthToken(jwt);
      // console.log('Error 401', error.error);
      // this.authService.logout([]);

    } else if (error.status === 403) {
      // console.log('Error 403', error.error);
      // alert('You do not have permission to access this resource.');

    } else if (error.status === 498) {
      // console.log('Error 498', error.error);
      this._authService.logout([]);

    } else if (error.status === 500) {
      // console.log('Error 500', error.error);
      // alert('Server Error, Please try Again.');

    } else if (error.status === 503) {
      // console.log('Error 503', error.error);
      // alert('Service Current Unavailable, Please Try Again.');
    } else {
      // console.log('Error UnSpecd ', error.status, error.error);
    }

    return error;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const timeoutValue = request.headers.get('timeout') || this.defaultTimeout;
    const timeoutValueNumeric = Number(timeoutValue);

    const hostname = this.getLocation(request.url);
    if (this._allowAuthToHosts.indexOf(hostname) === -1) {
      return next.handle(request).pipe(timeout(timeoutValueNumeric));
    }

    this._authService = this.injector.get(AuthenticationService);
    request = this.addAuthHeader(request);

    return next.handle(request).pipe(
      timeout(timeoutValueNumeric)
    ).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.processSuccessResponse(request, next, event);
        }
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

  getLocation(href) {
    var l = document.createElement("a");
    try { l.href = href; } catch(e) { }
    return (l || {'hostname': ''}).hostname || '';
  }
}
