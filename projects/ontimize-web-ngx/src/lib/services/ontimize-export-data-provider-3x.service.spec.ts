import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OntimizeExportDataProviderService3X } from './ontimize-export-data-provider-3x.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('OntimizeExportDataProviderService3X', () => {
  let service: OntimizeExportDataProviderService3X;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
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

  // TODO: Add service-specific tests
  it('should have required methods', () => {
    expect(service).toBeDefined();
    // TODO: Test public methods
  });
});
