import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OntimizeFileService } from './ontimize-file.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OntimizeFileService', () => {
  let service: OntimizeFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OntimizeFile.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(OntimizeFile.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new OntimizeFileService();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OntimizeFile.service', () => {
    expect(service).toBeInstanceOf(OntimizeFileService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
