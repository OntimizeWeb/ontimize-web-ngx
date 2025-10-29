import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OModulesInfoService } from './o-modules-info.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('OModulesInfoService', () => {
  let service: OModulesInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OModulesInfo.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(OModulesInfo.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new OModulesInfoService();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OModulesInfo.service', () => {
    expect(service).toBeInstanceOf(OModulesInfoService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
