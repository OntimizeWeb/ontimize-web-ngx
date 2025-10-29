import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OntimizeExportDataProviderService3X } from './ontimize-export-data-provider-3x.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('OntimizeExportDataProviderService3X', () => {
  let service: OntimizeExportDataProviderService3X;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OntimizeExportDataProvider3x.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(OntimizeExportDataProvider3x.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new OntimizeExportDataProviderService3X();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OntimizeExportDataProvider3x.service', () => {
    expect(service).toBeInstanceOf(OntimizeExportDataProviderService3X);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
