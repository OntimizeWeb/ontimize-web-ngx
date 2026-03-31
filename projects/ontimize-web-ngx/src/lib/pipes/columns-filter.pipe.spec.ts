import { ColumnsFilterPipe } from './columns-filter.pipe';

describe('ColumnsFilterPipe', () => {
  let pipe: ColumnsFilterPipe;

  const data = [
    { name: 'Alice', city: 'Madrid' },
    { name: 'Bob', city: 'Barcelona' },
    { name: 'Charlie', city: 'Madrid' },
  ];

  beforeEach(() => {
    pipe = new ColumnsFilterPipe();
  });

  // --- Creation ---

  describe('Creation', () => {
    it('should be created', () => {
      expect(pipe).toBeTruthy();
    });
  });

  // --- transform() passthrough cases ---

  describe('Method: transform() — passthrough cases', () => {
    it('should return the value as-is when args is falsy', () => {
      expect(pipe.transform(data, null)).toBe(data);
    });

    it('should return the value as-is when args has no filtervalue or filtercolumns', () => {
      expect(pipe.transform(data, [])).toBe(data);
    });

    it('should return the value as-is when filtervalue is empty', () => {
      const args = { filtervalue: '', filtercolumns: ['name'] };
      expect(pipe.transform(data, args)).toBe(data);
    });

    it('should return the value as-is when filtercolumns is absent', () => {
      const args = { filtervalue: 'Alice' };
      expect(pipe.transform(data, args)).toBe(data);
    });

    it('should return null when value is null', () => {
      const args = { filtervalue: 'Alice', filtercolumns: ['name'] };
      expect(pipe.transform(null, args)).toBeNull();
    });

    it('should return undefined when value is undefined', () => {
      const args = { filtervalue: 'Alice', filtercolumns: ['name'] };
      expect(pipe.transform(undefined, args)).toBeUndefined();
    });
  });

  // --- transform() filtering ---

  describe('Method: transform() — filtering', () => {
    it('should filter rows matching the filtervalue in the specified column', () => {
      const args = { filtervalue: 'Alice', filtercolumns: ['name'] };
      const result = pipe.transform(data, args);
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Alice');
    });

    it('should be case-insensitive', () => {
      const args = { filtervalue: 'alice', filtercolumns: ['name'] };
      const result = pipe.transform(data, args);
      expect(result.length).toBe(1);
    });

    it('should filter by partial match', () => {
      const args = { filtervalue: 'li', filtercolumns: ['name'] };
      const result = pipe.transform(data, args);
      // Alice (ali) + Charlie (arli)
      expect(result.length).toBe(2);
    });

    it('should search across multiple filter columns', () => {
      const args = { filtervalue: 'Madrid', filtercolumns: ['name', 'city'] };
      const result = pipe.transform(data, args);
      expect(result.length).toBe(2);
    });

    it('should return empty array when nothing matches', () => {
      const args = { filtervalue: 'XYZ', filtercolumns: ['name'] };
      const result = pipe.transform(data, args);
      expect(result.length).toBe(0);
    });

    it('should skip blank column names without throwing', () => {
      const args = { filtervalue: 'Alice', filtercolumns: ['', 'name'] };
      const result = pipe.transform(data, args);
      expect(result.length).toBe(1);
    });

    it('should skip items where the column value is falsy', () => {
      const mixed = [{ name: null }, { name: 'Alice' }];
      const args = { filtervalue: 'alice', filtercolumns: ['name'] };
      const result = pipe.transform(mixed as any, args);
      expect(result.length).toBe(1);
    });
  });

  // --- _isBlank() ---

  describe('Method: _isBlank()', () => {
    it('should return true for null', () => {
      expect(pipe._isBlank(null)).toBeTrue();
    });

    it('should return true for undefined', () => {
      expect(pipe._isBlank(undefined)).toBeTrue();
    });

    it('should return true for empty string', () => {
      expect(pipe._isBlank('')).toBeTrue();
    });

    it('should return false for a non-empty string', () => {
      expect(pipe._isBlank('hello')).toBeFalse();
    });
  });
});
