import { OColumn, OTableComponent } from '../o-table.component';

export interface ITableFiltersStatus {
  name: string;
  description?: string;
  filter?: any;
}

export interface ITableConfiguration {
  name: string;
  description?: string;
}

export class OTableStorage {
  public static STORED_FILTER_KEY = 'stored-filter';
  public static USER_STORED_FILTERS_KEY = 'user-stored-filters';

  public static STORED_CONFIGURATION_KEY = 'stored-configuration';
  public static STORED_CONFIGURATIONS_KEY = 'user-stored-configurations';

  constructor(
    protected table: OTableComponent
  ) { }

  getDataToStore() {
    let dataToStore = {
      'filter': this.table.oTableQuickFilterComponent ? this.table.oTableQuickFilterComponent.value : ''
    };
    dataToStore['select-column-visible'] = this.table.oTableOptions.selectColumn.visible;

    const properties = ['sort', 'columns-filter', 'quick-filter', 'page'];
    Object.assign(dataToStore, this.getTablePropertiesToStore(properties));

    const storedFiltersArr = this.getStoredFilters();
    if (storedFiltersArr.length > 0) {
      dataToStore[OTableStorage.USER_STORED_FILTERS_KEY] = storedFiltersArr;
    }
    const storedConfigurationsArr = this.getStoredConfigurations();
    if (storedConfigurationsArr.length > 0) {
      dataToStore[OTableStorage.STORED_CONFIGURATIONS_KEY] = storedConfigurationsArr;
    }
    return dataToStore;
  }

  getTablePropertiesToStore(properties: string[]) {
    let result = {};
    properties.forEach(prop => {
      Object.assign(result, this.getTablePropertyToStore(prop));
    });
    return result;
  }

  getTablePropertyToStore(property: string) {
    let result = {};
    switch (property) {
      case 'sort':
        result = this.getSortState();
        break;
      case 'columns-display':
        result = this.getColumnsDisplayState();
        break;
      case 'quick-filter':
        result = this.getColumnsQuickFilterState();
        break;
      case 'columns-filter':
        result = this.getColumnFiltersState();
        break;
      case 'page':
        result = this.getPageState();
        break;
    }
    return result;
  }

  protected getSortState() {
    let result = {};
    if (this.table.sortColArray.length > 0 && this.table.sort.active !== undefined) {
      result['sort-columns'] = this.table.sort.active + ':' + this.table.sort.direction;
    }
    return result;
  }

  protected getColumnFiltersState() {
    let result = {};
    if (this.table.oTableColumnsFilterComponent) {
      const columnValueFilters = this.table.dataSource.getColumnValueFilters();
      if (columnValueFilters.length > 0) {
        result['column-value-filters'] = columnValueFilters;
      }
    }
    return result;
  }

  protected getColumnsDisplayState() {
    let result = {};
    let oColumnsData = [];
    this.table.oTableOptions.columns.forEach((oCol: OColumn) => {
      oColumnsData.push({
        attr: oCol.attr,
        visible: oCol.visible
      });
    });
    result['oColumns-display'] = oColumnsData;
    return result;
  }

  protected getColumnsQuickFilterState() {
    let result = {};
    const tableOptions = this.table.oTableOptions;
    let oColumnsData = [];
    tableOptions.columns.forEach((oCol: OColumn) => {
      oColumnsData.push({
        attr: oCol.attr,
        searchable: oCol.searchable,
        searching: oCol.searching
      });
    });
    result['oColumns'] = oColumnsData;
    result['filter-case-sensitive'] = tableOptions.filterCaseSensitive;
    return result;
  }

  protected getPageState(): any {
    let result: any = {
      'query-rows': this.table.matpaginator ? this.table.matpaginator.pageSize : ''
    };
    if (this.table.currentPage > 0) {
      result['currentPage'] = this.table.currentPage;
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
    let result = {};
    let storedFilter = {};
    Object.assign(storedFilter, this.getColumnFiltersState());
    Object.assign(storedFilter, this.getColumnsQuickFilterState());

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

  getStoredConfigurations() {
    return this.table.getState()[OTableStorage.STORED_CONFIGURATIONS_KEY] || [];
  }

  storeConfiguration(configurationAgs: ITableConfiguration, tableProperties: any[]) {
    let result = {};
    let storedConfiguration = this.getTablePropertiesToStore(tableProperties);

    result[OTableStorage.STORED_CONFIGURATION_KEY] = storedConfiguration;
    Object.assign(result, configurationAgs);

    let existingConfigurations = this.getStoredConfigurations();
    existingConfigurations.push(result);
    this.table.getState()[OTableStorage.STORED_CONFIGURATIONS_KEY] = existingConfigurations;
  }

  deleteStoredConfiguration(configurationName: string) {
    const storedConfigurations = this.getStoredConfigurations();
    let index = storedConfigurations.findIndex((item: ITableConfiguration) => item.name === configurationName);
    if (index >= 0) {
      storedConfigurations.splice(index, 1);
      this.table.getState()[OTableStorage.STORED_CONFIGURATIONS_KEY] = storedConfigurations;
    }
  }

}
