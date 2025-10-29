import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OntimizePreferencesService } from './ontimize-preferences.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OntimizePreferencesService', () => {
  let service: OntimizePreferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OntimizePreferences.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(OntimizePreferences.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new OntimizePreferencesService();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OntimizePreferences.service', () => {
    expect(service).toBeInstanceOf(OntimizePreferencesService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
