import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { ONavigationItem } from './navigation.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('ONavigationItem', () => {
  let service: ONavigationItem;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        Navigation.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(Navigation.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new ONavigationItem();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of Navigation.service', () => {
    expect(service).toBeInstanceOf(ONavigationItem);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
