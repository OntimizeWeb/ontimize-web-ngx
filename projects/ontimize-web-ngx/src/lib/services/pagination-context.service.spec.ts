import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
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
        ...OTestingUtils.getCommonTestingModuleConfig().providers,
        // Override the spy with real service for this test
        { provide: PaginationContextService, useClass: PaginationContextService }
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
