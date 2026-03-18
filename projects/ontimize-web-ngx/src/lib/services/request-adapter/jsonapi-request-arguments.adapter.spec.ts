import { JSONAPIRequestArgumentsAdapter } from './jsonapi-request-arguments.adapter';
import { BaseRequestArgument } from './base-request-argument.adapter';
import { FilterExpressionUtils } from '../../util/filter-expression.utils';

describe('JSONAPIRequestArgumentsAdapter', () => {
  let adapter: JSONAPIRequestArgumentsAdapter;

  beforeEach(() => {
    adapter = new JSONAPIRequestArgumentsAdapter();
  });

  // --- Creation ---

  describe('Creation', () => {
    it('should be created', () => {
      expect(adapter).toBeTruthy();
    });

    it('should extend BaseRequestArgument', () => {
      expect(adapter).toBeInstanceOf(BaseRequestArgument);
    });
  });

  // --- parseQueryParameters() ---

  describe('Method: parseQueryParameters()', () => {
    it('should return empty array when args is undefined', () => {
      expect(adapter.parseQueryParameters(undefined)).toEqual([]);
    });

    it('should return empty array when args is null', () => {
      expect(adapter.parseQueryParameters(null)).toEqual([]);
    });

    it('should build fields from entity and columns', () => {
      const args = { entity: 'users', columns: ['name', 'email'], pageable: false, sort: [], filter: undefined };
      const result = adapter.parseQueryParameters(args);
      expect(result.length).toBe(1);
      expect(result[0].fields['users']).toBe('name,email');
    });

    it('should include page offset and limit when pageable', () => {
      const args = {
        entity: 'orders',
        columns: ['id'],
        pageable: true,
        ovrrArgs: { offset: 10, length: 5 },
        sort: [],
        filter: undefined
      };
      const result = adapter.parseQueryParameters(args);
      expect(result[0].page['offset']).toBe(10);
      expect(result[0].page['limit']).toBe(5);
    });

    it('should NOT include page when not pageable', () => {
      const args = { entity: 'e', columns: ['id'], pageable: false, sort: [], filter: undefined };
      const result = adapter.parseQueryParameters(args);
      expect(result[0].page).toBeUndefined();
    });

    it('should build sort string ascending', () => {
      const args = {
        entity: 'e', columns: ['id'], pageable: false,
        sort: [{ columnName: 'name', ascendent: true }],
        filter: undefined
      };
      const result = adapter.parseQueryParameters(args);
      expect(result[0].sort).toBe('name');
    });

    it('should build sort string descending (with "-" prefix)', () => {
      const args = {
        entity: 'e', columns: ['id'], pageable: false,
        sort: [{ columnName: 'age', ascendent: false }],
        filter: undefined
      };
      const result = adapter.parseQueryParameters(args);
      expect(result[0].sort).toBe('-age');
    });

    it('should join multiple sort columns with comma', () => {
      const args = {
        entity: 'e', columns: ['id'], pageable: false,
        sort: [
          { columnName: 'name', ascendent: true },
          { columnName: 'age', ascendent: false }
        ],
        filter: undefined
      };
      const result = adapter.parseQueryParameters(args);
      expect(result[0].sort).toBe('name,-age');
    });

    it('should NOT include sort when sort array is empty', () => {
      const args = { entity: 'e', columns: ['id'], pageable: false, sort: [], filter: undefined };
      const result = adapter.parseQueryParameters(args);
      expect(result[0].sort).toBeUndefined();
    });

    it('should include filter object when filter is defined', () => {
      const args = {
        entity: 'e', columns: ['id'], pageable: false, sort: [],
        filter: { status: 'active', type: 'A' }
      };
      const result = adapter.parseQueryParameters(args);
      expect(result[0].filter['status']).toBe('active');
      expect(result[0].filter['type']).toBe('A');
    });

    it('should NOT include filter when filter is undefined', () => {
      const args = { entity: 'e', columns: ['id'], pageable: false, sort: [], filter: undefined };
      const result = adapter.parseQueryParameters(args);
      expect(result[0].filter).toBeUndefined();
    });
  });

  // --- getIdFromFilter() ---

  describe('Method: getIdFromFilter()', () => {
    it('should return the first value of the filter object', () => {
      expect(adapter.getIdFromFilter({ id: '42' })).toBe('42');
    });

    it('should return null when filter is undefined', () => {
      expect(adapter.getIdFromFilter(undefined)).toBeNull();
    });

    it('should return null when filter is null', () => {
      expect(adapter.getIdFromFilter(null)).toBeNull();
    });
  });

  // --- deCompose() ---

  describe('Method: deCompose()', () => {
    it('should return kv unchanged when expresion has neither basic nor filter key', () => {
      const kv = { id: 1 };
      const result = adapter.deCompose({}, ['name'], kv);
      expect(result).toBe(kv);
    });

    it('should call deComposeExpresion for basicExpresion', () => {
      spyOn(adapter, 'deComposeExpresion').and.returnValue({});
      const basicExpr = { lop: 'name', op: '=', rop: 'Alice' };
      const expresion = { [FilterExpressionUtils.BASIC_EXPRESSION_KEY]: basicExpr };
      adapter.deCompose(expresion, ['name'], {});
      expect(adapter.deComposeExpresion).toHaveBeenCalled();
    });
  });

  // --- deComposeExpresion() ---

  describe('Method: deComposeExpresion()', () => {
    it('should return kv unchanged for a leaf expression with string lop', () => {
      const expr = { lop: 'name', op: '=', rop: 'Alice' };
      const kv = { id: 1 };
      expect(adapter.deComposeExpresion(expr, ['name'], kv)).toBe(kv);
    });

    it('should recurse when lop is not a string', () => {
      const innerExpr = { lop: 'name', op: '=', rop: 'Alice' };
      const outerExpr = { lop: innerExpr, op: 'AND', rop: { lop: 'age', op: '>', rop: 18 } };
      const kv = {};
      // Should not throw; recursion terminates at leaf nodes
      expect(() => adapter.deComposeExpresion(outerExpr, ['name', 'age'], kv)).not.toThrow();
    });
  });
});
