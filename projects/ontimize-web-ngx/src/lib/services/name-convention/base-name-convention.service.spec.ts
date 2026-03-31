import { BaseNameConvention } from './base-name-convention.service';

// ─── Concrete stub ────────────────────────────────────────────────────────────
class ConcreteNameConvention extends BaseNameConvention {
  parseToStringCase(value: any): any {
    if (Array.isArray(value)) return value.map((v: string) => v.toLowerCase());
    if (typeof value === 'string') return value.toLowerCase();
    if (typeof value === 'object' && value !== null) {
      return Object.keys(value).reduce((acc, k) => { acc[k.toLowerCase()] = value[k]; return acc; }, {} as any);
    }
    return value;
  }
  parseOppositeToStringCase(value: any): any {
    if (Array.isArray(value)) return value.map((v: string) => v.toUpperCase());
    if (typeof value === 'string') return value.toUpperCase();
    return value;
  }
}
// ─────────────────────────────────────────────────────────────────────────────

describe('BaseNameConvention', () => {
  let service: ConcreteNameConvention;

  beforeEach(() => {
    service = new ConcreteNameConvention();
  });

  // ─── Creation ────────────────────────────────────────────────────────────────

  describe('Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should be an instance of BaseNameConvention', () => {
      expect(service).toBeInstanceOf(BaseNameConvention);
    });
  });

  // ─── parseColumnsToNameConventionForOntimize() ────────────────────────────────

  describe('Method: parseColumnsToNameConventionForOntimize()', () => {
    it('should apply case transformation to a string array', () => {
      const result = service.parseColumnsToNameConventionForOntimize(['NAME', 'AGE']);
      expect(result).toEqual(['name', 'age']);
    });

    it('should apply case transformation to a plain string', () => {
      expect(service.parseColumnsToNameConventionForOntimize('NAME')).toBe('name');
    });

    it('should extract and transform columns from an object value', () => {
      // Object format: { columns: 'NAME,AGE' } → splits by ',' then applies case
      const result = service.parseColumnsToNameConventionForOntimize({ columns: 'NAME,AGE' } as any);
      expect(result).toEqual(['name', 'age']);
    });
  });

  // ─── parseColumnsToNameConventionForJSONAPI() ─────────────────────────────────

  describe('Method: parseColumnsToNameConventionForJSONAPI()', () => {
    it('should parse comma-separated string and apply case transformation', () => {
      const result = service.parseColumnsToNameConventionForJSONAPI('NAME,AGE,CODE');
      expect(result).toBe('name,age,code');
    });

    it('should handle a single column string', () => {
      expect(service.parseColumnsToNameConventionForJSONAPI('NAME')).toBe('name');
    });
  });

  // ─── parseDataToNameConvention() ──────────────────────────────────────────────

  describe('Method: parseDataToNameConvention()', () => {
    it('should convert object keys using parseToStringCase', () => {
      const result = service.parseDataToNameConvention({ NAME: 'Alice', AGE: 30 });
      expect(result).toEqual({ name: 'Alice', age: 30 });
    });

    it('should handle empty object', () => {
      expect(service.parseDataToNameConvention({})).toEqual({});
    });
  });

  // ─── parseResultToNameConvention() ────────────────────────────────────────────

  describe('Method: parseResultToNameConvention()', () => {
    it('should convert object keys using parseOppositeToStringCase', () => {
      const result = service.parseResultToNameConvention({ name: 'Alice', age: 30 });
      expect(result).toEqual({ NAME: 'Alice', AGE: 30 });
    });

    it('should handle empty object', () => {
      expect(service.parseResultToNameConvention({})).toEqual({});
    });
  });

  // ─── parseValuesDataToNameConvention() ────────────────────────────────────────

  describe('Method: parseValuesDataToNameConvention()', () => {
    it('should apply case transformation to values', () => {
      const result = service.parseValuesDataToNameConvention({ key1: 'VALUE1', key2: 'VALUE2' });
      expect(result['key1']).toBe('value1');
      expect(result['key2']).toBe('value2');
    });

    it('should handle empty object', () => {
      expect(service.parseValuesDataToNameConvention({})).toEqual({});
    });
  });

  // ─── parseFilterToNameConvention() ────────────────────────────────────────────

  describe('Method: parseFilterToNameConvention()', () => {
    it('should transform plain filter keys using parseToStringCase', () => {
      const result = service.parseFilterToNameConvention({ NAME: 'Alice', CODE: '001' });
      expect(result['name']).toBe('Alice');
      expect(result['code']).toBe('001');
    });

    it('should handle a filter with an expression value (lop+op)', () => {
      const expr = { lop: 'NAME', op: '=', rop: 'Alice' };
      const result = service.parseFilterToNameConvention({ filter: expr });
      // Expression branch: parseFilterExpresionNameConvention is called
      expect(result['filter']).toBeDefined();
    });

    it('should handle empty filter object', () => {
      expect(service.parseFilterToNameConvention({})).toEqual({});
    });
  });

  // ─── parseFilterExpresionNameConvention() ─────────────────────────────────────

  describe('Method: parseFilterExpresionNameConvention()', () => {
    it('should transform lop using parseToStringCase for simple expression', () => {
      const expr = { lop: 'NAME', op: '=', rop: 'Alice' };
      const result = service.parseFilterExpresionNameConvention(expr);
      expect(result.lop).toBe('name');
      expect(result.op).toBe('=');
      expect(result.rop).toBe('Alice');
    });

    it('should recursively process nested expression when rop has lop+op', () => {
      const inner = { lop: 'AGE', op: '>', rop: 18 };
      const outer = { lop: 'NAME', op: 'AND', rop: inner };
      const result = service.parseFilterExpresionNameConvention(outer);
      expect(result.lop).toBeDefined();
      expect(result.rop).toBeDefined();
      // Inner rop was processed recursively
      expect(result.rop.lop).toBe('age');
    });
  });
});
