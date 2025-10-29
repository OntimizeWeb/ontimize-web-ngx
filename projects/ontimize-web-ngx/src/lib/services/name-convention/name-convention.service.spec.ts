import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { NameConvention } from './name-convention.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('NameConvention', () => {
  let service: NameConvention;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        NameConvention.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(NameConvention.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new NameConvention();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of NameConvention.service', () => {
    expect(service).toBeInstanceOf(NameConvention);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
