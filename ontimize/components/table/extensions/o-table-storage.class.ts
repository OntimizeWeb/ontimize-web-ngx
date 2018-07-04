import { OColumn, OTableComponent } from '../o-table.component';

export interface ITableFiltersStatus {
  name: string;
  description?: string;
  filter?: any;
}

export class OTableStorage {
  public static STORED_FILTER_KEY = 'stored-filter';
  public static USER_STORED_FILTERS_KEY = 'user-stored-filters';

  constructor(
    protected table: OTableComponent
  ) { }

  getDataToStore() {
    let dataToStore = {
      'filter': this.table.oTableQuickFilterComponent ? this.table.oTableQuickFilterComponent.value : '',
      'query-rows': this.table.matpaginator ? this.table.matpaginator.pageSize : ''
    };
    if (this.table.sortColArray.length > 0 && this.table.sort.active !== undefined) {
      dataToStore['sort-columns'] = this.table.sort.active + ':' + this.table.sort.direction;
    }
    if (this.table.oTableColumnsFilterComponent) {
      const columnValueFilters = this.table.dataSource.getColumnValueFilters();
      if (columnValueFilters.length > 0) {
        dataToStore['column-value-filters'] = this.table.dataSource.getColumnValueFilters();
      }
    }
    dataToStore['select-column-visible'] = this.table.oTableOptions.selectColumn.visible;
    Object.assign(dataToStore, this.getColumnsQuickFilterConf());
    Object.assign(dataToStore, this.getPageState());

    const storedFiltersArr = this.getStoredFilters();
    if (storedFiltersArr.length > 0) {
      dataToStore[OTableStorage.USER_STORED_FILTERS_KEY] = storedFiltersArr;
    }
    return dataToStore;
  }

  protected getColumnsQuickFilterConf() {
    let result = {};
    const tableOptions = this.table.oTableOptions;
    let oColumnsData = [];
    tableOptions.columns.forEach((oCol: OColumn) => {
      let colData = {
        attr: oCol.attr
      };
      colData['searchable'] = oCol.searchable;
      colData['searching'] = oCol.searching;
      oColumnsData.push(colData);
    });
    result['oColumns'] = oColumnsData;
    result['filter-case-sensitive'] = tableOptions.filterCaseSensitive;
    return result;
  }

  protected getPageState(): any {
    let result = {};
    if (this.table.currentPage > 0) {
      result = {
        currentPage: this.table.currentPage
      };
    }
    if (this.table.pageable) {
      const state = this.table.getState();
      result['totalQueryRecordsNumber'] = state.totalQueryRecordsNumber;
      result['queryRecordOffset'] = state.queryRecordOffset;
    }
    return result;
  }

  setStoredFilters(filters: Array<ITableFiltersStatus>) {
    return this.table.getState()[OTableStorage.USER_STORED_FILTERS_KEY] = filters;
  }

  getStoredFilters() {
    return this.table.getState()[OTableStorage.USER_STORED_FILTERS_KEY] || [];
  }

  getStoredFilter(filterName: string) {
    const storedFilters = this.table.getState()[OTableStorage.USER_STORED_FILTERS_KEY] || [];
    return storedFilters.find((item: ITableFiltersStatus) => item.name === filterName);
  }

  getStoredFilterConf(filterName: string) {
    const storedFilter = this.getStoredFilter(filterName);
    return (storedFilter || {})[OTableStorage.STORED_FILTER_KEY];
  }

  deleteStoredFilter(filterName: string) {
    const storedFilters = this.table.getState()[OTableStorage.USER_STORED_FILTERS_KEY] || [];
    let index = storedFilters.findIndex((item: ITableFiltersStatus) => item.name === filterName);
    if (index >= 0) {
      storedFilters.splice(index, 1);
      this.table.getState()[OTableStorage.USER_STORED_FILTERS_KEY] = storedFilters;
    }
  }

  storeFilter(filterArgs: ITableFiltersStatus) {
    let storedFilter = {};
    if (this.table.oTableColumnsFilterComponent) {
      const valueFiltersArr = this.table.dataSource.getColumnValueFilters();
      if (valueFiltersArr.length > 0) {
        storedFilter['column-value-filters'] = valueFiltersArr;
      }
    }
    Object.assign(storedFilter, this.getColumnsQuickFilterConf());
    let result = {};
    result[OTableStorage.STORED_FILTER_KEY] = storedFilter;
    Object.assign(result, filterArgs);
    let existingFilters = this.getStoredFilters();
    existingFilters.push(result);
    this.table.getState()[OTableStorage.USER_STORED_FILTERS_KEY] = existingFilters;
  }

  getStoredColumnsFilters(arg?: any) {
    let stateObj = arg || this.table.getState();
    return stateObj['column-value-filters'] || [];
  }

}
