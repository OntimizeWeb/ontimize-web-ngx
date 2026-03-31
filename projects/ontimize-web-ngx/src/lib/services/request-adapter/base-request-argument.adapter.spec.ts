import { of } from 'rxjs';
import { BaseRequestArgument } from './base-request-argument.adapter';
import { PaginationContextService } from '../pagination-context.service';

describe('BaseRequestArgument', () => {
  let adapter: BaseRequestArgument;

  beforeEach(() => {
    adapter = new BaseRequestArgument();
  });

  // --- Creation ---

  describe('Creation', () => {
    it('should be created', () => {
      expect(adapter).toBeTruthy();
    });

    it('paginationContextService should be undefined initially', () => {
      expect((adapter as any).paginationContextService).toBeUndefined();
    });
  });

  // --- setPaginationContextService() ---

  describe('Method: setPaginationContextService()', () => {
    it('should store the provided service', () => {
      const mockService = {} as PaginationContextService;
      adapter.setPaginationContextService(mockService);
      expect((adapter as any).paginationContextService).toBe(mockService);
    });

    it('should overwrite an existing service', () => {
      const first = {} as PaginationContextService;
      const second = {} as PaginationContextService;
      adapter.setPaginationContextService(first);
      adapter.setPaginationContextService(second);
      expect((adapter as any).paginationContextService).toBe(second);
    });
  });

  // --- request() ---

  describe('Method: request()', () => {
    it('should call service[method] with the spread queryArguments', () => {
      const mockObs = of({ code: 0, data: [] });
      const mockService = { query: jasmine.createSpy('query').and.returnValue(mockObs) };
      const result = adapter.request('query', mockService, ['arg1', 'arg2']);
      expect(mockService.query).toHaveBeenCalledWith('arg1', 'arg2');
      expect(result).toBe(mockObs);
    });

    it('should return the observable produced by service[method]', (done) => {
      const mockObs = of({ code: 0, data: [{ id: 1 }] });
      const mockService = { load: jasmine.createSpy('load').and.returnValue(mockObs) };
      adapter.request('load', mockService, []).subscribe(res => {
        expect((res as any).data).toEqual([{ id: 1 }]);
        done();
      });
    });

    it('should work with an empty queryArguments array', () => {
      const mockObs = of({});
      const mockService = { fetch: jasmine.createSpy('fetch').and.returnValue(mockObs) };
      adapter.request('fetch', mockService, []);
      expect(mockService.fetch).toHaveBeenCalledWith();
    });
  });

  // --- parseQueryParameters() ---

  describe('Method: parseQueryParameters()', () => {
    it('should return args unchanged', () => {
      const args = { filter: { id: 1 }, columns: ['name'] };
      expect(adapter.parseQueryParameters(args)).toBe(args);
    });

    it('should return null unchanged', () => {
      expect(adapter.parseQueryParameters(null)).toBeNull();
    });

    it('should return undefined unchanged', () => {
      expect(adapter.parseQueryParameters(undefined)).toBeUndefined();
    });
  });

  // --- getIdFromFilter() ---

  describe('Method: getIdFromFilter()', () => {
    it('should return the filter unchanged', () => {
      const filter = { id: 42 };
      expect(adapter.getIdFromFilter(filter)).toBe(filter);
    });

    it('should return null unchanged', () => {
      expect(adapter.getIdFromFilter(null)).toBeNull();
    });
  });
});
