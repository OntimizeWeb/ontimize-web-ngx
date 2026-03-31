import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LoginStorageService } from './login-storage.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('LoginStorageService', () => {
  let service: LoginStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        LoginStorageService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(LoginStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of LoginStorageService', () => {
    expect(service).toBeInstanceOf(LoginStorageService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
