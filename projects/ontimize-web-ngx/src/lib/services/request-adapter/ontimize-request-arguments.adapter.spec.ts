import { OntimizeRequestArgumentsAdapter } from './ontimize-request-arguments.adapter';
import { BaseRequestArgument } from './base-request-argument.adapter';

describe('OntimizeRequestArgumentsAdapter', () => {
  let adapter: OntimizeRequestArgumentsAdapter;

  beforeEach(() => {
    adapter = new OntimizeRequestArgumentsAdapter();
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

  // --- parseQueryParameters() — non-pageable ---

  describe('Method: parseQueryParameters() — non-pageable', () => {
    it('should build a queryargs array with filter, columns, entity, sqlTypes', () => {
      const args = {
        filter: { id: 1 },
        columns: ['name', 'email'],
        entity: 'users',
        sqlTypes: { id: 4 },
        pageable: false,
        sort: undefined
      };
      const result = adapter.parseQueryParameters(args);
      expect(result[0]).toBe(args.filter);
      expect(result[1]).toBe(args.columns);
      expect(result[2]).toBe(args.entity);
      expect(result[3]).toBe(args.sqlTypes);
    });

    it('should place sort at index 6', () => {
      const sort = [{ columnName: 'name', ascendent: true }];
      const args = {
        filter: {}, columns: [], entity: 'users', sqlTypes: {},
        pageable: false, sort
      };
      const result = adapter.parseQueryParameters(args);
      expect(result[6]).toBe(sort);
    });

    it('should have undefined at index 4 and 5 when not pageable', () => {
      const args = {
        filter: {}, columns: [], entity: 'e', sqlTypes: {},
        pageable: false, sort: null
      };
      const result = adapter.parseQueryParameters(args);
      expect(result[4]).toBeUndefined();
      expect(result[5]).toBeUndefined();
    });
  });

  // --- parseQueryParameters() — pageable ---

  describe('Method: parseQueryParameters() — pageable', () => {
    it('should include offset and length when pageable is true', () => {
      const args = {
        filter: { id: 1 },
        columns: ['name'],
        entity: 'users',
        sqlTypes: {},
        pageable: true,
        ovrrArgs: { offset: 20, length: 10 },
        sort: null
      };
      const result = adapter.parseQueryParameters(args);
      expect(result[4]).toBe(20);
      expect(result[5]).toBe(10);
    });

    it('should still place sort at index 6 when pageable', () => {
      const sort = [{ columnName: 'age', ascendent: false }];
      const args = {
        filter: {}, columns: [], entity: 'e', sqlTypes: {},
        pageable: true,
        ovrrArgs: { offset: 0, length: 5 },
        sort
      };
      const result = adapter.parseQueryParameters(args);
      expect(result[6]).toBe(sort);
    });

    it('should have index 6 set to undefined when pageable and no sort', () => {
      const args = {
        filter: {}, columns: [], entity: 'e', sqlTypes: {},
        pageable: true,
        ovrrArgs: { offset: 0, length: 5 },
        sort: undefined
      };
      const result = adapter.parseQueryParameters(args);
      expect(result[6]).toBeUndefined();
    });
  });
});
