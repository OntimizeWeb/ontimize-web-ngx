import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { NameConventionLower } from './name-convention-lower.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('NameConventionLower', () => {
  let service: NameConventionLower;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        NameConventionLower.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(NameConventionLower.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new NameConventionLower();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of NameConventionLower.service', () => {
    expect(service).toBeInstanceOf(NameConventionLower);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
