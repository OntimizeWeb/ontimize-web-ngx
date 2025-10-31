import { TestBed } from '@angular/core/testing';
import { OModulesInfoService } from './o-modules-info.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('OModulesInfoService', () => {
  let service: OModulesInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OModulesInfoService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OModulesInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OModulesInfoService', () => {
    expect(service).toBeInstanceOf(OModulesInfoService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
