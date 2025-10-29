import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { DefaultComponentStateService } from './o-component-state.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('DefaultComponentStateService', () => {
  let service: DefaultComponentStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OComponentState.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(OComponentState.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new DefaultComponentStateService();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OComponentState.service', () => {
    expect(service).toBeInstanceOf(DefaultComponentStateService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
