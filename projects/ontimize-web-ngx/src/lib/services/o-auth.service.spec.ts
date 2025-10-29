import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OntimizeAuthService } from './o-auth.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('OntimizeAuthService', () => {
  let service: OntimizeAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OntimizeAuthService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OntimizeAuthService);
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
