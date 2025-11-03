import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        LocalStorageService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of LocalStorageService', () => {
    expect(service).toBeInstanceOf(LocalStorageService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
