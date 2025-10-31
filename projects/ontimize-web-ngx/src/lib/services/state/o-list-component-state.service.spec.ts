import { TestBed } from '@angular/core/testing';
import { OListComponentStateService } from './o-list-component-state.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OListComponentStateService', () => {
  let service: OListComponentStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OListComponentStateService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OListComponentStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OListComponentStateService', () => {
    expect(service).toBeInstanceOf(OListComponentStateService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
