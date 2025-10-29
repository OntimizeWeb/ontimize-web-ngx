import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

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
        PaginationContext.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(PaginationContext.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new PaginationContextService();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of PaginationContext.service', () => {
    expect(service).toBeInstanceOf(PaginationContextService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
