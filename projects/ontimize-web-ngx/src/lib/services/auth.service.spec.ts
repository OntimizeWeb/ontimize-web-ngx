import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        AuthService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of AuthService', () => {
    expect(service).toBeInstanceOf(AuthService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
