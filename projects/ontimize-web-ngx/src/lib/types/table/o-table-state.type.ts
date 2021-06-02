import { OColumn } from '../../components/table/column/o-column.class';
import {
  OFilterColumn
} from '../../components/table/extensions/header/table-columns-filter/columns/o-table-columns-filter-column.component';
import { OColumnDisplay } from './o-column-display.type';
import { OColumnSearchable } from './o-column-searchable.type';
import { OColumnValueFilter } from './o-column-value-filter.type';
import { OTableConfiguration } from './o-table-configuration.type';
import { OTableFiltersStatus, OTableStoredFilter } from './o-table-filter-status.type';

export class TableLocalStorage {
  // sort
  protected 'sort-columns': string;
  // columns-display
  protected 'oColumns-display': OColumnDisplay[];
  protected 'select-column-visible': boolean;
  // quick-filter
  protected 'filter-case-sensitive': boolean;
  protected 'filter': string;
  protected 'oColumns': OColumnSearchable[];
  // columns-filter
  protected 'column-value-filters': OColumnValueFilter[];
  // page
  protected 'query-rows': number;
  'currentPage': number;
  'totalQueryRecordsNumber': number;
  'queryRecordOffset': number;
  // selection
  'selection': any[];
  // initial-configuration
  protected 'initial-configuration': TableLocalStorage;
  // filter-column-active
  protected 'filter-column-active': boolean;
  // filter-columns
  protected 'filter-columns': OFilterColumn[];
  protected 'filter-column-active-by-default': boolean;
  // grouped-columns
  protected 'grouped-columns': string[];
  // stored filters and configurations
  protected 'user-stored-filters': OTableFiltersStatus[];
  protected 'user-stored-configurations': OTableConfiguration[];

  constructor(state: any) {
    Object.assign(this, state);
  }

  get selectColumnVisible(): boolean {
    return this['select-column-visible'];
  }

  set selectColumnVisible(value: boolean) {
    this['select-column-visible'] = value;
  }

  get filterCaseSensitive(): boolean {
    return this['filter-case-sensitive'];
  }

  set filterCaseSensitive(value: boolean) {
    this['filter-case-sensitive'] = value;
  }

  get quickFilterValue(): string {
    return this['filter'];
  }

  set quickFilterValue(value: string) {
    this['filter'] = value;
  }

  get columnsDisplay(): OColumnDisplay[] {
    return this['oColumns-display'] || [];
  }

  set columnsDisplay(value: OColumnDisplay[]) {
    this['oColumns-display'] = value;
  }

  getColumnDisplay(oCol: OColumn): OColumnDisplay {
    return (this.columnsDisplay || []).find(col => col.attr === oCol.attr);
  }

  get initialConfiguration(): TableLocalStorage {
    return this['initial-configuration'];
  }

  set initialConfiguration(value: TableLocalStorage) {
    this['initial-configuration'] = value;
  }

  get sortColumns(): string {
    return this['sort-columns'];
  }

  set sortColumns(value: string) {
    this['sort-columns'] = value;
  }

  get filterColumns(): OFilterColumn[] {
    return this['filter-columns'] || [];
  }

  set filterColumns(value: OFilterColumn[]) {
    this['filter-columns'] = value;
  }

  get filterColumnActiveByDefault(): boolean {
    return this['filter-column-active-by-default'];
  }

  get groupedColumns(): string[] {
    return this['grouped-columns'] || [];
  }

  set groupedColumns(value: string[]) {
    this['grouped-columns'] = value;
  }

  get columnValueFilters(): OColumnValueFilter[] {
    return this['column-value-filters'] || [];
  }

  set columnValueFilters(value: OColumnValueFilter[]) {
    this['column-value-filters'] = value;
  }

  get queryRows(): number {
    return this['query-rows'];
  }

  set queryRows(value: number) {
    this['query-rows'] = value;
  }

  get storedFilters(): OTableFiltersStatus[] {
    return this['user-stored-filters'] || [];
  }

  addStoredFilter(filter: OTableFiltersStatus) {
    this.storedFilters.push(filter);
  }

  deleteStoredFilter(filterName: string) {
    const index = this.storedFilters.findIndex((item: OTableFiltersStatus) => item.name === filterName);
    if (index >= 0) {
      this.storedFilters.splice(index, 1);
    }
  }

  getStoredFilter(filterName: string): OTableStoredFilter {
    let result: OTableStoredFilter;
    const filter = this.storedFilters.find((item: OTableFiltersStatus) => item.name === filterName);
    if (filter) {
      result = filter['stored-filter'];
    }
    return result;
  }

  applyFilter(filterName: string) {
    const filter = this.getStoredFilter(filterName);
    if (filter) {
      this.columnValueFilters = filter['column-value-filters'];
      this.quickFilterValue = filter['filter'];
      this.filterCaseSensitive = filter['filter-case-sensitive'];
      this.oColumns = filter['oColumns'];
    }
  }

  get storedConfigurations(): OTableConfiguration[] {
    return this['user-stored-configurations'] || [];
  }

  addStoredConfiguration(configuration: OTableConfiguration) {
    this.storedConfigurations.push(configuration);
  }

  deleteStoredConfiguration(configurationName: string) {
    const index = this.storedConfigurations.findIndex((item: OTableConfiguration) => item.name === configurationName);
    if (index >= 0) {
      this.storedConfigurations.splice(index, 1);
    }
  }

  getStoredConfiguration(configurationName: string): OTableConfiguration {
    return this.storedConfigurations.find((item: OTableConfiguration) => item.name === configurationName);
  }

  applyConfiguration(configurationName: string) {
    const configuration = this.getStoredConfiguration(configurationName);
    if (configuration) {
      const properties = configuration['stored-properties'] || [];
      const conf: TableLocalStorage = configuration['stored-configuration'];
      this.copyPropertiesFromConfiguration(properties, conf);
    }
  }

  reset(pageable: boolean) {
    const result = {
      'user-stored-filters': this.storedFilters,
      'user-stored-configurations': this.storedConfigurations
    };
    if (pageable) {
      result['totalQueryRecordsNumber'] = this.totalQueryRecordsNumber;
    }
    result['currentPage'] = 0;

    Object.assign(this, {});
    Object.assign(this, result);
  }

  protected copyPropertiesFromConfiguration(properties: string[], configuration: TableLocalStorage) {
    properties.forEach(property => {
      switch (property) {
        case 'sort-columns':
          this.sortColumns = configuration['sort-columns'];
          break;
        case 'oColumns-display':
          this.columnsDisplay = configuration['oColumns-display'];
          this.selectColumnVisible = configuration['select-column-visible'];
          break;
        case 'quick-filter':
        case 'columns-filter':
          this.columnValueFilters = configuration['column-value-filters'];
          break;
        case 'grouped-columns':
          this.groupedColumns = configuration['grouped-columns'];
          break;
        case 'page':
          this.currentPage = configuration['currentPage'];
          // if (this.pageable) {
          this.totalQueryRecordsNumber = configuration['totalQueryRecordsNumber'];
          this.queryRecordOffset = configuration['queryRecordOffset'];
          // }
          this.queryRows = configuration['queryRows'];
          break;
      }
    });
  }
}
