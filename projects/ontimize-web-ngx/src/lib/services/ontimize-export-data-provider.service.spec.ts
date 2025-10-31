import { TestBed } from '@angular/core/testing';
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
        OntimizeExportDataProviderService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
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
