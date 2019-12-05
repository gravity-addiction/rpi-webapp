import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { CacheService } from 'app/_services/cache.service';

import { SysInfoService } from '../_services/sys-info.service';


@Component({
  selector: 'app-system-info',
  templateUrl: './system-info.component.html',
  styleUrls: ['./system-info.component.css']
})
export class SystemInfoComponent implements OnInit {
  sysInfo: any = {};
  apiDevice$: Subscription;

  constructor(
    private cacheService: CacheService,
    private sysInfoService: SysInfoService
  ) { }

  ngOnInit() {
    this.sysInfo.static$ = this.sysInfoService.getSysCall('staticInfo');
    this.sysInfo.cpu$ = this.sysInfoService.getSysCall('cpuInfo');
    this.sysInfo.memory$ = this.sysInfoService.getSysCall('memInfo');
    this.sysInfo.disk$ = this.sysInfoService.getSysCall('diskInfo');
    this.sysInfo.network$ = this.sysInfoService.getSysCall('networkInfo');
    this.sysInfo.os$ = this.sysInfoService.getSysCall('os');
    
    this.apiDevice$ = this.cacheService.apiDevice$.subscribe(() => this.refresh());
  }

  ngOnDestroy() {
    try { this.apiDevice$.unsubscribe(); } catch(e) { }
  }

  refresh() {
    this.sysInfoService.refreshSysCall('staticInfo');
    this.sysInfoService.refreshSysCall('cpuInfo');
    this.sysInfoService.refreshSysCall('memInfo');
    this.sysInfoService.refreshSysCall('diskInfo');
    this.sysInfoService.refreshSysCall('networkInfo');
    this.sysInfoService.refreshSysCall('os');    
  }

}
