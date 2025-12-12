import { TestBed } from '@angular/core/testing';
import { OntimizeExportDataBaseProviderService } from './ontimize-export-data-base-provider.service';
import { OTestingUtils } from '../shared/testing/o-testing-utils';
import { OTableBase } from '../components/table/o-table-base.class';
import { FilterExpressionUtils } from '../util/filter-expression.utils';
import { Expression } from '../types/expression.type';

describe('OntimizeExportDataBaseProviderService', () => {
  let service: OntimizeExportDataBaseProviderService;
  let mockTable: jasmine.SpyObj<OTableBase>;

  beforeEach(() => {
    // Create mock table
    mockTable = jasmine.createSpyObj('OTableBase', [
      'getColumnsNotIncluded',
      'getColumnNames', 
      'getSqlTypes',
      'getComponentFilter',
      'getColumnFiltersExpression'
    ], {
      oTableOptions: {
        visibleColumns: ['col1', 'col2', 'col3', 'col4']
      },
      entity: 'testEntity',
      service: 'testService',
      pageable: false,
      oTableQuickFilterComponent: undefined,
      filterBuilder: undefined
    });

    // Set up mock return values
    mockTable.getColumnsNotIncluded.and.returnValue(['col4']);
    mockTable.getColumnNames.and.returnValue({
      col1: 'Column 1',
      col2: 'Column 2', 
      col3: 'Column 3'
    });
    mockTable.getSqlTypes.and.returnValue({
      col1: 'VARCHAR',
      col2: 'INTEGER',
      col3: 'DATE'
    });
    mockTable.getComponentFilter.and.returnValue({});
    mockTable.getColumnFiltersExpression.and.returnValue(null);

    TestBed.configureTestingModule({
      imports: [
        ...OTestingUtils.getCommonTestingModuleConfig().imports
      ],
      providers: [
        OntimizeExportDataBaseProviderService,
        ...OTestingUtils.getCommonTestingModuleConfig().providers
      ]
    });
    service = TestBed.inject(OntimizeExportDataBaseProviderService);
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should be instance of OntimizeExportDataBaseProviderService', () => {
      expect(service).toBeInstanceOf(OntimizeExportDataBaseProviderService);
    });

    it('should have expected methods', () => {
      expect(typeof service.initializeProvider).toBe('function');
    });

    it('should initialize with undefined properties', () => {
      expect(service.table).toBeUndefined();
      expect(service.columns).toBeUndefined();
      expect(service.colsNotIncluded).toBeUndefined();
      expect(service.columnNames).toBeUndefined();
      expect(service.sqlTypes).toBeUndefined();
      expect(service.entity).toBeUndefined();
      expect(service.service).toBeUndefined();
      expect(service.filter).toBeUndefined();
    });
  });

  describe('initializeProvider', () => {
    it('should initialize all properties correctly', () => {
      service.initializeProvider(mockTable);

      expect(service.table).toBe(mockTable);
      expect(service.columns).toEqual(['col1', 'col2', 'col3']);
      expect(service.colsNotIncluded).toEqual(['col4']);
      expect(service.columnNames).toEqual({
        col1: 'Column 1',
        col2: 'Column 2',
        col3: 'Column 3'
      });
      expect(service.sqlTypes).toEqual({
        col1: 'VARCHAR',
        col2: 'INTEGER',
        col3: 'DATE'
      });
      expect(service.entity).toBe('testEntity');
      expect(service.service).toBe('testService');
      expect(service.filter).toBeDefined();
    });

    it('should filter out excluded columns', () => {
      mockTable.getColumnsNotIncluded.and.returnValue(['col2', 'col4']);
      
      service.initializeProvider(mockTable);

      expect(service.columns).toEqual(['col1', 'col3']);
      expect(mockTable.getColumnNames).toHaveBeenCalledWith(['col1', 'col3']);
    });

    it('should handle empty excluded columns', () => {
      mockTable.getColumnsNotIncluded.and.returnValue([]);
      
      service.initializeProvider(mockTable);

      expect(service.columns).toEqual(['col1', 'col2', 'col3', 'col4']);
    });

    it('should call getFilterWithBasicExpression', () => {
      spyOn(service, 'getFilterWithBasicExpression' as any).and.returnValue({});
      
      service.initializeProvider(mockTable);

      expect(service['getFilterWithBasicExpression']).toHaveBeenCalled();
    });
  });

  describe('getFilterWithBasicExpression', () => {
    beforeEach(() => {
      service.table = mockTable;
    });

    it('should return basic filter', () => {
      const result = service['getFilterWithBasicExpression']();
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('should apply parent item expression', () => {
      spyOn(service, 'applyParentItemExpression' as any).and.callThrough();
      
      service['getFilterWithBasicExpression']();

      expect(service['applyParentItemExpression']).toHaveBeenCalled();
    });

    it('should apply column filters', () => {
      spyOn(service, 'applyColumnFilters' as any).and.callThrough();
      
      service['getFilterWithBasicExpression']();

      expect(service['applyColumnFilters']).toHaveBeenCalled();
    });

    it('should apply component filter', () => {
      const componentFilter = { key: 'value' };
      mockTable.getComponentFilter.and.returnValue(componentFilter);
      
      const result = service['getFilterWithBasicExpression']();

      expect(mockTable.getComponentFilter).toHaveBeenCalled();
      expect(result).toEqual(jasmine.objectContaining(componentFilter));
    });

    it('should apply quick and builder filters when not pageable', () => {
      mockTable.pageable = false;
      spyOn(service, 'applyQuickAndBuilderFilters' as any).and.callThrough();
      
      service['getFilterWithBasicExpression']();

      expect(service['applyQuickAndBuilderFilters']).toHaveBeenCalled();
    });

    it('should not apply quick and builder filters when pageable', () => {
      mockTable.pageable = true;
      spyOn(service, 'applyQuickAndBuilderFilters' as any).and.callThrough();
      
      service['getFilterWithBasicExpression']();

      expect(service['applyQuickAndBuilderFilters']).not.toHaveBeenCalled();
    });
  });

  describe('applyParentItemExpression', () => {
    it('should return empty filter when input is empty', () => {
      const result = service['applyParentItemExpression']({});
      
      expect(result).toEqual({});
    });

    it('should convert object to filter expression when not empty', () => {
      const filter = { key1: 'value1', key2: 'value2' };
      const mockExpression: Expression = { lop: 'key1', op: '=', rop: 'value1' };
      spyOn(FilterExpressionUtils, 'buildExpressionFromObject').and.returnValue(mockExpression);
      
      const result = service['applyParentItemExpression'](filter);

      expect(FilterExpressionUtils.buildExpressionFromObject).toHaveBeenCalledWith(filter);
      expect(result).toEqual({
        [FilterExpressionUtils.FILTER_EXPRESSION_KEY]: mockExpression
      });
    });
  });

  describe('applyColumnFilters', () => {
    beforeEach(() => {
      service.table = mockTable;
    });

    it('should return filter unchanged when no column filters', () => {
      mockTable.getColumnFiltersExpression.and.returnValue(null);
      const filter = { existing: 'value' };
      
      const result = service['applyColumnFilters'](filter);

      expect(result).toEqual(filter);
    });

    it('should add column filter expression when no existing filter', () => {
      const columnFilter: Expression = { lop: 'column', op: '=', rop: 'value' };
      mockTable.getColumnFiltersExpression.and.returnValue(columnFilter);
      const filter = {};
      
      const result = service['applyColumnFilters'](filter);

      expect(result[FilterExpressionUtils.FILTER_EXPRESSION_KEY]).toBe(columnFilter);
    });

    it('should combine column filter with existing filter expression', () => {
      const columnFilter: Expression = { lop: 'column', op: '=', rop: 'value' };
      const existingFilter: Expression = { lop: 'existing', op: '=', rop: 'value' };
      const combinedExpr: Expression = { lop: 'combined', op: 'AND', rop: 'expr' };
      mockTable.getColumnFiltersExpression.and.returnValue(columnFilter);
      spyOn(FilterExpressionUtils, 'buildComplexExpression').and.returnValue(combinedExpr);
      
      const filter = {};
      filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] = existingFilter;
      
      const result = service['applyColumnFilters'](filter);

      expect(FilterExpressionUtils.buildComplexExpression).toHaveBeenCalledWith(
        existingFilter, 
        columnFilter, 
        FilterExpressionUtils.OP_AND
      );
      expect(result[FilterExpressionUtils.FILTER_EXPRESSION_KEY]).toBe(combinedExpr);
    });
  });

  describe('applyQuickAndBuilderFilters', () => {
    beforeEach(() => {
      service.table = mockTable;
    });

    it('should return filter unchanged when no quick or builder filters', () => {
      mockTable.oTableQuickFilterComponent = undefined;
      mockTable.filterBuilder = undefined;
      const filter = { existing: 'value' };
      
      const result = service['applyQuickAndBuilderFilters'](filter);

      expect(result).toEqual(filter);
    });

    it('should apply quick filter when available', () => {
      const quickFilterExpr: Expression = { lop: 'quick', op: '=', rop: 'filter' };
      mockTable.oTableQuickFilterComponent = { filterExpression: quickFilterExpr } as any;
      mockTable.filterBuilder = undefined;
      const filter = {};
      
      const result = service['applyQuickAndBuilderFilters'](filter);

      expect(result[FilterExpressionUtils.BASIC_EXPRESSION_KEY]).toBe(quickFilterExpr);
    });

    it('should apply builder filter when available', () => {
      const builderFilterExpr: Expression = { lop: 'builder', op: '=', rop: 'filter' };
      mockTable.oTableQuickFilterComponent = undefined;
      mockTable.filterBuilder = { getExpression: () => builderFilterExpr } as any;
      const filter = {};
      
      const result = service['applyQuickAndBuilderFilters'](filter);

      expect(result[FilterExpressionUtils.BASIC_EXPRESSION_KEY]).toBe(builderFilterExpr);
    });

    it('should combine quick and builder filters when both available', () => {
      const quickFilterExpr: Expression = { lop: 'quick', op: '=', rop: 'filter' };
      const builderFilterExpr: Expression = { lop: 'builder', op: '=', rop: 'filter' };
      const combinedExpr: Expression = { lop: 'combined', op: 'AND', rop: 'expr' };
      mockTable.oTableQuickFilterComponent = { filterExpression: quickFilterExpr } as any;
      mockTable.filterBuilder = { getExpression: () => builderFilterExpr } as any;
      spyOn(FilterExpressionUtils, 'buildComplexExpression').and.returnValue(combinedExpr);
      
      const filter = {};
      
      const result = service['applyQuickAndBuilderFilters'](filter);

      expect(FilterExpressionUtils.buildComplexExpression).toHaveBeenCalledWith(
        quickFilterExpr,
        builderFilterExpr,
        FilterExpressionUtils.OP_AND
      );
      expect(result[FilterExpressionUtils.BASIC_EXPRESSION_KEY]).toBe(combinedExpr);
    });

    it('should combine with existing basic expression', () => {
      const quickFilterExpr: Expression = { lop: 'quick', op: '=', rop: 'filter' };
      const existingBasicExpr: Expression = { lop: 'existing', op: '=', rop: 'basic' };
      const finalCombinedExpr: Expression = { lop: 'final', op: 'AND', rop: 'combined' };
      mockTable.oTableQuickFilterComponent = { filterExpression: quickFilterExpr } as any;
      mockTable.filterBuilder = undefined;
      spyOn(FilterExpressionUtils, 'buildComplexExpression').and.returnValue(finalCombinedExpr);
      
      const filter = {};
      filter[FilterExpressionUtils.BASIC_EXPRESSION_KEY] = existingBasicExpr;
      
      const result = service['applyQuickAndBuilderFilters'](filter);

      expect(FilterExpressionUtils.buildComplexExpression).toHaveBeenCalledWith(
        existingBasicExpr,
        quickFilterExpr,
        FilterExpressionUtils.OP_AND
      );
      expect(result[FilterExpressionUtils.BASIC_EXPRESSION_KEY]).toBe(finalCombinedExpr);
    });
  });

  describe('Integration tests', () => {
    it('should handle complete initialization workflow', () => {
      const componentFilter = { parent: 'filter' };
      const columnFilter: Expression = { lop: 'column', op: '=', rop: 'expression' };
      
      mockTable.getComponentFilter.and.returnValue(componentFilter);
      mockTable.getColumnFiltersExpression.and.returnValue(columnFilter);
      mockTable.pageable = false;
      mockTable.oTableQuickFilterComponent = { filterExpression: { lop: 'quick', op: '=', rop: 'expression' } } as any;
      
      service.initializeProvider(mockTable);

      expect(service.table).toBe(mockTable);
      expect(service.columns).toEqual(['col1', 'col2', 'col3']);
      expect(service.entity).toBe('testEntity');
      expect(service.service).toBe('testService');
      expect(service.filter).toBeDefined();
    });

    it('should handle table with all columns excluded', () => {
      mockTable.getColumnsNotIncluded.and.returnValue(['col1', 'col2', 'col3', 'col4']);
      
      service.initializeProvider(mockTable);

      expect(service.columns).toEqual([]);
    });
  });
});
