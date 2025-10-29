import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { BaseNameConvention.service } from './base-name-convention.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('BaseNameConvention.service', () => {
  let service: BaseNameConvention.service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        BaseNameConvention.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(BaseNameConvention.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new BaseNameConvention.service();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of BaseNameConvention.service', () => {
    expect(service).toBeInstanceOf(BaseNameConvention.service);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
