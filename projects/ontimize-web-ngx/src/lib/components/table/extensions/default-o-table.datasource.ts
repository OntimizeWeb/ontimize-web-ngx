import { DataSource, ListRange } from '@angular/cdk/collections';
import { EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { BehaviorSubject, merge, Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

import { OTableDataSource } from '../../../interfaces/o-table-datasource.interface';
import { OTableOptions } from '../../../interfaces/o-table-options.interface';
import { ColumnValueFilterOperator, OColumnValueFilter } from '../../../types/table/o-column-value-filter.type';
import { Codes } from '../../../util';
import { Util } from '../../../util/util';
import { OColumn } from '../column/o-column.class';
import { OTableComponent } from '../o-table.component';
import { OTableDao } from './o-table.dao';
import { OTableGroupedRow } from './row/o-table-row-group.class';
import { OMatSort } from './sort/o-mat-sort';

export class OnRangeChangeVirtualScroll {
  public range: ListRange;

  constructor(data: ListRange) {
    this.range = data;
  }
}

export class DefaultOTableDataSource extends DataSource<any> implements OTableDataSource {
  dataTotalsChange = new BehaviorSubject<any[]>([]);

  get data(): any[] { return this.dataTotalsChange.value; }

  protected _database: OTableDao;
  protected _paginator: MatPaginator;
  protected _tableOptions: OTableOptions;
  protected _sort: OMatSort;

  protected _virtualPageChange = new BehaviorSubject<OnRangeChangeVirtualScroll>(new OnRangeChangeVirtualScroll({ start: 0, end: 0 }));
  protected _quickFilterChange = new BehaviorSubject('');
  protected _columnValueFilterChange = new BehaviorSubject(null);
  protected groupByColumnChange = new Subject();

  protected filteredData: any[] = [];
  protected aggregateData: any = {};

  onRenderedDataChange: EventEmitter<any> = new EventEmitter<any>();


  protected _renderedData: any[] = [];
  resultsLength: number = 0;

  get quickFilter(): string { return this._quickFilterChange.value || ''; }
  set quickFilter(filter: string) {
    this._quickFilterChange.next(filter);
  }

  private columnValueFilters: Array<OColumnValueFilter> = [];
  private groupedRowState: OTableGroupedRow[] = [];
  private activeAggregates = {};
  private groupedRowsSubscription = new Subscription();
  private levelsExpansionState = {};

  constructor(protected table: OTableComponent) {
    super();
    this._database = table.daoTable;
    if (this._database) {
      this.resultsLength = this._database.data.length;
    }
    if (table.paginator) {
      this._paginator = table.matpaginator;
    }

    if (this.table.virtualScrollViewport) {
      this.table.virtualScrollViewport.renderedRangeStream
        .pipe(distinctUntilChanged())
        .subscribe(
          (value: ListRange) => {
            this._virtualPageChange.next(new OnRangeChangeVirtualScroll(value));
          });
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
      }
    }

    if (this.table.virtualScrollViewport) {
      displayDataChanges.push(this._virtualPageChange);
    }

    displayDataChanges.push(this._columnValueFilterChange);

    if (this.table.groupable) {
      displayDataChanges.push(this.groupByColumnChange);
    }

    return merge(...displayDataChanges).pipe(
      map((x: any) => {
        let data = Object.assign([], this._database.data);
        if (x instanceof OnRangeChangeVirtualScroll) {
          // render subset (range) of renderedData when new OnRangeChangeVirtualScroll event is emitted
          data = this.getVirtualScrollData(this.renderedData, x);
        } else {
          /*
            it is necessary to first calculate the calculated columns and
            then filter and sort the data
          */

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
          if (this.table.groupable && !Util.isArrayEmpty(this.table.groupedColumnsArray) && data.length > 0) {
            data = this.getGroupedData(data);
          }

          this.renderedData = data;

          /*
            when the data is very large, the application crashes so it gets a limited range of data the first time
            because at next the CustomVirtualScrollStrategy will emit event OnRangeChangeVirtualScroll
          */
          if (this.table.virtualScrollViewport && !this._paginator) {
            data = this.getVirtualScrollData(data, new OnRangeChangeVirtualScroll({ start: 0, end: Codes.LIMIT_SCROLLVIRTUAL }));
          }

          this.aggregateData = this.getAggregatesData(this.renderedData);
        }
        return data;
      }));
  }

  getGroupedData(data: any[]) {
    data = this.getSubGroupsOfGroupedRow(data);
    /** data contains row group headers (OTableGroupedRow) and the data belonging to expanded grouped rows */
    data = this.filterCollapsedRowGroup(data);
    return data;
  }

  /**
   * Gets subgroups of grouped row
   * @param data
   * @returns subgroups of grouped row
   */
  getSubGroupsOfGroupedRow(data: any[]): any[] {
    return data = this.getSublevel(data, 0);
  }

  getAggregatesData(data: any[]): any {
    const obj = {};

    if (typeof this._tableOptions === 'undefined') {
      return obj;
    }

    this._tableOptions.columns.forEach((column: OColumn) => {
      let totalValue = '';
      if (column.aggregate && column.visible) {
        totalValue = this.calculateAggregate(data, column.attr, column.aggregate.operator);
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
    if (Util.isDefined(this.quickFilter) && this.quickFilter.length > 0) {
      const filterData = !this._tableOptions.filterCaseSensitive ? this.quickFilter.toLowerCase() : this.quickFilter;
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

  getVirtualScrollData(data: any[], x: OnRangeChangeVirtualScroll): any[] {
    return data.slice(x.range.start, x.range.end)
  }

  disconnect() {
    this.dataTotalsChange.complete();
    this._quickFilterChange.complete();
    this._columnValueFilterChange.complete();
    this.groupByColumnChange.complete();
    this._virtualPageChange.complete();
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
    return this.columnValueFilters.find(item => item.attr === attr);
  }

  clearColumnFilters(trigger: boolean = true, columnsAttr?: string[]) {
    if (Util.isDefined(columnsAttr)) {
      this.columnValueFilters = this.columnValueFilters.filter(x => !columnsAttr.includes(x.attr));
    } else {
      this.columnValueFilters = [];
    }
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
    const existingFilterIndex = this.columnValueFilters.findIndex(item => item.attr === filter.attr);
    if (existingFilterIndex > -1) {
      this.columnValueFilters.splice(existingFilterIndex, 1, filter);
    } else {
      let validFilter = Util.isDefined(filter.values);
      if (validFilter) {
        switch (filter.operator) {
          case ColumnValueFilterOperator.IN:
            validFilter = filter.values.length > 0;
            break;
          case ColumnValueFilterOperator.BETWEEN:
            validFilter = filter.values.length === 2;
            break;
          case ColumnValueFilterOperator.EQUAL:
          case ColumnValueFilterOperator.LESS_EQUAL:
          case ColumnValueFilterOperator.MORE_EQUAL:
            validFilter = true;
            break;
          default:
            validFilter = false;
        }
        if (validFilter) {
          this.columnValueFilters.push(filter);
        }
      }
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

  protected calculateAggregate(data: any[], columnAttr: string, operator: string | Function): any {
    let resultAggregate;
    if (typeof operator === 'string') {
      switch (operator.toLowerCase()) {
        case 'count':
          resultAggregate = this.count(columnAttr, data);
          break;
        case 'min':
          resultAggregate = this.min(columnAttr, data);
          break;
        case 'max':
          resultAggregate = this.max(columnAttr, data);
          break;
        case 'avg':
          resultAggregate = this.avg(columnAttr, data);
          break;
        default:
          resultAggregate = this.sum(columnAttr, data);
          break;
      }
    } else {
      const columnData: any[] = this.getColumnData(columnAttr);
      if (typeof operator === 'function') {
        resultAggregate = operator(columnData);
      }
    }
    return resultAggregate;
  }

  protected sum(column, data): number {
    let value = 0;
    if (data) {
      //If the data is grouped, the values ​​of the subgroups in level 1 are summed
      if (data[0] instanceof OTableGroupedRow) {
        this.getDataFromFirstLevelTableGroupRow(data).forEach(x => {
          value = x.getColumnAggregateData(column).reduce((acumulator, currentValue) => {
            return acumulator + (isNaN(currentValue[column]) ? 0 : currentValue[column]);
          }, value);
        });
      } else {
        value = data.reduce((acumulator, currentValue) => {
          return acumulator + (isNaN(currentValue[column]) ? 0 : currentValue[column]);
        }, value);
      }
    }
    return +(value).toFixed(2);
  }

  protected count(column, data): number {
    let value = 0;
    if (data) {
      //If the data is grouped, the count is calculated by adding the counts for each subgroup in level 1
      if (data[0] instanceof OTableGroupedRow) {
        this.getDataFromFirstLevelTableGroupRow(data).forEach(x => {
          value = x.getColumnAggregateData(column).reduce((acumulator) => {
            return acumulator + 1;
          }, value);
        });
      } else {
        value = data.reduce((acumulator) => {
          return acumulator + 1;
        }, 0);
      }
    }
    return value;
  }

  protected avg(column, data): number {
    const totalSum = this.sum(column, data);
    const totalCount = this.count(column, data);
    return +((totalSum === 0 || totalCount === 0) ? 0 : (totalSum / totalCount)).toFixed(2);

  }

  protected min(column, data): number {
    let tempMin = [];
    //If the data is grouped, the minimum is calculated with the minimum of each subgroup in level 1
    if (data[0] instanceof OTableGroupedRow) {
      tempMin = this.getDataFromFirstLevelTableGroupRow(data).map(x => {
        return Math.min(...x.getColumnAggregateData(column).map(x => x[column]));
      });
    } else {
      tempMin = data.map(x => x[column]);
    }

    return tempMin.length > 0 ? Math.min(...tempMin) : 0;
  }

  protected max(column, data): number {
    let tempMax = [];
    if (data[0] instanceof OTableGroupedRow) {
      //If the data are grouped, the maximum is calculated with the maximum of each subgroup in level 1
      tempMax = this.getDataFromFirstLevelTableGroupRow(data).map(x => {
        return Math.max(...x.getColumnAggregateData(column).map(x => x[column]));
      });
    } else {
      tempMax = data.map(x => x[column]);
    }
    return tempMax.length > 0 ? Math.max(...tempMax) : 0;
  }

  private isFirstLevelTableGroupRow(tableRowGroupData: any) {
    return tableRowGroupData instanceof OTableGroupedRow && tableRowGroupData.level === 1;
  }

  private getDataFromFirstLevelTableGroupRow(data: any) {
    return data.filter(x => this.isFirstLevelTableGroupRow(x));
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

  private getDataInformationByGroup(data: any[], level: number) {
    const recordHash = {};
    data.forEach((row, i) => {
      const keys = {};
      for (let i = 0; i <= level; i++) {
        keys[this.table.groupedColumnsArray[i]] = this.table.getColumnDataByAttr(this.table.groupedColumnsArray[i], row);
      }
      const recordKey = JSON.stringify(keys);
      if (recordHash.hasOwnProperty(recordKey)) {
        recordHash[recordKey].push(i);
      } else {
        recordHash[recordKey] = [i];
      }
    });
    return recordHash;
  }

  private recalculateColumnAggregate(columnAttr: string, row: OTableGroupedRow) {
    const aggregateConf = row.getActiveColumnAggregateConfiguration(columnAttr);
    const data = row.getColumnAggregateData(columnAttr);
    const value = this.calculateAggregate(data, aggregateConf.attr, aggregateConf.aggregateFunction || aggregateConf.aggregate);
    row.setColumnAggregateValue(columnAttr, value);
  }

  private getSublevel(data: any[], level: number, parent?: OTableGroupedRow): any[] {
    if (level >= this.table.groupedColumnsArray.length) {
      return data;
    }
    const recordHash = this.getDataInformationByGroup(data, level);

    let result = [];
    Object.keys(recordHash).forEach(recordKey => {

      const row = new OTableGroupedRow({
        column: this.table.groupedColumnsArray[level],
        keysAsString: recordKey,
        level: level + 1,
        parent: parent
      });

      this.groupedRowsSubscription.add(row.aggregateFunctionChange.subscribe(arg => {
        if (arg.changeAllGroupedRows) {
          this.activeAggregates[arg.columnAttr] = arg.activeAggregate;
          this.renderedData.filter(row => row instanceof OTableGroupedRow).forEach(row => {
            row.setColumnActiveAggregateFunction(arg.columnAttr, arg.activeAggregate, false);
            this.recalculateColumnAggregate(arg.columnAttr, row);
          });
        } else {
          this.recalculateColumnAggregate(arg.columnAttr, arg.row);
        }
      }));
      const affectedIndexes = recordHash[row.keysAsString];
      const groupData = data.filter((row, index) => affectedIndexes.includes(index));
      this.table.visibleColArray.forEach((columnAttr, i) => {
        if (i === 0) {
          row.title = this.getTextGroupRow(row, affectedIndexes.length);
        }
        const useColumnAggregate = this.table.useColumnGroupingAggregate(columnAttr);
        if (useColumnAggregate) {
          row.initializeColumnAggregate(columnAttr, this.table.getColumnGroupingComponent(columnAttr));

          if (Util.isDefined(this.activeAggregates[columnAttr])) {
            row.setColumnActiveAggregateFunction(columnAttr, this.activeAggregates[columnAttr], false);
          }

          if (row.hasActiveAggregate(columnAttr)) {
            const aggregateData = groupData.map(x => { const obj = {}; obj[columnAttr] = x[columnAttr]; return obj; });
            row.setColumnAggregateData(columnAttr, aggregateData);

            const aggregateConf = row.getActiveColumnAggregateConfiguration(columnAttr);
            const value = this.calculateAggregate(aggregateData, aggregateConf.attr, aggregateConf.aggregateFunction || aggregateConf.aggregate);
            row.setColumnAggregateValue(columnAttr, value);
          }
        }
      });
      row.expanded = this.getExpansionState(row);
      const subGroup = this.getSublevel(groupData, level + 1, row);
      subGroup.unshift(row);
      result = result.concat(subGroup);
    });
    return result;
  }

  /**
   * Filters collapsed row group
   * @param data
   * @returns collapsed row group
   */
  filterCollapsedRowGroup(data: any): any[] {
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
      } else if (Util.isEquivalent(data[index], row)) {
        match = true;
      }
    }
    return Util.isDefined(parent) ? (parent.visible && parent.expanded) : true;
  }

  updateGroupedColumns() {
    this.groupByColumnChange.next();
  }

  /**
   * Toggles group by column
   * @param rowGroup
   */
  toggleGroupByColumn(rowGroup: OTableGroupedRow) {
    if (rowGroup.expandSameLevel(this.table.expandGroupsSameLevel)) {
      this.levelsExpansionState[rowGroup.level] = !rowGroup.expanded;
    } else {
      this.updateStateRowGrouped(rowGroup);
    }
    this.groupByColumnChange.next();
  }

  setRowGroupLevelExpansion(rowGroup: OTableGroupedRow, value: boolean) {
    this.levelsExpansionState[rowGroup.level] = value;
    this.groupByColumnChange.next();
  }

  private updateStateRowGrouped(rowGroup: OTableGroupedRow) {
    const stateRowGrouped = this.groupedRowState.find(row => rowGroup.keysAsString === row.keysAsString && JSON.stringify(rowGroup.parent) === JSON.stringify(row.parent));
    if (Util.isDefined(stateRowGrouped)) {
      stateRowGrouped.expanded = !stateRowGrouped.expanded;
    } else {
      rowGroup.expanded = !rowGroup.expanded;
      this.groupedRowState.push(rowGroup);
    }
  }

  private getTextGroupRow(group: OTableGroupedRow, totalCounts: number) {
    const field = this.table.groupedColumnsArray[group.level - 1];
    let value = JSON.parse(group.keysAsString)[this.table.groupedColumnsArray[group.level - 1]];

    const oCol = this.table.getOColumn(field);

    if (!value && Util.isDefined(oCol.renderer) && (this.table as any).isInstanceOfOTableCellRendererServiceComponent(oCol.renderer)) {
      value = ' - ';
      if (!this.table.onDataLoadedCellRendererSubscription) {
        this.table.onDataLoadedCellRendererSubscription = (oCol.renderer as any).onDataLoaded.subscribe(x => {
          this.updateGroupedColumns();
        });
      }
    }
    return (this.table as any).translateService.get(oCol.title) + ': ' + value + ' (' + totalCounts + ')';
  }

  private getExpansionState(row: OTableGroupedRow): boolean {
    let expansionState = !parent || !this.table.collapseGroupedColumns;
    if (row.expandSameLevel(this.table.expandGroupsSameLevel)) {
      expansionState = this.levelsExpansionState.hasOwnProperty(row.level) ? this.levelsExpansionState[row.level] : expansionState;
    } else {
      const rowGroup = this.groupedRowState.find(x => x.keysAsString === row.keysAsString && JSON.stringify(x.parent) === JSON.stringify(row.parent));
      expansionState = rowGroup ? rowGroup.expanded : expansionState;
    }
    return expansionState;
  }
}



