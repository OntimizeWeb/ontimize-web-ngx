import { OColumn, OTableComponent } from '../o-table.component';

export interface ITableFiltersStatus {
  name: string;
  description?: string;
  filter?: any;
}

export class OTableStorage {
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
      dataToStore['column-value-filters'] = this.table.dataSource.getColumnValueFilters();
    }
    dataToStore['select-column-visible'] = this.table.oTableOptions.selectColumn.visible;
    Object.assign(dataToStore, this.getColumnsQuickFilterConf());
    Object.assign(dataToStore, this.getPageState());

    const storedFiltersArr = this.getStoredFilters();
    if (storedFiltersArr.length > 0) {
      dataToStore['user-stored-filters'] = storedFiltersArr;
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
    if (this.table.pageable) {
      const state = this.table.getState();
      result = {
        totalQueryRecordsNumber: state.totalQueryRecordsNumber,
        queryRecordOffset: state.queryRecordOffset
      };
    } else if (this.table.currentPage > 0) {
      result = {
        currentPage: this.table.currentPage
      };
    }
    return result;
  }

  protected getStoredFilters() {
    return this.table.getState()['user-stored-filters'] || [];
  }

  getStoredFilter(filterName: string) {
    const storedFilters = this.table.getState()['user-stored-filters'] || [];
    return storedFilters.find((item: ITableFiltersStatus) => item.name === filterName);
  }

  deleteStoredFilter(filterName: string) {
    const storedFilters = this.table.getState()['user-stored-filters'] || [];
    let index = storedFilters.findIndex((item: ITableFiltersStatus) => item.name === filterName);
    if (index >= 0) {
      storedFilters.splice(index, 1);
      this.table.getState()['user-stored-filters'] = storedFilters;
    }
  }

  storeFilter(filterArgs: ITableFiltersStatus) {
    let result = {};
    if (this.table.oTableColumnsFilterComponent) {
      const valueFiltersArr = this.table.dataSource.getColumnValueFilters();
      if (valueFiltersArr.length > 0) {
        result['column-value-filters'] = valueFiltersArr;
      }
    }
    result['filter'] = {};
    Object.assign(result['filter'], this.getColumnsQuickFilterConf());
    Object.assign(result, filterArgs);

    let existingFilters = this.getStoredFilters();
    existingFilters.push(result);
    this.table.getState()['user-stored-filters'] = existingFilters;
  }

  getStoredColumnsFilters(arg?: any) {
    let stateObj = arg || this.table.getState();
    return stateObj['column-value-filters'] || [];
  }

}
