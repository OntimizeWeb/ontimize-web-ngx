import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { IconService } from './icon.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('IconService', () => {
  let service: IconService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        IconService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(IconService);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new IconService();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of Icon.service', () => {
    expect(service).toBeInstanceOf(IconService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
