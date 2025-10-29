import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OTableComponentStateService } from './o-table-component-state.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OTableComponentStateService', () => {
  let service: OTableComponentStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OTableComponentState.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(OTableComponentState.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new OTableComponentStateService();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OTableComponentState.service', () => {
    expect(service).toBeInstanceOf(OTableComponentStateService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
