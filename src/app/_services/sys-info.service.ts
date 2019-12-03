import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
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

  constructor(
    private _http: HttpClient,
    private _cacheService: CacheService
  ) { }


  public getSysCall(syscall, host = 'local') {
    if (!this._sysCalls.hasOwnProperty(syscall)) { return of(null); }
    if (!this._sysCalls[syscall].init) { this.refreshSysCall(syscall, host); }
    return this._sysCalls[syscall].sub;
  }

  public sortSysCall(syscall, sortby) {
    const sysCall = this._sysCalls[syscall];
    sysCall.sortField = sortby;
    if (sysCall.hasOwnProperty('sort')) {
      sysCall.sort(sysCall.sub.value);
    }
  }

  public refreshSysCall(syscall, host = 'local') {
    if (!this._cacheService.apiUrl.hasOwnProperty(host)) {
      console.log('No Host Defined For', host, 'in apiUrls Cache Service');
      return;
    }
    const sysCall = this._sysCalls[syscall];
    sysCall.init = true;

    this._http.get(
      urljoin(this._cacheService.apiUrl[host], sysCall.url),
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
