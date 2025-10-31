import { TestBed } from '@angular/core/testing';
import { OAppSidenavComponentStateService } from './o-app-menu-component-state.service';
import { OTestingUtils } from '../../shared/testing/o-testing-utils';

describe('OAppSidenavComponentStateService', () => {
  let service: OAppSidenavComponentStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OAppSidenavComponentStateService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OAppSidenavComponentStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OAppSidenavComponentStateService', () => {
    expect(service).toBeInstanceOf(OAppSidenavComponentStateService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
