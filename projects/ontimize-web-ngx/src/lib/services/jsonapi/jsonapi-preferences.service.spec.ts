import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { JSONAPIPreferencesService } from './jsonapi-preferences.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('JSONAPIPreferencesService', () => {
  let service: JSONAPIPreferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        JSONAPIPreferencesService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(JSONAPIPreferencesService);
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
