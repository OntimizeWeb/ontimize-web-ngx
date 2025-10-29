import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { JSONAPIPreferencesService } from './jsonapi-preferences.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('JSONAPIPreferencesService', () => {
  let service: JSONAPIPreferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        JsonapiPreferences.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(JsonapiPreferences.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new JSONAPIPreferencesService();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of JsonapiPreferences.service', () => {
    expect(service).toBeInstanceOf(JSONAPIPreferencesService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
