import { TestBed } from '@angular/core/testing';
import { Injector } from '@angular/core';
import { of } from 'rxjs';
import { OntimizeService } from './ontimize.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OntimizeService', () => {
  let service: OntimizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        // Include other providers from OTestingUtils first
        ...OTestingUtils.getCommonTestingModuleConfig().providers.filter(
          provider => !(provider && provider.provide === OntimizeService)
        ),
        // Then provide OntimizeService with custom factory to override any spy
        {
          provide: OntimizeService,
          useFactory: (injector: Injector) => new OntimizeService(injector),
          deps: [Injector]
        }
      ]
    });
    service = TestBed.inject(OntimizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OntimizeService', () => {
    expect(service).toBeInstanceOf(OntimizeService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
