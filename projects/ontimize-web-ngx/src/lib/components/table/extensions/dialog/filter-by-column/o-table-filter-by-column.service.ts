import { Injectable, Injector } from '@angular/core';

import { ColumnValueFilterOperator, OColumnValueFilter } from '../../../../../types/table/o-column-value-filter.type';
import { TableFilterByColumnData } from '../../../../../types/table/o-table-filter-by-column-data.type';
import { Util } from '../../../../../util/util';
import { OColumn } from '../../../column/o-column.class';
import { Observable, of } from 'rxjs';
import { ServiceResponse } from '../../../../../interfaces';
import { FactoryUtil } from '../../../../../util/factory.util';
import { OConfigureServiceArgs } from '../../../../../types/configure-service-args.type';
import { OntimizeService } from '../../../../../services/ontimize/ontimize.service';
import { OTableBase } from '../../../o-table-base.class';
import { OFilterColumn } from '../../header/table-columns-filter/columns/o-table-columns-filter-column.component';

@Injectable()
export class OTableFilterByColumnService {
  constructor() { }

  /**
 * Returns the displayed (rendered) values for a column from the given table data.
 * Falls back to raw value if no renderer is defined.
 */
  getColumnDataUsingRenderer(column: OColumn, tableData: any[], visibleColumns: string[], separator: string): any[] {
    const useCustomRender = Array.isArray(visibleColumns) && visibleColumns.length > 0;

    return tableData.map(row => {
      if (useCustomRender) {
        return visibleColumns.map(attr => row[attr] ?? '').join(separator);
      } else {
        const rawValue = row[column.attr];
        return column.renderer?.getCellData?.(rawValue, row) ?? rawValue;
      }
    });
  }

  /**
   * Generates a unique list of filterable column values, optionally marking selected items.
   *
   * @param filter - Current filter configuration (can be null)
   * @param column - Column being filtered
   * @param tableData - Data to extract values from (paged or full)
   * @param isPageable - Whether the table is pageable
   * @param sourceData - Indicates whether data comes from current page or all data
   * @returns List of column values with their rendered value and selection state
   */

  parseListData(
    filter: OColumnValueFilter,
    column: OColumn,
    tableData: any[],
    isPageable: boolean,
    filterColumnDefinition: OFilterColumn
  ): TableFilterByColumnData[] {
    const columnData: TableFilterByColumnData[] = [];
    const visibleColumns = filterColumnDefinition.visibleColumns;
    const separator = filterColumnDefinition.separator;
    const sourceData = filterColumnDefinition.filterValuesInData;
    const colRenderedValues = this.getColumnDataUsingRenderer(column, tableData, visibleColumns, separator);

    // Differentiated logic: use column.attr if called from the context menu, otherwise use valueColumn
    const valueColumn =column.valueColumn ?? column.attr;
    const colValues = tableData.map((elem) => Util.getValueFromPath(elem, valueColumn));

    // Use predefined values if available in the filter configuration
    if (Util.isDefined(filter?.availableValues)) {
      return filter.availableValues;
    }

    colRenderedValues.forEach((renderedValue, i) => {

      renderedValue = renderedValue ?? '';

      const alreadyExists = columnData.find(item => item.renderedValue === renderedValue);

      // Avoid duplicates unless we're in pageable mode and processing all-data
      if (!alreadyExists || (isPageable && sourceData === 'all-data')) {
        const selected = filter?.operator === ColumnValueFilterOperator.IN &&
          (filter?.values ?? []).includes(colValues[i]);

        columnData.push({
          renderedValue,
          value: colValues[i],
          rowValue: tableData[i],
          selected,
          tableIndex: i
        });
      }
    });
    return columnData;
  }

