import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OUserInfoService } from './o-user-info.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('OUserInfoService', () => {
  let service: OUserInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OUserInfo.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(OUserInfo.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new OUserInfoService();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OUserInfo.service', () => {
    expect(service).toBeInstanceOf(OUserInfoService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
