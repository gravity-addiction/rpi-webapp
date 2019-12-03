import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { CacheService } from './cache.service';
import * as urljoin from 'url-join';

@Injectable({
  providedIn: 'root'
})
export class SysInfoService {

  private _sysCalls = {
    staticInfo: {
      init: false,
      url: '/sysinfo/static',
      sub: new BehaviorSubject<any>(null)
    },
    os: {
      init: false,
      url: '/sysinfo/os',
      sub: new BehaviorSubject<any>(null)
    },
    networkInfo: {
      init: false,
      url: '/sysinfo/network',
      sub: new BehaviorSubject<any>(null)
    },    
    cpuInfo: {
      init: false,
      url: '/sysinfo/cpu',
      sub: new BehaviorSubject<any>(null)
    },
    memInfo: {
      init: false,
      url: '/sysinfo/memory',
      sub: new BehaviorSubject<any>(null)
    },
    diskInfo: {
      init: false,
      url: '/sysinfo/disk',
      sub: new BehaviorSubject<any>(null)
    },
    processInfo: {
      init: false,
      url: '/sysinfo/processes',
      sub: new BehaviorSubject<any>(null),
      sortField: 'pmem',
      sort: (data) => {
        const sortBy = this._sysCalls.processInfo.sortField || Object.keys(data)[0];
        (((data || {}).processes || {}).list || []).sort((a: any, b: any) => 
          (a[sortBy] > b[sortBy]) ? -1 : ((a[sortBy] < b[sortBy]) ? 1 : 0)
        );
        this._sysCalls.processInfo.sub.next(data);
      }
    }
    
  };

  private apiDevice$: Subscription;

  constructor(
    private _http: HttpClient,
    private _cacheService: CacheService
  ) {
    this.apiDevice$ = this._cacheService.apiDevice$.subscribe(() => {
      const sysKeys = Object.keys(this._sysCalls),
            sysI = sysKeys.length;

      for (let i = 0; i < sysI; i++) {
        this._sysCalls[sysKeys[i]].sub.next(null);
        this._sysCalls[sysKeys[i]].init = false;
      }
    });
  }

  public getSysCall(syscall) {
    if (!this._sysCalls.hasOwnProperty(syscall)) { return of(null); }
    return this._sysCalls[syscall].sub;
  }

  public sortSysCall(syscall, sortby) {
    const sysCall = this._sysCalls[syscall];
    sysCall.sortField = sortby;
    if (sysCall.hasOwnProperty('sort')) {
      sysCall.sort(sysCall.sub.value);
    }
  }

  public refreshSysCall(syscall, force = false) {
    const apiUrl = (this._cacheService.apiUrls || []).find((a) => a.device === this._cacheService.apiDevice);
    if (!apiUrl) {
      console.log('No Device Defined For', this._cacheService.apiDevice, 'in apiUrls Cache Service');
      return;
    }
    const sysCall = this._sysCalls[syscall];
    if (!sysCall) {
      console.log('No System Call', syscall);
      return;
    }

    // don't reup if initilized, unless forced
    if (sysCall.init && !force) { return; }
    // Clean subject initialized and forced
    if (sysCall.init && force) { sysCall.sub.next(null); }

    sysCall.init = true;

    // kill old subscription;
    try { if (sysCall.$) { sysCall.$.unsubscribe(); } } catch(e) { }
    
    // make call
    sysCall.$ = this._http.get(
      urljoin(apiUrl.url, sysCall.url),
      // { headers: new HttpHeaders({ timeout: `${25000}` }) }
    ).
    subscribe(data => {
      if (sysCall.hasOwnProperty('sort')) {
        sysCall.sort(data);
      } else {
        sysCall.sub.next(data);
      }
    });
  }
}
