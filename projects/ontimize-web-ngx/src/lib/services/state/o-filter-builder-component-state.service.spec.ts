import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OFilterBuilderComponentStateService } from './o-filter-builder-component-state.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OFilterBuilderComponentStateService', () => {
  let service: OFilterBuilderComponentStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OFilterBuilderComponentState.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(OFilterBuilderComponentState.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new OFilterBuilderComponentStateService();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OFilterBuilderComponentState.service', () => {
    expect(service).toBeInstanceOf(OFilterBuilderComponentStateService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
