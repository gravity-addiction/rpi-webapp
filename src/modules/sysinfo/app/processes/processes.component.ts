import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { CacheService } from 'app/_services/cache.service';

import { SysInfoService } from '../_services/sys-info.service';

@Component({
  selector: 'app-processes',
  templateUrl: './processes.component.html',
  styleUrls: ['./processes.component.css']
})
export class ProcessesComponent implements OnInit, OnDestroy {
  processList$: Subscription;
  apiDevice$: Subscription;

  constructor(
    private cacheService: CacheService,
    private sysInfoService: SysInfoService
  ) { }

  ngOnInit() {
    this.processList$ = this.sysInfoService.getSysCall('processInfo');

    this.apiDevice$ = this.cacheService.apiDevice$.subscribe(() => this.refresh());
  }

  ngOnDestroy() {
    try { this.apiDevice$.unsubscribe(); } catch(e) { }
  }

  
  refresh(force = false) {
    this.sysInfoService.refreshSysCall('processInfo', force);
  }

  sort(sortBy) {
    this.sysInfoService.sortSysCall('processInfo', sortBy);
  }

}
