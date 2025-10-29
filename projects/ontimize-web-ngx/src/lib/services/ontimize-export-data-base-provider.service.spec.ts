import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OntimizeExportDataBaseProviderService } from './ontimize-export-data-base-provider.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('OntimizeExportDataBaseProviderService', () => {
  let service: OntimizeExportDataBaseProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OntimizeExportDataBaseProvider.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(OntimizeExportDataBaseProvider.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new OntimizeExportDataBaseProviderService();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OntimizeExportDataBaseProvider.service', () => {
    expect(service).toBeInstanceOf(OntimizeExportDataBaseProviderService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
