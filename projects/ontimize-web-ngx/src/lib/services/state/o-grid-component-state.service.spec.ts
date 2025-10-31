import { TestBed } from '@angular/core/testing';
import { OGridComponentStateService } from './o-grid-component-state.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OGridComponentStateService', () => {
  let service: OGridComponentStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OGridComponentStateService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OGridComponentStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OGridComponentStateService', () => {
    expect(service).toBeInstanceOf(OGridComponentStateService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
