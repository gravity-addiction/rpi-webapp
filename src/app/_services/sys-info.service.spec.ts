import { TestBed } from '@angular/core/testing';

import { SysInfoService } from './sys-info.service';

describe('SysInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SysInfoService = TestBed.get(SysInfoService);
    expect(service).toBeTruthy();
  });
});
