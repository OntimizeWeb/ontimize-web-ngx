import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OUserInfoService } from './o-user-info.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('OUserInfoService', () => {
  let service: OUserInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OUserInfoService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OUserInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of OUserInfoService', () => {
    expect(service).toBeInstanceOf(OUserInfoService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
