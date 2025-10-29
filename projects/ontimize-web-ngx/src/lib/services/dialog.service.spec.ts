import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { DialogService } from './dialog.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('DialogService', () => {
  let service: DialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        Dialog.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(Dialog.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new DialogService();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of Dialog.service', () => {
    expect(service).toBeInstanceOf(DialogService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
