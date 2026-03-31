import { IsEmptyValuePipe } from './is-empty-value.pipe';

describe('IsEmptyValuePipe', () => {
  let pipe: IsEmptyValuePipe;

  beforeEach(() => {
    pipe = new IsEmptyValuePipe();
  });

  // --- Creation ---

  describe('Creation', () => {
    it('should be created', () => {
      expect(pipe).toBeTruthy();
    });
  });

  // --- transform() ---

  describe('Method: transform()', () => {
    it('should return true for null', () => {
      expect(pipe.transform(null)).toBeTrue();
    });

    it('should return true for undefined', () => {
      expect(pipe.transform(undefined)).toBeTrue();
    });

    it('should return true for empty string', () => {
      expect(pipe.transform('')).toBeTrue();
    });

    it('should return false for a non-empty string', () => {
      expect(pipe.transform('hello')).toBeFalse();
    });

    it('should return false for the number 0', () => {
      expect(pipe.transform(0)).toBeFalse();
    });

    it('should return false for false (boolean)', () => {
      expect(pipe.transform(false)).toBeFalse();
    });

    it('should return false for an empty array', () => {
      expect(pipe.transform([])).toBeFalse();
    });

    it('should return false for an object', () => {
      expect(pipe.transform({ key: 'val' })).toBeFalse();
    });

    it('should return false for a positive number', () => {
      expect(pipe.transform(42)).toBeFalse();
    });
  });
});
