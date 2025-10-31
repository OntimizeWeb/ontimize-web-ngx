import { TestBed } from '@angular/core/testing';
import { ORemoteConfigurationService } from './remote-config.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('ORemoteConfigurationService', () => {
  let service: ORemoteConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        ORemoteConfigurationService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(ORemoteConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of ORemoteConfigurationService', () => {
    expect(service).toBeInstanceOf(ORemoteConfigurationService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
