import { TestBed } from '@angular/core/testing';
import { AuthGuardService } from './auth-guard.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('AuthGuardService', () => {
  let service: AuthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        AuthGuardService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(AuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of AuthGuardService', () => {
    expect(service).toBeInstanceOf(AuthGuardService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
