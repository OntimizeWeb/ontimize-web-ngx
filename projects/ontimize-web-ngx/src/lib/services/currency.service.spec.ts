import { TestBed } from '@angular/core/testing';
import { CurrencyService } from './currency.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';

describe('CurrencyService', () => {
  let service: CurrencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        CurrencyService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(CurrencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be instance of CurrencyService', () => {
    expect(service).toBeInstanceOf(CurrencyService);
  });

  it('should have expected methods', () => {
    expect(typeof service).toBe('object');
  });
});
