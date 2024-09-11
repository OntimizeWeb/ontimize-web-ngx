import { Injectable, Injector } from "@angular/core";
import { OTableBase } from "../components/table/o-table-base.class";
import { FilterExpressionUtils } from "../util/filter-expression.utils";
import { Util } from "../util/util";


@Injectable()
export class OntimizeExportDataBaseProviderService {

  table: OTableBase;
  columns: any;
  colsNotIncluded: string[]
  columnNames: any;
  sqlTypes: any;
  entity: string;
  service: string;
  filter: any;

  constructor(protected injector: Injector) { }


  initializeProvider(table: OTableBase) {
    this.table = table;
    // Table columns
    const tableOptions = this.table.oTableOptions;
    this.colsNotIncluded = this.table.getColumnsNotIncluded()
    this.columns = tableOptions.visibleColumns.filter(c => this.colsNotIncluded.indexOf(c) === -1);

    // Table column names
    const tableColumnNames = tableOptions.visibleColumns.filter(c => this.colsNotIncluded.indexOf(c) === -1);
    this.columnNames = this.table.getColumnNames(tableColumnNames);

    // Table column sqlTypes
    this.sqlTypes = this.table.getSqlTypes();

    // Table entity
    this.entity = this.table.entity;

    // Table service
    this.service = this.table.service;

    // Table filter
    this.filter = this.getFilterWithBasicExpression();
  }

  protected getFilterWithBasicExpression(): any {
    let filter = {};
    let parentKeysfilter = this.table.getComponentFilter();

    if (Object.keys(filter).length > 0) {
      const parentItemExpr = FilterExpressionUtils.buildExpressionFromObject(filter);
      filter = {};
      filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] = parentItemExpr;
    }
    const beColFilter = this.table.getColumnFiltersExpression();
    // Add column filters basic expression to current filter
    if (beColFilter && !Util.isDefined(filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY])) {
      filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] = beColFilter;
    } else if (beColFilter) {
      filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] =
        FilterExpressionUtils.buildComplexExpression(filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY], beColFilter, FilterExpressionUtils.OP_AND);

    }
    filter = Object.assign(filter || {}, parentKeysfilter);
    if (!this.table.pageable) {
      const quickFilterExpr = Util.isDefined(this.table.oTableQuickFilterComponent) ? this.table.oTableQuickFilterComponent.filterExpression : undefined;

      const filterBuilderExpr = Util.isDefined(this.table.filterBuilder) ? this.table.filterBuilder.getExpression() : undefined;
      let complexExpr = quickFilterExpr || filterBuilderExpr;
      if (quickFilterExpr && filterBuilderExpr) {
        complexExpr = FilterExpressionUtils.buildComplexExpression(quickFilterExpr, filterBuilderExpr, FilterExpressionUtils.OP_AND);
      }

      if (complexExpr && !Util.isDefined(filter[FilterExpressionUtils.BASIC_EXPRESSION_KEY])) {
        filter[FilterExpressionUtils.BASIC_EXPRESSION_KEY] = complexExpr;
      } else if (complexExpr) {
        filter[FilterExpressionUtils.BASIC_EXPRESSION_KEY] =
          FilterExpressionUtils.buildComplexExpression(filter[FilterExpressionUtils.BASIC_EXPRESSION_KEY], complexExpr, FilterExpressionUtils.OP_AND);
      }

    }

    return filter;
  }
}