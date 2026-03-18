import { OIntegerPipe } from './o-integer.pipe';
import { NumberService } from '../services/number.service';

describe('OIntegerPipe', () => {
  let pipe: OIntegerPipe;
  let numberService: jasmine.SpyObj<NumberService>;

  beforeEach(() => {
    numberService = jasmine.createSpyObj('NumberService', ['getIntegerValue']);
    numberService.getIntegerValue.and.callFake((v: any) => `int_${v}`);

    const mockInjector = { get: () => numberService } as any;
    pipe = new OIntegerPipe(mockInjector);
  });

  // --- Creation ---

  describe('Creation', () => {
    it('should be created', () => {
      expect(pipe).toBeTruthy();
    });
  });

  // --- transform() ---

  describe('Method: transform()', () => {
    it('should delegate to numberService.getIntegerValue', () => {
      const args = { grouping: true };
      pipe.transform('42', args);
      expect(numberService.getIntegerValue).toHaveBeenCalledWith('42', args);
    });

    it('should return the value from numberService', () => {
      expect(pipe.transform('100', {})).toBe('int_100');
    });

    it('should pass null through to the service', () => {
      pipe.transform(null, {});
      expect(numberService.getIntegerValue).toHaveBeenCalledWith(null, {});
    });
  });
});
