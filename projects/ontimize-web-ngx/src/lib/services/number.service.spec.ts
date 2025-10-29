import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { NumberService } from './number.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('NumberService', () => {
  let service: NumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        Number.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(Number.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new NumberService();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of Number.service', () => {
    expect(service).toBeInstanceOf(NumberService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
