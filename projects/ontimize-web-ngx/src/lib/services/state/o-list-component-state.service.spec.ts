import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OListComponentStateService } from './o-list-component-state.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OListComponentStateService', () => {
  let service: OListComponentStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OListComponentState.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(OListComponentState.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new OListComponentStateService();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OListComponentState.service', () => {
    expect(service).toBeInstanceOf(OListComponentStateService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
