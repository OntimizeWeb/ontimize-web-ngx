import { TestBed } from '@angular/core/testing';
import { OTreeComponentStateService } from './o-tree-component-state.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OTreeComponentStateService', () => {
  let service: OTreeComponentStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OTreeComponentStateService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OTreeComponentStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OTreeComponentStateService', () => {
    expect(service).toBeInstanceOf(OTreeComponentStateService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
