import { Injectable } from '@angular/core';

import { ColumnValueFilterOperator, OColumnValueFilter } from '../../../../../types/table/o-column-value-filter.type';
import { TableFilterByColumnData } from '../../../../../types/table/o-table-filter-by-column-data.type';
import { Util } from '../../../../../util/util';
import { OColumn } from '../../../column/o-column.class';

@Injectable()
export class OTableFilterByColumnService {

  constructor() { }

  /**
 * Returns the displayed (rendered) values for a column from the given table data.
 * Falls back to raw value if no renderer is defined.
 */
  getColumnDataUsingRenderer(column: OColumn, tableData: any[]): any[] {
    return tableData.map(row => {
      return column.renderer?.getCellData?.(row, column.attr) ?? row[column.attr];
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
    sourceData: 'current-page' | 'all-data'
  ): TableFilterByColumnData[] {
    const columnAttr = column.attr;
    const columnData: TableFilterByColumnData[] = [];
    const colRenderedValues = this.getColumnDataUsingRenderer(column, tableData);
    const colValues = tableData.map(elem => elem[columnAttr]);

    // Use predefined values if available in the filter configuration
    if (Util.isDefined(filter?.availableValues)) {
      return filter.availableValues;
    }

    colRenderedValues.forEach((renderedValue, i) => {
      if (renderedValue === null || renderedValue === undefined) {
        renderedValue = '';
      }

      const alreadyExists = columnData.find(item => item.renderedValue === renderedValue);

      // Avoid duplicates unless we're in pageable mode and processing all-data
      if (!alreadyExists || (isPageable && sourceData === 'all-data')) {
        const selected = filter?.operator === ColumnValueFilterOperator.IN &&
          (filter?.values || []).includes(colValues[i]);

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
    sourceData: 'current-page' | 'all-data',
    isPageable: boolean,
    getComponentFilterFn: () => any
  ): void {
    filter.operator = ColumnValueFilterOperator.IN;
    filter.values = selectedValues.map(item => item.value);

    if (sourceData === 'current-page') {
      filter.availableValues = this.parseListData(filter, column, filter.availableValues??tableData, isPageable, sourceData);
    } else {
      filter.filterExpresion = filter.filterExpresion || getComponentFilterFn();
    }
  }


}
