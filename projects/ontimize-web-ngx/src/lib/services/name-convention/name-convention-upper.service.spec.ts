import { BaseNameConvention } from './base-name-convention.service';
import { NameConventionUpper } from './name-convention-upper.service';

describe('NameConventionUpper', () => {
  let service: NameConventionUpper;

  beforeEach(() => {
    service = new NameConventionUpper();
  });

  // ─── Creation ────────────────────────────────────────────────────────────────

  describe('Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should be an instance of NameConventionUpper', () => {
      expect(service).toBeInstanceOf(NameConventionUpper);
    });

    it('should extend BaseNameConvention', () => {
      expect(service).toBeInstanceOf(BaseNameConvention);
    });
  });

  // ─── parseToStringCase() ─────────────────────────────────────────────────────

  describe('Method: parseToStringCase()', () => {
    it('should convert a string to uppercase', () => {
      expect(service.parseToStringCase('name')).toBe('NAME');
    });

    it('should convert an array of strings to uppercase', () => {
      expect(service.parseToStringCase(['name', 'age'])).toEqual(['NAME', 'AGE']);
    });

    it('should handle already-uppercase string', () => {
      expect(service.parseToStringCase('NAME')).toBe('NAME');
    });

    it('should handle mixed-case string', () => {
      expect(service.parseToStringCase('MyField')).toBe('MYFIELD');
    });

    it('should handle empty string', () => {
      expect(service.parseToStringCase('')).toBe('');
    });

    it('should handle empty array', () => {
      expect(service.parseToStringCase([])).toEqual([]);
    });

    it('should handle empty object', () => {
      expect(service.parseToStringCase({})).toEqual({});
    });
  });

  // ─── parseOppositeToStringCase() ─────────────────────────────────────────────

  describe('Method: parseOppositeToStringCase()', () => {
    it('should convert a string to lowercase', () => {
      expect(service.parseOppositeToStringCase('NAME')).toBe('name');
    });

    it('should convert an array of strings to lowercase', () => {
      expect(service.parseOppositeToStringCase(['NAME', 'AGE'])).toEqual(['name', 'age']);
    });

    it('should handle already-lowercase string', () => {
      expect(service.parseOppositeToStringCase('name')).toBe('name');
    });

    it('should handle empty string', () => {
      expect(service.parseOppositeToStringCase('')).toBe('');
    });
  });

  // ─── Inherited: parseDataToNameConvention() ───────────────────────────────────

  describe('Inherited: parseDataToNameConvention()', () => {
    it('should uppercase keys of an object', () => {
      const result = service.parseDataToNameConvention({ name: 'Alice', age: 30 });
      expect(result['NAME']).toBe('Alice');
      expect(result['AGE']).toBe(30);
    });

    it('should handle empty object', () => {
      expect(service.parseDataToNameConvention({})).toEqual({});
    });
  });

  // ─── Inherited: parseResultToNameConvention() ─────────────────────────────────

  describe('Inherited: parseResultToNameConvention()', () => {
    it('should lowercase uppercase keys (opposite direction)', () => {
      const result = service.parseResultToNameConvention({ NAME: 'Alice', AGE: 30 });
      expect(result['name']).toBe('Alice');
      expect(result['age']).toBe(30);
    });

    it('should handle empty object', () => {
      expect(service.parseResultToNameConvention({})).toEqual({});
    });
  });

  // ─── Inherited: parseColumnsToNameConventionForJSONAPI() ──────────────────────

  describe('Inherited: parseColumnsToNameConventionForJSONAPI()', () => {
    it('should uppercase comma-separated column names', () => {
      expect(service.parseColumnsToNameConventionForJSONAPI('name,age,code')).toBe('NAME,AGE,CODE');
    });

    it('should handle a single column', () => {
      expect(service.parseColumnsToNameConventionForJSONAPI('name')).toBe('NAME');
    });
  });

  // ─── Inherited: parseColumnsToNameConventionForOntimize() ─────────────────────

  describe('Inherited: parseColumnsToNameConventionForOntimize()', () => {
    it('should uppercase an array of column names', () => {
      expect(service.parseColumnsToNameConventionForOntimize(['name', 'age'])).toEqual(['NAME', 'AGE']);
    });

    it('should uppercase a plain string', () => {
      expect(service.parseColumnsToNameConventionForOntimize('name')).toBe('NAME');
    });
  });

  // ─── Inherited: parseValuesDataToNameConvention() ─────────────────────────────

  describe('Inherited: parseValuesDataToNameConvention()', () => {
    it('should uppercase string values', () => {
      const result = service.parseValuesDataToNameConvention({ col: 'value' });
      expect(result['col']).toBe('VALUE');
    });
  });

  // ─── Inherited: parseFilterToNameConvention() ─────────────────────────────────

  describe('Inherited: parseFilterToNameConvention()', () => {
    it('should uppercase filter keys', () => {
      const result = service.parseFilterToNameConvention({ name: 'Alice' });
      expect(result['NAME']).toBe('Alice');
    });

    it('should handle empty filter', () => {
      expect(service.parseFilterToNameConvention({})).toEqual({});
    });
  });
});
