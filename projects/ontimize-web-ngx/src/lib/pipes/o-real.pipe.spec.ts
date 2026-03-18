import { ORealPipe } from './o-real.pipe';
import { NumberService } from '../services/number.service';

describe('ORealPipe', () => {
  let pipe: ORealPipe;
  let numberService: jasmine.SpyObj<NumberService>;

  beforeEach(() => {
    numberService = jasmine.createSpyObj('NumberService', ['getRealValue', 'getIntegerValue']);
    numberService.getRealValue.and.callFake((v: any) => `real_${v}`);

    const mockInjector = { get: () => numberService } as any;
    pipe = new ORealPipe(mockInjector);
  });

  // --- Creation ---

  describe('Creation', () => {
    it('should be created', () => {
      expect(pipe).toBeTruthy();
    });
  });

  // --- transform() ---

  describe('Method: transform()', () => {
    it('should delegate to numberService.getRealValue', () => {
      const args = { decimalSeparator: ',', minDecimalDigits: 2 };
      pipe.transform('3.14', args);
      expect(numberService.getRealValue).toHaveBeenCalledWith('3.14', args);
    });

    it('should return the value from numberService', () => {
      expect(pipe.transform('3.14', {})).toBe('real_3.14');
    });

    it('should pass null through to the service', () => {
      pipe.transform(null, {});
      expect(numberService.getRealValue).toHaveBeenCalledWith(null, {});
    });
  });
});
