import { OMomentPipe } from './o-moment.pipe';
import { MomentService } from '../services/moment.service';

describe('OMomentPipe', () => {
  let pipe: OMomentPipe;
  let momentService: jasmine.SpyObj<MomentService>;

  beforeEach(() => {
    momentService = jasmine.createSpyObj('MomentService', ['parseDate']);
    momentService.parseDate.and.callFake((v: any, fmt: string) => `parsed_${v}_${fmt}`);

    const mockInjector = { get: () => momentService } as any;
    pipe = new OMomentPipe(mockInjector);
  });

  // --- Creation ---

  describe('Creation', () => {
    it('should be created', () => {
      expect(pipe).toBeTruthy();
    });
  });

  // --- transform() ---

  describe('Method: transform()', () => {
    it('should delegate to momentService.parseDate with the given format', () => {
      pipe.transform('2024-01-15', { format: 'DD/MM/YYYY' });
      expect(momentService.parseDate).toHaveBeenCalledWith('2024-01-15', 'DD/MM/YYYY');
    });

    it('should return the formatted date from momentService', () => {
      const result = pipe.transform('2024-01-15', { format: 'DD/MM/YYYY' });
      expect(result).toBe('parsed_2024-01-15_DD/MM/YYYY');
    });

    it('should pass undefined format when args has no format', () => {
      pipe.transform('2024-01-15', {});
      expect(momentService.parseDate).toHaveBeenCalledWith('2024-01-15', undefined);
    });

    it('should pass null value through to the service', () => {
      pipe.transform(null, { format: 'YYYY' });
      expect(momentService.parseDate).toHaveBeenCalledWith(null, 'YYYY');
    });
  });
});
