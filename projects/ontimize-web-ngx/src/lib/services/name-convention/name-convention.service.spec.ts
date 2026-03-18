import { NameConvention } from './name-convention.service';

describe('NameConvention', () => {
  let service: NameConvention;

  beforeEach(() => {
    service = new NameConvention();
  });

  // ─── Creation ────────────────────────────────────────────────────────────────

  describe('Creation', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should be an instance of NameConvention', () => {
      expect(service).toBeInstanceOf(NameConvention);
    });
  });

  // ─── parseColumnsToNameConventionForOntimize() ────────────────────────────────

  describe('Method: parseColumnsToNameConventionForOntimize()', () => {
    it('should return the value unchanged', () => {
      expect(service.parseColumnsToNameConventionForOntimize(['col1', 'col2'])).toEqual(['col1', 'col2']);
    });

    it('should return a string unchanged', () => {
      expect(service.parseColumnsToNameConventionForOntimize('col1' as any)).toBe('col1');
    });

    it('should return null unchanged', () => {
      expect(service.parseColumnsToNameConventionForOntimize(null)).toBeNull();
    });
  });

  // ─── parseColumnsToNameConventionForJSONAPI() ─────────────────────────────────

  describe('Method: parseColumnsToNameConventionForJSONAPI()', () => {
    it('should return the value unchanged', () => {
      expect(service.parseColumnsToNameConventionForJSONAPI('col1,col2')).toBe('col1,col2');
    });

    it('should return empty string unchanged', () => {
      expect(service.parseColumnsToNameConventionForJSONAPI('')).toBe('');
    });
  });

  // ─── parseDataToNameConvention() ──────────────────────────────────────────────

  describe('Method: parseDataToNameConvention()', () => {
    it('should return the data unchanged', () => {
      const data = { NAME: 'Alice', AGE: 30 };
      expect(service.parseDataToNameConvention(data)).toBe(data);
    });

    it('should return null unchanged', () => {
      expect(service.parseDataToNameConvention(null)).toBeNull();
    });

    it('should return an array unchanged', () => {
      const arr = [1, 2, 3];
      expect(service.parseDataToNameConvention(arr)).toBe(arr);
    });
  });

  // ─── parseValuesDataToNameConvention() ────────────────────────────────────────

  describe('Method: parseValuesDataToNameConvention()', () => {
    it('should return the data unchanged', () => {
      const data = { key: 'VALUE' };
      expect(service.parseValuesDataToNameConvention(data)).toBe(data);
    });
  });

  // ─── parseFilterExpresionNameConvention() ─────────────────────────────────────

  describe('Method: parseFilterExpresionNameConvention()', () => {
    it('should return the expression unchanged', () => {
      const expr = { lop: 'NAME', op: '=', rop: 'Alice' };
      expect(service.parseFilterExpresionNameConvention(expr)).toBe(expr);
    });
  });

  // ─── parseResultToNameConvention() ────────────────────────────────────────────

  describe('Method: parseResultToNameConvention()', () => {
    it('should return the data unchanged', () => {
      const data = { NAME: 'Alice' };
      expect(service.parseResultToNameConvention(data)).toBe(data);
    });

    it('should return null unchanged', () => {
      expect(service.parseResultToNameConvention(null)).toBeNull();
    });
  });

  // ─── parseFilterToNameConvention() ────────────────────────────────────────────

  describe('Method: parseFilterToNameConvention()', () => {
    it('should return the filter unchanged', () => {
      const filter = { name: 'Alice' };
      expect(service.parseFilterToNameConvention(filter)).toBe(filter);
    });
  });
});
