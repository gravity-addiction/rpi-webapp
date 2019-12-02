import { Component, OnInit } from '@angular/core';

import { SysInfoService } from '../_services/sys-info.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-processes',
  templateUrl: './processes.component.html',
  styleUrls: ['./processes.component.css']
})
export class ProcessesComponent implements OnInit {
  processList$: Subscription;

  constructor(
    private sysInfoService: SysInfoService
  ) { }

  ngOnInit() {
    this.processList$ = this.sysInfoService.getSysCall('processInfo');
  }

  sort(sortBy) {
    this.sysInfoService.sortSysCall('processInfo', sortBy);
  }

}
