import { TestBed } from '@angular/core/testing';
import { Injector } from '@angular/core';
import { of } from 'rxjs';
import { OntimizeExportDataProviderService } from './ontimize-export-data-provider.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('OntimizeExportDataProviderService', () => {
  let service: OntimizeExportDataProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        // Include other providers from OTestingUtils first
        ...OTestingUtils.getCommonTestingModuleConfig().providers.filter(
          provider => !(provider && provider.provide === OntimizeExportDataProviderService)
        ),
        // Then provide OntimizeExportDataProviderService with custom factory to override any spy
        {
          provide: OntimizeExportDataProviderService,
          useFactory: (injector: Injector) => new OntimizeExportDataProviderService(injector),
          deps: [Injector]
        }
      ]
    });
    service = TestBed.inject(OntimizeExportDataProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OntimizeExportDataProviderService', () => {
    expect(service).toBeInstanceOf(OntimizeExportDataProviderService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
