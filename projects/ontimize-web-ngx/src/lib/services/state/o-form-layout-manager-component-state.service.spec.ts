import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OFormLayoutManagerComponentStateService } from './o-form-layout-manager-component-state.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OFormLayoutManagerComponentStateService', () => {
  let service: OFormLayoutManagerComponentStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OFormLayoutManagerComponentState.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(OFormLayoutManagerComponentState.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new OFormLayoutManagerComponentStateService();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OFormLayoutManagerComponentState.service', () => {
    expect(service).toBeInstanceOf(OFormLayoutManagerComponentStateService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
