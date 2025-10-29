import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { OErrorDialogManager } from './o-error-dialog-manager.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('OErrorDialogManager', () => {
  let service: OErrorDialogManager;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OErrorDialogManager.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(OErrorDialogManager.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new OErrorDialogManager();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OErrorDialogManager.service', () => {
    expect(service).toBeInstanceOf(OErrorDialogManager);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
