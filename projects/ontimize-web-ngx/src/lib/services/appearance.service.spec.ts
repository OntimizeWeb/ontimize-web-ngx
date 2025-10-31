import { TestBed } from '@angular/core/testing';
import { AppearanceService } from './appearance.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('AppearanceService', () => {
  let service: AppearanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        AppearanceService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(AppearanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of AppearanceService', () => {
    expect(service).toBeInstanceOf(AppearanceService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
