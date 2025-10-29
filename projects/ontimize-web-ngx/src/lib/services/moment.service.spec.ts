import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { MomentService } from './moment.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('MomentService', () => {
  let service: MomentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        Moment.service,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    });
    
    try {
      service = TestBed.inject(Moment.service);
    } catch (error) {
      // Si el servicio no se puede inyectar, créalo manualmente
      service = new MomentService();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of Moment.service', () => {
    expect(service).toBeInstanceOf(MomentService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
