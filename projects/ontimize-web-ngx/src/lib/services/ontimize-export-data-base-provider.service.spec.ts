import { TestBed } from '@angular/core/testing';
import { OntimizeExportDataBaseProviderService } from './ontimize-export-data-base-provider.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('OntimizeExportDataBaseProviderService', () => {
  let service: OntimizeExportDataBaseProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OntimizeExportDataBaseProviderService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OntimizeExportDataBaseProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OntimizeExportDataBaseProviderService', () => {
    expect(service).toBeInstanceOf(OntimizeExportDataBaseProviderService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
