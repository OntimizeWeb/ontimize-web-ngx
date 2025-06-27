import { TestBed } from '@angular/core/testing';

import { OFilterManagerService } from './filter-manager.service';

describe('TableFilterService', () => {
  let service: OFilterManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OFilterManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
