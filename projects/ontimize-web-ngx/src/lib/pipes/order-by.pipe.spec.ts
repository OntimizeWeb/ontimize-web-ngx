import { OrderByPipe } from './order-by.pipe';

describe('OrderByPipe', () => {
  let pipe: OrderByPipe;

  beforeEach(() => {
    pipe = new OrderByPipe();
  });

  // --- Creation ---

  describe('Creation', () => {
    it('should be created', () => {
      expect(pipe).toBeTruthy();
    });
  });

  // --- Non-array input ---

  describe('Method: transform() — non-array input', () => {
    it('should return the value unchanged when input is not an array', () => {
      expect(pipe.transform('hello', ['+'])).toBe('hello');
    });

    it('should return the value unchanged when input is null', () => {
      expect(pipe.transform(null, ['+'])).toBeNull();
    });
  });

  // --- Basic array sort (no property) ---

  describe('Method: transform() — basic primitive array', () => {
    it('should sort primitives ascending with "+"', () => {
      expect(pipe.transform(['b', 'a', 'c'], ['+'])).toEqual(['a', 'b', 'c']);
    });

    it('should sort primitives descending with "-"', () => {
      expect(pipe.transform(['b', 'a', 'c'], ['-'])).toEqual(['c', 'b', 'a']);
    });

    it('should sort using default "+" when config is "+"', () => {
      expect(pipe.transform(['z', 'a'], ['+'])).toEqual(['a', 'z']);
    });
  });

  // --- Sort by single object property ---

  describe('Method: transform() — sort by single property', () => {
    const data = [
      { name: 'Charlie', age: 30 },
      { name: 'Alice', age: 25 },
      { name: 'Bob', age: 35 },
    ];

    it('should sort ascending by property with "+" prefix', () => {
      const result = pipe.transform([...data], ['+name']);
      expect(result[0].name).toBe('Alice');
      expect(result[2].name).toBe('Charlie');
    });

    it('should sort descending by property with "-" prefix', () => {
      const result = pipe.transform([...data], ['-name']);
      expect(result[0].name).toBe('Charlie');
      expect(result[2].name).toBe('Alice');
    });

    it('should sort numeric properties correctly', () => {
      const result = pipe.transform([...data], ['+age']);
      expect(result[0].age).toBe(25);
      expect(result[2].age).toBe(35);
    });

    it('should sort without prefix (treats as ascending)', () => {
      const result = pipe.transform([...data], ['name']);
      expect(result[0].name).toBe('Alice');
    });
  });

  // --- _orderByComparator ---

  describe('Static: _orderByComparator()', () => {
    it('should return -1 when a < b (string)', () => {
      expect(OrderByPipe._orderByComparator('apple', 'banana')).toBe(-1);
    });

    it('should return 1 when a > b (string)', () => {
      expect(OrderByPipe._orderByComparator('banana', 'apple')).toBe(1);
    });

    it('should return 0 when a === b (string)', () => {
      expect(OrderByPipe._orderByComparator('apple', 'apple')).toBe(0);
    });

    it('should return -1 when a < b (number)', () => {
      expect(OrderByPipe._orderByComparator(1, 2)).toBe(-1);
    });

    it('should return 1 when a > b (number)', () => {
      expect(OrderByPipe._orderByComparator(10, 2)).toBe(1);
    });

    it('should return 0 when a === b (number)', () => {
      expect(OrderByPipe._orderByComparator(5, 5)).toBe(0);
    });
  });
});
