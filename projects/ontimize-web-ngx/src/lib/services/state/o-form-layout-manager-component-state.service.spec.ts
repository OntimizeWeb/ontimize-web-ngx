import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OFormLayoutManagerComponentStateService } from './o-form-layout-manager-component-state.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OFormLayoutManagerComponentStateService', () => {
  let service: OFormLayoutManagerComponentStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OFormLayoutManagerComponentStateService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OFormLayoutManagerComponentStateService);
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
