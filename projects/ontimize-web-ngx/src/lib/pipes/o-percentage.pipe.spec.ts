import { OPercentPipe } from './o-percentage.pipe';
import { NumberService } from '../services/number.service';

describe('OPercentPipe', () => {
  let pipe: OPercentPipe;
  let numberService: jasmine.SpyObj<NumberService>;

  beforeEach(() => {
    numberService = jasmine.createSpyObj('NumberService', ['getPercentValue', 'getRealValue', 'getIntegerValue']);
    numberService.getPercentValue.and.callFake((v: any) => `percent_${v}`);

    const mockInjector = { get: () => numberService } as any;
    pipe = new OPercentPipe(mockInjector);
  });

  // --- Creation ---

  describe('Creation', () => {
    it('should be created', () => {
      expect(pipe).toBeTruthy();
    });
  });

  // --- transform() ---

  describe('Method: transform()', () => {
    it('should delegate to numberService.getPercentValue', () => {
      pipe.transform('0.5', {});
      expect(numberService.getPercentValue).toHaveBeenCalled();
    });

    it('should return the value from numberService', () => {
      expect(pipe.transform('0.5', {})).toBe('percent_0.5');
    });

    it('should preserve valueBase 1', () => {
      const args = { valueBase: 1 as const };
      pipe.transform('0.5', args);
      expect(args.valueBase).toBe(1);
    });

    it('should preserve valueBase 100', () => {
      const args = { valueBase: 100 as const };
      pipe.transform('50', args);
      expect(args.valueBase).toBe(100);
    });
  });

  // --- parseValueBase() ---

  describe('Method: parseValueBase()', () => {
    it('should return 1 for valid value 1', () => {
      expect((pipe as any).parseValueBase(1)).toBe(1);
    });

    it('should return 100 for valid value 100', () => {
      expect((pipe as any).parseValueBase(100)).toBe(100);
    });

    it('should return 1 for invalid value like 50', () => {
      expect((pipe as any).parseValueBase(50)).toBe(1);
    });

    it('should return 1 for string "1"', () => {
      expect((pipe as any).parseValueBase('1')).toBe(1);
    });

    it('should return 100 for string "100"', () => {
      expect((pipe as any).parseValueBase('100')).toBe(100);
    });

    it('should return 1 for non-numeric value', () => {
      expect((pipe as any).parseValueBase('abc')).toBe(1);
    });
  });
});
