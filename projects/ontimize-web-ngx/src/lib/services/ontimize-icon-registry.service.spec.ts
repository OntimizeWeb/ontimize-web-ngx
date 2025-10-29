import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OntimizeMatIconRegistry } from './ontimize-icon-registry.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('OntimizeMatIconRegistry', () => {
  let service: OntimizeMatIconRegistry;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OntimizeMatIconRegistry,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OntimizeMatIconRegistry);
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
