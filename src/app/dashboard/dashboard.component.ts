import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { Subscription, ObjectUnsubscribedError } from 'rxjs';

import { SysInfoService } from '../_services/sys-info.service';
import { CacheService } from '../_services/cache.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
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
  }
  

}
