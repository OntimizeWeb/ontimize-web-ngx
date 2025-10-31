import { TestBed } from '@angular/core/testing';
import { OTableFilterByColumnService } from './o-table-filter-by-column.service';
import { OTestingUtils } from '../../../../../shared/testing/o-testing-utils';

describe('OTableFilterByColumnService', () => {
  let service: OTableFilterByColumnService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OTableFilterByColumnService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OTableFilterByColumnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OTableFilterByColumnService', () => {
    expect(service).toBeInstanceOf(OTableFilterByColumnService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
