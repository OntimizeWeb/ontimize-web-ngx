import { BaseNameConvention } from './base-name-convention.service';
import { NameConventionLower } from './name-convention-lower.service';

describe('NameConventionLower', () => {
  let service: NameConventionLower;

  beforeEach(() => {
    service = new NameConventionLower();
  });

  // ─── Creation ────────────────────────────────────────────────────────────────

  describe('Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should be an instance of NameConventionLower', () => {
      expect(service).toBeInstanceOf(NameConventionLower);
    });

    it('should extend BaseNameConvention', () => {
      expect(service).toBeInstanceOf(BaseNameConvention);
    });
  });

  // ─── parseToStringCase() ─────────────────────────────────────────────────────

  describe('Method: parseToStringCase()', () => {
    it('should convert a string to lowercase', () => {
      expect(service.parseToStringCase('NAME')).toBe('name');
    });

    it('should convert an array of strings to lowercase', () => {
      expect(service.parseToStringCase(['NAME', 'AGE'])).toEqual(['name', 'age']);
    });

    it('should handle already-lowercase string', () => {
      expect(service.parseToStringCase('name')).toBe('name');
    });

    it('should handle mixed-case string', () => {
      expect(service.parseToStringCase('MyField')).toBe('myfield');
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
    it('should convert a string to uppercase', () => {
      expect(service.parseOppositeToStringCase('name')).toBe('NAME');
    });

    it('should convert an array of strings to uppercase', () => {
      expect(service.parseOppositeToStringCase(['name', 'age'])).toEqual(['NAME', 'AGE']);
    });

    it('should handle already-uppercase string', () => {
      expect(service.parseOppositeToStringCase('NAME')).toBe('NAME');
    });

    it('should handle empty string', () => {
      expect(service.parseOppositeToStringCase('')).toBe('');
    });
  });

  // ─── Inherited: parseDataToNameConvention() ───────────────────────────────────

  describe('Inherited: parseDataToNameConvention()', () => {
    it('should lowercase keys of an object', () => {
      const result = service.parseDataToNameConvention({ NAME: 'Alice', AGE: 30 });
      expect(result['name']).toBe('Alice');
      expect(result['age']).toBe(30);
    });

    it('should handle empty object', () => {
      expect(service.parseDataToNameConvention({})).toEqual({});
    });
  });

  // ─── Inherited: parseResultToNameConvention() ─────────────────────────────────

  describe('Inherited: parseResultToNameConvention()', () => {
    it('should uppercase lowercase keys (opposite direction)', () => {
      const result = service.parseResultToNameConvention({ name: 'Alice', age: 30 });
      expect(result['NAME']).toBe('Alice');
      expect(result['AGE']).toBe(30);
    });

    it('should handle empty object', () => {
      expect(service.parseResultToNameConvention({})).toEqual({});
    });
  });

  // ─── Inherited: parseColumnsToNameConventionForJSONAPI() ──────────────────────

  describe('Inherited: parseColumnsToNameConventionForJSONAPI()', () => {
    it('should lowercase comma-separated column names', () => {
      expect(service.parseColumnsToNameConventionForJSONAPI('NAME,AGE,CODE')).toBe('name,age,code');
    });

    it('should handle a single column', () => {
      expect(service.parseColumnsToNameConventionForJSONAPI('NAME')).toBe('name');
    });
  });

  // ─── Inherited: parseColumnsToNameConventionForOntimize() ─────────────────────

  describe('Inherited: parseColumnsToNameConventionForOntimize()', () => {
    it('should lowercase an array of column names', () => {
      expect(service.parseColumnsToNameConventionForOntimize(['NAME', 'AGE'])).toEqual(['name', 'age']);
    });

    it('should lowercase a plain string', () => {
      expect(service.parseColumnsToNameConventionForOntimize('NAME')).toBe('name');
    });
  });

  // ─── Inherited: parseValuesDataToNameConvention() ─────────────────────────────

  describe('Inherited: parseValuesDataToNameConvention()', () => {
    it('should lowercase string values', () => {
      const result = service.parseValuesDataToNameConvention({ col: 'VALUE' });
      expect(result['col']).toBe('value');
    });
  });

  // ─── Inherited: parseFilterToNameConvention() ─────────────────────────────────

  describe('Inherited: parseFilterToNameConvention()', () => {
    it('should lowercase filter keys', () => {
      const result = service.parseFilterToNameConvention({ NAME: 'Alice' });
      expect(result['name']).toBe('Alice');
    });

    it('should handle empty filter', () => {
      expect(service.parseFilterToNameConvention({})).toEqual({});
    });
  });
});