  /**
 * Applies selected filter values to a given column filter.
 * Updates operator, values, availableValues or filterExpression based on source data.
 *
 * @param filter - The filter object to update
 * @param selectedValues - List of selected column data entries
 * @param sourceData - Indicates whether filtering is based on current page or all data
 * @param columnData - Full list of available column filter data
 * @param getComponentFilterFn - Function to retrieve the component filter expression
 */
  applySelectedValuesToFilter(
    column: OColumn,
    tableData: any[],
    filter: OColumnValueFilter,
    selectedValues: TableFilterByColumnData[],
    filterByColumnDefinition: OFilterColumn,
    isPageable: boolean,
    getComponentFilterFn: () => any
  ): void {
    filter.operator = ColumnValueFilterOperator.IN;
    filter.values = selectedValues.map(item => item.value);

    const sourceData = filterByColumnDefinition.filterValuesInData;
    const effectiveSourceData = sourceData ?? 'current-page';
    if (effectiveSourceData) {
      filter.availableValues = this.parseListData(filter, column, filter.availableValues ?? tableData, isPageable, filterByColumnDefinition);
    } else {
      filter.filterExpresion = filter.filterExpresion || getComponentFilterFn();
    }
  }

  getDataForColumnFilter(
    injector: Injector,
    table: OTableBase,
    column: OColumn,
    filterColumnDefinition: OFilterColumn
  ): Observable<any[]> {
    if (filterColumnDefinition.filterValuesInData === 'current-page') {
      // Get data only from the current page
      return of(table.getValue());
    }

    if (table.pageable) {
      const previousFilter = table.dataSource.getColumnValueFilterByAttr(column.attr);
      // Get all paginated data using the remote service
      const kv = previousFilter?.filterExpresion || table.getComponentFilter();
      const av = [column.attr];
      const sqlTypes = Util.isDefined(kv) && !Util.isObjectEmpty(kv)
        ? table.getSqlTypes()
        : {};
      const entity = filterColumnDefinition.entity ?? table.entity;

      const columnQueryArgs = [kv, av, entity, sqlTypes];
      const service = this.configureService(injector, filterColumnDefinition, table);
      const queryMethodName = filterColumnDefinition.queryMethod ??  table.queryMethod;


      if (service && queryMethodName && typeof service[queryMethodName] === 'function') {
        const result$ = service[queryMethodName](...columnQueryArgs) as Observable<ServiceResponse>;

        // Convert ServiceResponse into a data array
        return new Observable<any[]>(observer => {
          result$.subscribe({
            next: res => observer.next(res?.isSuccessful() ? res.data : []),
            error: err => {
              console.error('[FilterService] Error al consultar datos del filtro:', err);
              observer.next([]);
            },
            complete: () => observer.complete()
          });
        });
      }

      return of([]); // fallback
    }

    // Si la tabla no es pageable, devuelve todos los valores en memoria
    return of(table.getAllValues());
  }

  configureService(injector: Injector, filterColumnDefinition: OFilterColumn, tableEntity: OTableBase) {
    const service = filterColumnDefinition.service;
    const serviceType = filterColumnDefinition.serviceType;
    const entity = filterColumnDefinition.entity ?? tableEntity.entity;
    if ((service || serviceType)) {
      let configureServiceArgs: OConfigureServiceArgs = { injector: injector, baseService: OntimizeService, entity: entity, service: service, serviceType: serviceType };
      return FactoryUtil.configureService(configureServiceArgs);
    } else {
      return tableEntity.getDataService();
    }

  }


  initializeColumnFilterData(
    filter: OColumnValueFilter,
    column: OColumn,
    tableData: any[],
    isPageable: boolean,
    filterColumnDefinition: OFilterColumn
    //contextSource: 'modal' | 'context-menu' = 'modal'
  ): TableFilterByColumnData[] {

    const columnData = this.parseListData(filter, column, tableData, isPageable, filterColumnDefinition);

    const selectedValues = filter?.values ?? [];
    for (const item of columnData) {
      item.selected = selectedValues.includes(item.value);
    }

    return columnData;
  }
}
