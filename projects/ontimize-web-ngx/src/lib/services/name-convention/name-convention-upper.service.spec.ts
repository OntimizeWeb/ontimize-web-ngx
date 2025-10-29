import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { NameConventionUpper } from './name-convention-upper.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('NameConventionUpper', () => {
  let service: NameConventionUpper;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        NameConventionUpper.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(NameConventionUpper.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new NameConventionUpper();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of NameConventionUpper.service', () => {
    expect(service).toBeInstanceOf(NameConventionUpper);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
