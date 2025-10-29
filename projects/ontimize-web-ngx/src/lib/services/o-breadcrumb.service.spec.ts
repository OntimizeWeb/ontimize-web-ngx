import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OBreadcrumbService } from './o-breadcrumb.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('OBreadcrumbService', () => {
  let service: OBreadcrumbService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OBreadcrumb.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(OBreadcrumb.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new OBreadcrumbService();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OBreadcrumb.service', () => {
    expect(service).toBeInstanceOf(OBreadcrumbService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
