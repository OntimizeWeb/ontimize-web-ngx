import { TestBed } from '@angular/core/testing';

import { OTableFilterByColumnService } from './o-table-filter-by-column.service';

describe('OTableFilterByColumnService', () => {
  let service: OTableFilterByColumnService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OTableFilterByColumnService]
    });
    service = TestBed.inject(OTableFilterByColumnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
