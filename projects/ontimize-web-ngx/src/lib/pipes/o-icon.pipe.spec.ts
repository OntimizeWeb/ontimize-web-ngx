import { OIconPipe } from './o-icon.pipe';
import { IconService } from '../services/icon.service';

describe('OIconPipe', () => {
  let pipe: OIconPipe;
  let iconService: jasmine.SpyObj<IconService>;

  beforeEach(() => {
    iconService = jasmine.createSpyObj('IconService', ['getIconValue']);
    iconService.getIconValue.and.callFake((v: any, args: any) => `icon_${args.icon}_${v}`);

    const mockInjector = { get: () => iconService } as any;
    pipe = new OIconPipe(mockInjector);
  });

  // --- Creation ---

  describe('Creation', () => {
    it('should be created', () => {
      expect(pipe).toBeTruthy();
    });
  });

  // --- transform() ---

  describe('Method: transform()', () => {
    it('should delegate to iconService.getIconValue', () => {
      const args = { icon: 'star', iconPosition: 'left' };
      pipe.transform('Score', args);
      expect(iconService.getIconValue).toHaveBeenCalledWith('Score', args);
    });

    it('should return the result from iconService', () => {
      expect(pipe.transform('Score', { icon: 'star' })).toBe('icon_star_Score');
    });

    it('should pass null text through to the service', () => {
      pipe.transform(null, { icon: 'home' });
      expect(iconService.getIconValue).toHaveBeenCalledWith(null, { icon: 'home' });
    });
  });
});
