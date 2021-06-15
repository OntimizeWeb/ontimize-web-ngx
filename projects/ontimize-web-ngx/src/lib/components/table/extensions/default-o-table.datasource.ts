import { DataSource } from '@angular/cdk/collections';
import { EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { BehaviorSubject, merge, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { OTableDataSource } from '../../../interfaces/o-table-datasource.interface';
import { OTableOptions } from '../../../interfaces/o-table-options.interface';
import { ColumnValueFilterOperator, OColumnValueFilter } from '../../../types/o-column-value-filter.type';
import { OTableGroupedRow } from '../../../types/o-table-row-group.type';
import { Codes } from '../../../util/codes';
import { Util } from '../../../util/util';
import { OColumn } from '../column/o-column.class';
import { OTableComponent } from '../o-table.component';
import { OTableDao } from './o-table.dao';
import { OMatSort } from './sort/o-mat-sort';

export const SCROLLVIRTUAL = 'scroll';

export interface ITableOScrollEvent {
  type: string;
  data: number;
}

export class OTableScrollEvent implements ITableOScrollEvent {
  public data: number;
  public type: string;

  constructor(data: number) {
    this.data = data;
    this.type = SCROLLVIRTUAL;
  }
}

export class DefaultOTableDataSource extends DataSource<any> implements OTableDataSource {
  dataTotalsChange = new BehaviorSubject<any[]>([]);
  get data(): any[] { return this.dataTotalsChange.value; }

  protected _database: OTableDao;
  protected _paginator: MatPaginator;
  protected _tableOptions: OTableOptions;
  protected _sort: OMatSort;

  protected _quickFilterChange = new BehaviorSubject('');
  protected _columnValueFilterChange = new BehaviorSubject(null);
  protected groupByColumnChange = new Subject();
  protected _loadDataScrollableChange = new BehaviorSubject<OTableScrollEvent>(new OTableScrollEvent(1));

  protected filteredData: any[] = [];
  protected aggregateData: any = {};

  private groupByColumns: string[];

  onRenderedDataChange: EventEmitter<any> = new EventEmitter<any>();

  // load data in scroll
  get loadDataScrollable(): number { return this._loadDataScrollableChange.getValue().data || 1; }
  set loadDataScrollable(page: number) {
    this._loadDataScrollableChange.next(new OTableScrollEvent(page));
  }

  protected _renderedData: any[] = [];
  resultsLength: number = 0;

  get quickFilter(): string { return this._quickFilterChange.value || ''; }
  set quickFilter(filter: string) {
    this._quickFilterChange.next(filter);
  }

  private columnValueFilters: Array<OColumnValueFilter> = [];
  private stateRowGrouped: Array<OTableGroupedRow> = [];

  constructor(protected table: OTableComponent) {
    super();
    this._database = table.daoTable;
    if (this._database) {
      this.resultsLength = this._database.data.length;
    }
    if (table.paginator) {
      this._paginator = table.matpaginator;
    }
    this._tableOptions = table.oTableOptions;
    this._sort = table.sort;
  }

  sortFunction(a: any, b: any): number {
    return this._sort.sortFunction(a, b);
  }

  get renderedData(): any[] {
    return this._renderedData;
  }

  set renderedData(arg: any[]) {
    this._renderedData = arg;
    this.onRenderedDataChange.emit();
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   */
  connect(): Observable<any[]> {
    const displayDataChanges: any[] = [
      this._database.dataChange
    ];

    if (!this.table.pageable) {

      if (this._sort) {
        displayDataChanges.push(this._sort.oSortChange);
      }

      if (this._tableOptions.filter) {
        displayDataChanges.push(this._quickFilterChange);
      }

      if (this._paginator) {
        displayDataChanges.push(this._paginator.page);
      } else {
        displayDataChanges.push(this._loadDataScrollableChange);
      }
    }

    if (this.table.oTableColumnsFilterComponent) {
      displayDataChanges.push(this._columnValueFilterChange);
    }

    if (this.table.groupable) {
      displayDataChanges.push(this.groupByColumnChange);
    }

    return merge(...displayDataChanges).pipe(map((x: any) => {
      let data = Object.assign([], this._database.data);
      /*
        it is necessary to first calculate the calculated columns and
        then filter and sort the data
      */
      if (x instanceof OTableScrollEvent) {
        this.renderedData = data.slice(0, (x.data * Codes.LIMIT_SCROLLVIRTUAL) - 1);
      } else {
        if (this.existsAnyCalculatedColumn()) {
          data = this.getColumnCalculatedData(data);
        }

        if (!this.table.pageable) {
          data = this.getColumnValueFilterData(data);
          data = this.getQuickFilterData(data);
          data = this.getSortedData(data);
        }

        this.filteredData = Object.assign([], data);

        if (this.table.pageable) {
          const totalRecordsNumber = this.table.getTotalRecordsNumber();
          this.resultsLength = totalRecordsNumber !== undefined ? totalRecordsNumber : data.length;
        } else {
          this.resultsLength = data.length;
          data = this.getPaginationData(data);
        }

        /** in pagination virtual only show OTableComponent.LIMIT items for better performance of the table */
        if (!this.table.pageable && !this.table.paginationControls && data.length > Codes.LIMIT_SCROLLVIRTUAL) {
          const datapaginate = data.slice(0, (this.table.pageScrollVirtual * Codes.LIMIT_SCROLLVIRTUAL) - 1);
          data = datapaginate;
        }

        if (!Util.isArrayEmpty(this.groupByColumns)) {
          data = this.getSubGroupsOfGroupedRow(data);
          /** data contains row group headers (OTableGroupedRow) and the data belonging to expanded grouped rows */
          data = this.filterCollapsedRowGroup(data);
        }

        this.renderedData = data;
        this.aggregateData = this.getAggregatesData(data);
      }
      return this.renderedData;
    }));
  }

  /**
   * Gets subgroups of grouped row
   * @param data
   * @returns subgroups of grouped row
   */
  getSubGroupsOfGroupedRow(data: any[]): any[] {
    const rootGroup = new OTableGroupedRow();
    return data = this.getSublevel(data, 0, this.groupByColumns, rootGroup);
  }

  getAggregatesData(data: any[]): any {
    const self = this;
    const obj = {};

    if (typeof this._tableOptions === 'undefined') {
      return obj;
    }

    this._tableOptions.columns.forEach((column: OColumn) => {
      let totalValue = '';
      if (column.aggregate && column.visible) {
        totalValue = self.calculateAggregate(data, column);
      }
      const key = column.attr;
      obj[key] = totalValue;
    });

    return obj;
  }

  /**
   * Method that get value the columns calculated
   * @param data data of the database
   */
  getColumnCalculatedData(data: any[]): any[] {
    const self = this;
    const calculatedCols = this._tableOptions.columns.filter((oCol: OColumn) => oCol.visible && oCol.calculate !== undefined);
    return data.map((row: any) => {
      calculatedCols.forEach((oColumn: OColumn) => {
        let value;
        if (typeof oColumn.calculate === 'string') {
          value = self.transformFormula(oColumn.calculate, row);
        } else if (typeof oColumn.calculate === 'function') {
          value = oColumn.calculate(row);
        }
        row[oColumn.attr] = isNaN(value) ? 0 : value;
      });
      return row;
    });
  }

  protected transformFormula(formulaArg, row): string {
    let formula = formulaArg;
    // 1. replace columns by values of row
    const columnsAttr = this._tableOptions.columns.map((oCol: OColumn) => oCol.attr);
    columnsAttr.forEach((column: string) => {
      formula = formula.replace(column, row[column]);
    });

    let resultFormula = '';
    // 2. Transform formula
    try {
      resultFormula = (new Function('return ' + formula))();
    } catch (e) {
      console.error('Operation defined in the calculated column is incorrect ');
    }
    // 3. Return result
    return resultFormula;
  }

  getQuickFilterData(data: any[]): any[] {
    let filterData = this.quickFilter;
    if (filterData !== undefined && filterData.length > 0) {
      if (!this._tableOptions.filterCaseSensitive) {
        filterData = filterData.toLowerCase();
      }
      return data.filter((item: any) => {
        // Getting custom columns filter columns result
        const passCustomFilter = this.fulfillsCustomFilterFunctions(filterData, item);
        // Getting other searchable columns standard result
        const passSearchString = this.fulfillsQuickfilter(filterData, item);
        return passCustomFilter || passSearchString;
      });
    } else {
      return data;
    }
  }

  getPaginationData(data: any[]): any[] {
    if (!this._paginator || isNaN(this._paginator.pageSize)) {
      return data;
    }
    let startIndex = isNaN(this._paginator.pageSize) ? 0 : this._paginator.pageIndex * this._paginator.pageSize;
    if (data.length > 0 && data.length < startIndex) {
      startIndex = 0;
      this._paginator.pageIndex = 0;
    }
    return data.splice(startIndex, this._paginator.pageSize);
  }

  disconnect() {
    this.onRenderedDataChange.complete();
    this.dataTotalsChange.complete();
    this._quickFilterChange.complete();
    this._columnValueFilterChange.complete();
    this._loadDataScrollableChange.complete();
    this.groupByColumnChange.complete();
  }

  protected fulfillsCustomFilterFunctions(filter: string, item: any) {
    const customFilterCols = this.table.oTableOptions.columns.filter(oCol => oCol.useCustomFilterFunction());
    return customFilterCols.some(oCol => oCol.renderer.filterFunction(item[oCol.attr], item, filter));
  }

  protected fulfillsQuickfilter(filter: string, item: any): boolean {
    const columns = this._tableOptions.columns.filter((oCol: OColumn) => oCol.useQuickfilterFunction());
    let searchStr = columns.map((oCol: OColumn) => oCol.getFilterValue(item[oCol.attr], item).join(' ')).join(' ');
    if (!this._tableOptions.filterCaseSensitive) {
      searchStr = searchStr.toLowerCase();
    }
    return searchStr.indexOf(filter) !== -1;
  }

  /** Returns a sorted copy of the database data. */
  protected getSortedData(data: any[]): any[] {
    return this._sort.getSortedData(data);
  }

  /**
   * Returns the data the table stores. No filters are applied.
   */
  getTableData(): any[] {
    return this._database.data;
  }

  /** Return data of the visible columns of the table without rendering */
  getCurrentData(): any[] {
    return this.getData();
  }

  getCurrentAllData(): any[] {
    return this.getAllData(false, false);
  }

  /** Return data of the visible columns of the table  rendering */
  getCurrentRendererData(): any[] {
    return this.getRenderedData(this.renderedData);
  }

  /** Return all data of the table rendering */
  getAllRendererData(): any[] {
    return this.getAllData(true, true);
  }

  /** Return sql types of the current data */
  get sqlTypes(): any {
    return this._database.sqlTypes;
  }

  protected getData() {
    return this.renderedData;
  }

  public getRenderedData(data: any[]): any[] {
    const visibleColumns = this._tableOptions.columns.filter(oCol => oCol.visible);
    return data.map((row) => {
      const obj = {};
      visibleColumns.forEach((oCol: OColumn) => {
        const useRenderer = oCol.renderer && oCol.renderer.getCellData;
        obj[oCol.attr] = useRenderer ? oCol.renderer.getCellData(row[oCol.attr], row) : row[oCol.attr];
      });
      return obj;
    });
  }



  protected getAllData(usingRendererers?: boolean, onlyVisibleColumns?: boolean) {
    let tableColumns = this._tableOptions.columns;
    if (onlyVisibleColumns) {
      tableColumns = this._tableOptions.columns.filter(oCol => oCol.visible);
    }
    return this.filteredData.map((row) => {
      const obj = {};
      tableColumns.forEach((oCol: OColumn) => {
        const useRenderer = usingRendererers && oCol.renderer && oCol.renderer.getCellData;
        obj[oCol.attr] = useRenderer ? oCol.renderer.getCellData(row[oCol.attr], row) : row[oCol.attr];
      });
      return obj;
    });
  }

  private getRenderersData(data: any[], tableColumns: OColumn[]): any[] {
    return data.map((row) => {
      // render each column
      const obj = Object.assign({}, row);
      tableColumns.forEach((oCol: OColumn) => {
        obj[oCol.attr] = oCol.renderer.getCellData(row[oCol.attr], row);
      });
      return obj;
    });
  }

  public getColumnData(ocolumn: string) {
    return this.renderedData.map((row) => {
      // render each column
      const obj = {};
      if (ocolumn) {
        obj[ocolumn] = row[ocolumn];
      }
      return obj;
    });
  }

  initializeColumnsFilters(filters: OColumnValueFilter[]) {
    this.columnValueFilters = [];
    filters.forEach(filter => {
      this.columnValueFilters.push(filter);
    });
    if (!this.table.pageable) {
      this._columnValueFilterChange.next(null);
    }
  }

  isColumnValueFilterActive(): boolean {
    return this.columnValueFilters.length !== 0;
  }

  getColumnValueFilters(): OColumnValueFilter[] {
    return this.columnValueFilters;
  }

  getColumnValueFilterByAttr(attr: string): OColumnValueFilter {
    return this.columnValueFilters.filter(item => item.attr === attr)[0];
  }

  clearColumnFilters(trigger: boolean = true) {
    this.columnValueFilters = [];
    if (trigger) {
      this._columnValueFilterChange.next(null);
    }
  }

  clearColumnFilter(attr: string, trigger: boolean = true) {
    this.columnValueFilters = this.columnValueFilters.filter(x => x.attr !== attr);
    if (trigger) {
      this._columnValueFilterChange.next(null);
    }
  }

  addColumnFilter(filter: OColumnValueFilter) {
    const existingFilter = this.getColumnValueFilterByAttr(filter.attr);
    if (existingFilter) {
      const idx = this.columnValueFilters.indexOf(existingFilter);
      this.columnValueFilters.splice(idx, 1);
    }

    if (
      (ColumnValueFilterOperator.IN === filter.operator && filter.values.length > 0) ||
      (ColumnValueFilterOperator.EQUAL === filter.operator && filter.values) ||
      (ColumnValueFilterOperator.BETWEEN === filter.operator && filter.values.length === 2) ||
      ((ColumnValueFilterOperator.LESS_EQUAL === filter.operator || ColumnValueFilterOperator.MORE_EQUAL === filter.operator) && filter.values)
    ) {
      this.columnValueFilters.push(filter);
    }

    // If the table is paginated, filter will be applied on remote query
    if (!this.table.pageable) {
      this._columnValueFilterChange.next(null);
    }
  }

  getColumnValueFilterData(data: any[]): any[] {
    this.columnValueFilters.forEach(filter => {
      const filterColumn = this.table.oTableOptions.columns.find(col => col.attr === filter.attr);
      if (filterColumn) {
        switch (filter.operator) {
          case ColumnValueFilterOperator.IN:
            const filterValues = (filter.values || []).reduce((previous, current) =>
              previous.concat(filterColumn.getFilterValue(current).map(f => Util.normalizeString(f))), []);

            data = data.filter((item: any) => {
              if (filterColumn.renderer && filterColumn.renderer.filterFunction) {
                return filterColumn.renderer.filterFunction(item[filter.attr], item);
              } else {
                const colValues = filterColumn.getFilterValue(item[filter.attr], item).map(f => Util.normalizeString(f));
                return filterValues.some(value => colValues.indexOf(value) !== -1);
              }
            });
            break;
          case ColumnValueFilterOperator.EQUAL:
            const normalizedValue = Util.normalizeString(filter.values);
            data = data.filter(item => {
              const colValues = filterColumn.getFilterValue(item[filter.attr], item).map(f => Util.normalizeString(f));
              let regExp;
              if (normalizedValue.includes('*')) {
                regExp = new RegExp('^' + normalizedValue.split('*').join('.*') + '$');
              }
              return colValues.some(colValue => regExp ? regExp.test(colValue) : colValue.includes(normalizedValue));
            });
            break;
          case ColumnValueFilterOperator.BETWEEN:
            data = data.filter(item => item[filter.attr] >= filter.values[0] && item[filter.attr] <= filter.values[1]);
            break;
          case ColumnValueFilterOperator.MORE_EQUAL:
            data = data.filter(item => item[filter.attr] >= filter.values);
            break;
          case ColumnValueFilterOperator.LESS_EQUAL:
            data = data.filter(item => item[filter.attr] <= filter.values);
            break;
        }
      }
    });
    return data;
  }

  getAggregateData(column: OColumn) {
    const obj = {};
    let totalValue = '';

    if (typeof this._tableOptions === 'undefined') {
      return new Array(obj);
    }
    totalValue = this.aggregateData[column.attr];
    return totalValue;
  }

  calculateAggregate(data: any[], column: OColumn): any {
    let resultAggregate;
    const operator = column.aggregate.operator;
    if (typeof operator === 'string') {
      switch (operator.toLowerCase()) {
        case 'count':
          resultAggregate = this.count(column.attr, data);
          break;
        case 'min':
          resultAggregate = this.min(column.attr, data);
          break;
        case 'max':
          resultAggregate = this.max(column.attr, data);
          break;
        case 'avg':
          resultAggregate = this.avg(column.attr, data);
          break;
        default:
          resultAggregate = this.sum(column.attr, data);
          break;
      }
    } else {
      const columnData: any[] = this.getColumnData(column.attr);
      if (typeof operator === 'function') {
        resultAggregate = operator(columnData);
      }
    }
    return resultAggregate;
  }

  sum(column, data): number {
    let value = 0;
    if (data) {
      value = data.reduce((acumulator, currentValue) => {
        return acumulator + (isNaN(currentValue[column]) ? 0 : currentValue[column]);
      }, value);
    }
    return value;
  }

  count(column, data): number {
    let value = 0;
    if (data) {
      value = data.reduce((acumulator, currentValue, currentIndex) => {
        return acumulator + 1;
      }, 0);
    }
    return value;
  }

  avg(column, data): number {
    return this.sum(column, data) / this.count(column, data);
  }

  min(column, data): number {
    const tempMin = data.map(x => x[column]);
    return Math.min(...tempMin);
  }

  max(column, data): number {
    const tempMin = data.map(x => x[column]);
    return Math.max(...tempMin);
  }

  protected existsAnyCalculatedColumn(): boolean {
    return this._tableOptions.columns.find((oCol: OColumn) => oCol.calculate !== undefined) !== undefined;
  }

  updateRenderedRowData(rowData: any) {
    const tableKeys = this.table.getKeys();
    const record = this.renderedData.find((data: any) => {
      let found = true;
      for (let i = 0, len = tableKeys.length; i < len; i++) {
        const key = tableKeys[i];
        if (data[key] !== rowData[key]) {
          found = false;
          break;
        }
      }
      return found;
    });
    if (Util.isDefined(record)) {
      Object.assign(record, rowData);
    }
  }

  private getSublevel(data: any[], level: number, groupByColumns: string[], parent: OTableGroupedRow): any[] {
    if (level >= groupByColumns.length) {
      return data;
    }

    const self = this;
    //1. get unique rows Group
    const groups = Util.uniqueBy(
      data.map(
        row => {
          const result = new OTableGroupedRow();
          result.level = level + 1;
          result.parent = parent;
          result.expanded = !self.table.collapseGroupedColumns;
          for (let i = 0; i <= level; i++) {
            const key = {};
            key[groupByColumns[i]] = this.table.getColumnDataByAttr(groupByColumns[i], row);
            result.column = key;
          }
          if (!Util.isArrayEmpty(self.stateRowGrouped)) {
            const rowGroup = self.stateRowGrouped.find(x => JSON.stringify(x.column) === JSON.stringify(result.column) && JSON.stringify(x.parent) === JSON.stringify(result.parent));
            if (Util.isDefined(rowGroup)) {
              result.expanded = rowGroup.expanded;
            }
          }
          return result;
        }
      ),
      JSON.stringify);

    //2. Get Row group and children
    const currentColumn = groupByColumns[level];
    let subGroups = [];
    groups.forEach(group => {
      const rowsInGroup = data.filter(row => {
        const valueRenderer = self.table.getColumnDataByAttr(currentColumn, row);
        return group.column[currentColumn] === valueRenderer;
      });
      group.totalCounts = rowsInGroup.length;
      const subGroup = this.getSublevel(rowsInGroup, level + 1, groupByColumns, group);
      subGroup.unshift(group);
      subGroups = subGroups.concat(subGroup);
    });
    return subGroups;
  }

  /**
   * Filters collapsed row group
   * @param data
   * @returns collapsed row group
   */
  filterCollapsedRowGroup(data: any): any[] {
    const self = this;
    return data.filter((row: any) => (row instanceof OTableGroupedRow) ? row.visible : this.belongsToExpandedGroupedRow(data, row));
  }

  /**
   * Belongs to an expanded grouped row
   * @param data
   * @param row
   * @returns true if to expanded grouped row
   */
  belongsToExpandedGroupedRow(data: any, row: any): boolean {
    let parent: OTableGroupedRow;
    let match = false;
    for (let index = 0; index < data.length && !match; index++) {
      if (data[index] instanceof OTableGroupedRow) {
        parent = data[index];
      }
      if (JSON.stringify(data[index]) === JSON.stringify(row)) {
        match = true;
      }
    }

    return Util.isDefined(parent) ? (parent.visible && parent.expanded) : true;
  }

  /**
   * Updates grouped columns
   * @param groupByColumns
   */
  updateGroupedColumns(groupByColumns: string[]) {
    this.groupByColumns = groupByColumns;
    this.groupByColumnChange.next();
  }

  /**
   * Toggles group by column
   * @param rowGroup
   */
  toggleGroupByColumn(rowGroup: OTableGroupedRow) {
    //Update state rowGrouped
    const stateRowGrouped = this.stateRowGrouped.filter(row => JSON.stringify(rowGroup.column) === JSON.stringify(row.column) && JSON.stringify(rowGroup.parent) === JSON.stringify(row.parent));

    if (Util.isArrayEmpty(stateRowGrouped)) {
      rowGroup.expanded = !rowGroup.expanded;
      this.stateRowGrouped.push(rowGroup);
    } else {
      stateRowGrouped[0].expanded = !stateRowGrouped[0].expanded;
      //update rowgroup whose his parent is rowGroup
      // const parentToUpdate = this.stateRowGrouped.filter(row => JSON.stringify(rowGroup.parent) === JSON.stringify(row.parent));
      // parentToUpdate.forEach(row =>
      //   row.parent.expanded = !stateRowGrouped[0].expanded
      // );

    }
    this.groupByColumnChange.next();
  }


}



