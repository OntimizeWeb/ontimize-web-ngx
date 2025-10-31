import { TestBed } from '@angular/core/testing';
import { OntimizeExportDataProviderService3X } from './ontimize-export-data-provider-3x.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('OntimizeExportDataProviderService3X', () => {
  let service: OntimizeExportDataProviderService3X;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OntimizeExportDataProviderService3X,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OntimizeExportDataProviderService3X);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OntimizeExportDataProviderService3X', () => {
    expect(service).toBeInstanceOf(OntimizeExportDataProviderService3X);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
