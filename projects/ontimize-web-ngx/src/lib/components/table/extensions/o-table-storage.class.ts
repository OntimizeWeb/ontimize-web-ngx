import { Codes, Util } from '../../../utils';
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
  public static STORED_PROPERTIES_KEY = 'stored-properties';
  public static STORED_CONFIGURATIONS_KEY = 'user-stored-configurations';

  constructor(
    protected table: OTableComponent
  ) { }

  getDataToStore() {
    let dataToStore = {
      'filter': this.table.oTableQuickFilterComponent ? this.table.oTableQuickFilterComponent.value : ''
    };

    const properties = ['sort', 'columns-display', 'columns-filter', 'quick-filter', 'page', 'selection', 'initial-configuration'];

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
      case 'selection':
        result = this.getSelectionState();
        break;
      case 'initial-configuration':
        result = this.getInitialConfigurationState();
        break;
    }
    return result;
  }

  reset() {
    let state = {};
    state[OTableStorage.USER_STORED_FILTERS_KEY] = this.table.state[OTableStorage.USER_STORED_FILTERS_KEY];
    state[OTableStorage.STORED_CONFIGURATIONS_KEY] = this.table.state[OTableStorage.STORED_CONFIGURATIONS_KEY];
    if (this.table.pageable) {
      state['totalQueryRecordsNumber'] = this.table.state.totalQueryRecordsNumber;
    }
    state['currentPage'] = 0;
    this.table.state = state;
  }

  protected getSortState() {
    let result = {};
    let sortColumnsArray = this.table.sort.getSortColumns();
    if (sortColumnsArray.length > 0) {
      let sortColumns = [];
      sortColumnsArray.forEach(sortData => {
        sortColumns.push(sortData.id + Codes.COLUMNS_ALIAS_SEPARATOR + sortData.direction);
      });
      result['sort-columns'] = sortColumns.join(Codes.ARRAY_INPUT_SEPARATOR);
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
        visible: oCol.visible,
        width: oCol.getWidthToStore()
      });
    });
    result['oColumns-display'] = oColumnsData;
    result['select-column-visible'] = this.table.oTableOptions.selectColumn.visible;
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
    if (this.table.currentPage > 0 && this.table.storePaginationState) {
      result['currentPage'] = this.table.currentPage;
    }
    if (this.table.pageable && this.table.storePaginationState) {
      const state = this.table.state;
      result['totalQueryRecordsNumber'] = state.totalQueryRecordsNumber;
      result['queryRecordOffset'] = Math.max(
        (state.queryRecordOffset - this.table.dataSource.renderedData.length),
        (state.queryRecordOffset - this.table.queryRows)
      );
    }
    return result;
  }

  protected getSelectionState(): any {
    let result: any = {
      'selection': []
    };
    if (this.table && this.table.keepSelectedItems) {
      // storing selected items keys values
      const selection = [];
      this.table.getSelectedItems().forEach(item => {
        let data = {};
        this.table.getKeys().forEach(key => {
          data[key] = item[key];
        });
        selection.push(data);
      });
      result.selection = selection;
    }
    return result;
  }

  protected getInitialConfigurationState(): any {
    let result = {};
    let initialConfiguration = {};

    let oColumnsData = [];
    const self = this;
    Util.parseArray(this.table.originalVisibleColumns, true).forEach((x: string) => {
      let oCol = self.table.getOColumn(x);
      oColumnsData.push({
        attr: oCol.attr,
        visible: true,
        width: oCol.definition ? oCol.definition.originalWidth : undefined
      });
    });

    initialConfiguration['oColumns-display'] = oColumnsData;
    initialConfiguration['sort-columns'] = this.table.originalSortColumns;
    initialConfiguration['select-column-visible'] = this.table.oTableOptions.selectColumn.visible;
    initialConfiguration['filter-case-sensitive'] = this.table.filterCaseSensitive;
    initialConfiguration['query-rows'] = this.table.originalQueryRows;

    result['initial-configuration'] = initialConfiguration;

    return result;
  }

  setStoredFilters(filters: Array<ITableFiltersStatus>) {
    return this.table.state[OTableStorage.USER_STORED_FILTERS_KEY] = filters;
  }

  getStoredFilters() {
    return this.table.state[OTableStorage.USER_STORED_FILTERS_KEY] || [];
  }

  getStoredFilter(filterName: string) {
    return this.getStoredFilters().find((item: ITableFiltersStatus) => item.name === filterName);
  }

  getStoredFilterConf(filterName: string) {
    return (this.getStoredFilter(filterName) || {})[OTableStorage.STORED_FILTER_KEY];
  }

  deleteStoredFilter(filterName: string) {
    const storedFilters = this.table.state[OTableStorage.USER_STORED_FILTERS_KEY] || [];
    let index = storedFilters.findIndex((item: ITableFiltersStatus) => item.name === filterName);
    if (index >= 0) {
      storedFilters.splice(index, 1);
      this.table.state[OTableStorage.USER_STORED_FILTERS_KEY] = storedFilters;
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
    this.table.state[OTableStorage.USER_STORED_FILTERS_KEY] = existingFilters;
  }

  getStoredColumnsFilters(arg?: any) {
    let stateObj = arg || this.table.state;
    return stateObj['column-value-filters'] || [];
  }

  getStoredConfigurations() {
    return this.table.state[OTableStorage.STORED_CONFIGURATIONS_KEY] || [];
  }

  getStoredConfiguration(configurationName: string) {
    return this.getStoredConfigurations().find((item: ITableConfiguration) => item.name === configurationName);
  }

  storeConfiguration(configurationAgs: ITableConfiguration, tableProperties: any[]) {
    let result = {};
    this.table.storePaginationState = true;
    let storedConfiguration = this.getTablePropertiesToStore(tableProperties);
    this.table.storePaginationState = false;

    result[OTableStorage.STORED_CONFIGURATION_KEY] = storedConfiguration;
    Object.assign(result, configurationAgs);
    result[OTableStorage.STORED_PROPERTIES_KEY] = tableProperties;
    let existingConfigurations = this.getStoredConfigurations();
    existingConfigurations.push(result);
    this.table.state[OTableStorage.STORED_CONFIGURATIONS_KEY] = existingConfigurations;
  }

  deleteStoredConfiguration(configurationName: string) {
    const storedConfigurations = this.getStoredConfigurations();
    let index = storedConfigurations.findIndex((item: ITableConfiguration) => item.name === configurationName);
    if (index >= 0) {
      storedConfigurations.splice(index, 1);
      this.table.state[OTableStorage.STORED_CONFIGURATIONS_KEY] = storedConfigurations;
    }
  }

}
