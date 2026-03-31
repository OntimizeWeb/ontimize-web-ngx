import { OCurrencyPipe } from './o-currency.pipe';
import { CurrencyService } from '../services/currency.service';
import { NumberService } from '../services/number.service';

describe('OCurrencyPipe', () => {
  let pipe: OCurrencyPipe;
  let currencyService: jasmine.SpyObj<CurrencyService>;
  let numberService: jasmine.SpyObj<NumberService>;

  beforeEach(() => {
    currencyService = jasmine.createSpyObj('CurrencyService', ['getCurrencyValue']);
    currencyService.getCurrencyValue.and.callFake((v: any) => `$${v}`);
    numberService = jasmine.createSpyObj('NumberService', ['getRealValue', 'getIntegerValue']);

    const mockInjector = {
      get: (token: any) => {
        if (token === CurrencyService) return currencyService;
        return numberService;
      }
    } as any;
    pipe = new OCurrencyPipe(mockInjector);
  });

  // --- Creation ---

  describe('Creation', () => {
    it('should be created', () => {
      expect(pipe).toBeTruthy();
    });
  });

  // --- transform() ---

  describe('Method: transform()', () => {
    it('should delegate to currencyService.getCurrencyValue', () => {
      const args = { currencySimbol: '€', currencySymbolPosition: 'right' };
      pipe.transform('100', args);
      expect(currencyService.getCurrencyValue).toHaveBeenCalledWith('100', args);
    });

    it('should return the formatted value from currencyService', () => {
      expect(pipe.transform('50', {})).toBe('$50');
    });

    it('should pass null through to the service', () => {
      pipe.transform(null, {});
      expect(currencyService.getCurrencyValue).toHaveBeenCalledWith(null, {});
    });
  });
});
