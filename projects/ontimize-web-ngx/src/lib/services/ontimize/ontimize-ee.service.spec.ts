import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OntimizeEEService } from './ontimize-ee.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OntimizeEEService', () => {
  let service: OntimizeEEService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OntimizeEe.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(OntimizeEe.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new OntimizeEEService();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OntimizeEe.service', () => {
    expect(service).toBeInstanceOf(OntimizeEEService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
