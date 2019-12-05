import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Location } from '@angular/common';
import { Observable, Subject, Subscription, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CacheService } from 'app/_services/cache.service';
import { StorageService } from 'app/_services/storage.service';

import * as urljoin from 'url-join';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authSource = new Subject();
  authRefreshed$ = this.authSource.asObservable();
  authFailed = new Subject();

  deleteAuthSubscription: Subscription;

  userParseFunc: Function;

  private _token_key = '_JWT';

  private _authToken: string;
  public get authToken() { return this._authToken; }

  constructor(
    private cacheService: CacheService,
    private http: HttpClient,
    private _location: Location,
    private _storage: StorageService
  ) {
    this._storage.get(this._token_key).then(val => {
      this._authToken = val;
      this.authSource.next(true);
    });
  }

  setUserService(userParseFunc) {
    this.userParseFunc = userParseFunc;
  }

  setAuthToken(_token_val: string) {
    this._authToken = _token_val;
    this._storage.set(this._token_key, _token_val);
  }

  delAuthToken() {
    this._authToken = '';
    this._storage.delete(this._token_key);
  }
  
  authStatusChanged() {
    this._storage.move(this._token_key, this._authToken);
    this._storage.setPersistantStorageLevel();
  }

  login(username: string, password: string, rememberme: boolean = false, device = 'local', forwardTo: string = '/'): Observable<HttpResponse<any>> {
    const apiUrl = (this.cacheService.apiUrls || []).find((a) => a.device === device);
    if (!apiUrl) {
      this.authFailed.next('No Host Defined For ' + device + ' in apiUrls Cache Service');
      return of(null);
    }

    return this.http.post<any>(
        urljoin(apiUrl.url, 'authenticate'),
        { username: username, password: password, rememberme: rememberme },
        { observe: 'response' }
    ).
    pipe(
      tap((resp) => {

        if (rememberme) {
          this._storage.setPersistantStorageLevel(true);
        } else {
          this._storage.setPersistantStorageLevel(false);
        }

        if (this.userParseFunc) { this.userParseFunc(); }
        this.authSource.next(true);
        if (resp.status === 200) {
          // Change Password
          // this._location.replaceState('/changepassword?returnUrl=' + encodeURIComponent(forwardTo));
          // (<any>window).location = '/changepassword?returnUrl=' + encodeURIComponent(forwardTo);
          // this.router.navigateByUrl('/changepassword?returnUrl=' + encodeURIComponent(forwardTo));
          this._location.replaceState(forwardTo);

        } else if (resp.status === 204 && forwardTo) {
          // Previous Page
          this._location.replaceState(forwardTo);
          // (<any>window).location = forwardTo;
          // this.router.navigateByUrl(forwardTo);
        }
      }, (err: any) => {
        this.authFailed.next(err);
      })
    );
  }

  logout(forwardTo: (Array<any> | string) = '/'): void {
    this.delAuthToken();
    this.authSource.next(false);
//    setTimeout(() => {
//      (<any>window).location = '/';
//    }, 250);
    /*
    if (Array.isArray(forwardTo) && forwardTo.length) {
      this.router.navigate(forwardTo);
    } else if (forwardTo) {
      (<any>window).location = forwardTo;
      // this.router.navigate([forwardTo]);
    }
    */
  }

  deleteLogout(cb: any, host = 'local') {
    this.delAuthToken();
    cb();
  }

}
