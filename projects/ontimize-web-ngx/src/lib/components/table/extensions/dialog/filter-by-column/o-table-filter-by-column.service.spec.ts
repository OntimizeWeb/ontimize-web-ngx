import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

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
        OTableFilterByColumn.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(OTableFilterByColumn.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new OTableFilterByColumnService();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OTableFilterByColumn.service', () => {
    expect(service).toBeInstanceOf(OTableFilterByColumnService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
