import { TestBed } from '@angular/core/testing';
import { PaginationContextService } from './pagination-context.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('PaginationContextService', () => {
  let service: PaginationContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        PaginationContextService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(PaginationContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of PaginationContextService', () => {
    expect(service).toBeInstanceOf(PaginationContextService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
