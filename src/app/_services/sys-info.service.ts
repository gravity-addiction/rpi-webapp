import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SysInfoService {

  private _sysCalls = {
    staticInfo: {
      init: false,
      url: '/api/sysinfo/static',
      sub: new BehaviorSubject<any>(null)
    },
    networkInfo: {
      init: false,
      url: '/api/sysinfo/network',
      sub: new BehaviorSubject<any>(null)
    },    
    cpuInfo: {
      init: false,
      url: '/api/sysinfo/cpu',
      sub: new BehaviorSubject<any>(null)
    },
    memInfo: {
      init: false,
      url: '/api/sysinfo/memory',
      sub: new BehaviorSubject<any>(null)
    },
    diskInfo: {
      init: false,
      url: '/api/sysinfo/disk',
      sub: new BehaviorSubject<any>(null)
    },
    processInfo: {
      init: false,
      url: '/api/sysinfo/processes',
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
    private _http: HttpClient
  ) { }


  public getSysCall(syscall) {
    if (!this._sysCalls.hasOwnProperty(syscall)) { return of(null); }
    if (!this._sysCalls[syscall].init) { this.refreshSysCall(syscall); }
    return this._sysCalls[syscall].sub;
  }

  public sortSysCall(syscall, sortby) {
    const sysCall = this._sysCalls[syscall];
    sysCall.sortField = sortby;
    if (sysCall.hasOwnProperty('sort')) {
      sysCall.sort(sysCall.sub.value);
    }
  }

  public refreshSysCall(syscall) {
    const sysCall = this._sysCalls[syscall];
    sysCall.init = true;
    this._http.get(sysCall.url).subscribe(data => {
      if (sysCall.hasOwnProperty('sort')) {
        sysCall.sort(data);
      } else {
        sysCall.sub.next(data);
      }
    });
  }
}
