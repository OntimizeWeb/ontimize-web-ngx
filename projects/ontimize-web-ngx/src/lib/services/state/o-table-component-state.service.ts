import { Injectable } from '@angular/core';

import { OColumn } from '../../components/table/column/o-column.class';
import { OTableComponent } from '../../components/table/o-table.component';
import { OColumnDisplay } from '../../types/table/o-column-display.type';
import { OColumnSearchable } from '../../types/table/o-column-searchable.type';
import { OTableConfiguration } from '../../types/table/o-table-configuration.type';
import { OTableFiltersStatus, OTableStoredFilter } from '../../types/table/o-table-filter-status.type';
import { Codes } from '../../util/codes';
import { Util } from '../../util/util';
import { AbstractComponentStateService } from './o-component-state.service';
import { OTableComponentStateClass } from './o-table-component-state.class';

@Injectable()
export class OTableComponentStateService extends AbstractComponentStateService<OTableComponentStateClass, OTableComponent> {

  initialize(component: OTableComponent) {
    this.state = new OTableComponentStateClass();
    super.initialize(component);
  }

  initializeState(state: OTableComponentStateClass) {
    super.initializeState(state);
    const initialConfigurationRawObj = state.initialConfiguration || {};
    state.initialConfiguration = new OTableComponentStateClass();
    state.initialConfiguration.setData(initialConfigurationRawObj);
  }

  refreshSelection() {
    this.state.selection = this.getSelectionState();
  }

  getDataToStore(): any {
    const dataToStore: any = {};
    const propertiesKeys = [
      'sort-columns',
      'oColumns-display',
      'columns-filter',
      'quick-filter',
      'page',
      'selection',
      'initial-configuration',
      'filter-columns',
      'filter-column-active',
      'grouped-columns',
      'user-stored-filters',
      'user-stored-configurations'
    ];
    Object.assign(dataToStore, this.getTablePropertiesToStore(propertiesKeys));
    return dataToStore;
  }

  storeFilter(newFilter: OTableFiltersStatus) {
    const storedFilter = {}
    Object.assign(storedFilter, this.getColumnFiltersState());
    Object.assign(storedFilter, this.getColumnsQuickFilterState());
    Object.assign(storedFilter, this.getFilterBuilderState());
    newFilter['stored-filter'] = storedFilter as OTableStoredFilter;
    this.state.addStoredFilter(newFilter);
  }

  storeConfiguration(configurationAgs: OTableConfiguration, tableProperties: any[]) {
    const newConfiguration: OTableConfiguration = {};
    this.component.storePaginationState = true;
    const storedConfiguration = this.getTablePropertiesToStore(tableProperties);
    this.component.storePaginationState = false;

    newConfiguration['stored-configuration'] = storedConfiguration;
    Object.assign(newConfiguration, configurationAgs);
    newConfiguration['stored-properties'] = tableProperties;

    this.state.addStoredConfiguration(newConfiguration);
  }

  protected getTablePropertiesToStore(properties: string[]): any {
    const result = {};
    properties.forEach(prop => {
      Object.assign(result, this.getTablePropertyToStore(prop));
    });
    return result;
  }

  protected getTablePropertyToStore(property: string): any {
    let result: any = {};
    switch (property) {
      case 'sort-columns':
        result = this.getSortState();
        break;
      case 'oColumns-display':
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
        result['selection'] = this.getSelectionState();
        break;
      case 'initial-configuration':
        result = this.getInitialConfigurationState();
        break;
      case 'filter-column-active':
        if (this.component.oTableColumnsFilterComponent) {
          result['filter-column-active'] = this.component.isColumnFiltersActive;
        }
        break;
      case 'filter-columns':
        result['filter-columns'] = this.component.filterColumns;
        break;
      case 'grouped-columns':
        result['grouped-columns'] = this.component.groupedColumnsArray;
        break;
      case 'user-stored-filters':
        result['user-stored-filters'] = this.state.storedFilters;
        break;
      case 'user-stored-configurations':
        result['user-stored-configurations'] = this.state.storedConfigurations;
        break;
    }
    return result;
  }

  protected getColumnsDisplayState() {
    const oColumnsData = [];
    this.component.oTableOptions.columns.forEach((oCol: OColumn) => {
      oColumnsData.push({
        attr: oCol.attr,
        visible: oCol.visible,
        width: oCol.getWidthToStore()
      });
    });
    return {
      'oColumns-display': oColumnsData,
      'select-column-visible': this.component.oTableOptions.selectColumn.visible
    };
  }

  protected getColumnsQuickFilterState() {
    const tableOptions = this.component.oTableOptions;
    const oColumnsData: OColumnSearchable[] = [];
    tableOptions.columns.forEach((oCol: OColumn) => {
      oColumnsData.push({
        attr: oCol.attr,
        searchable: oCol.searchable,
        searching: oCol.searching
      });
    });
    return {
      'oColumns': oColumnsData,
      'filter-case-sensitive': tableOptions.filterCaseSensitive,
      'filter': this.component.oTableQuickFilterComponent ? this.component.oTableQuickFilterComponent.value : ''
    };
  }

  protected getFilterBuilderState(): any {
    const result = {};
    if (this.component.filterBuilder) {
      let filterBuilder = this.component.filterBuilder.getFilterAttrsWithValue();
      if (!Util.isObjectEmpty(filterBuilder)) {
        result['filter-builder-values'] = filterBuilder;
      }
    }
    return result;
  }


  protected getColumnFiltersState() {
    const result = {};
    if (this.component.oTableColumnsFilterComponent && this.component.dataSource) {
      const columnValueFilters = this.component.dataSource.getColumnValueFilters();
      if (columnValueFilters.length > 0) {
        result['column-value-filters'] = columnValueFilters;
      }
    }
    return result;
  }

  protected getPageState(): any {
    const result: any = {
      'query-rows': this.component.matpaginator ? this.component.matpaginator.pageSize : ''
    };
    if (this.component.currentPage > 0 && this.component.storePaginationState) {
      result.currentPage = this.component.currentPage;
    }
    if (this.component.pageable && this.component.storePaginationState) {
      result.totalQueryRecordsNumber = this.component.state.totalQueryRecordsNumber;
      result.queryRecordOffset = Math.max(
        (this.component.state.queryRecordOffset - this.component.dataSource.renderedData.length),
        (this.component.state.queryRecordOffset - this.component.queryRows)
      );
    }
    return result;
  }

  protected getSelectionState(): any {
    const selection = [];
    if (this.component && this.component.keepSelectedItems) {
      // storing selected items keys values
      const tableKeys = this.component.getKeys();
      this.component.getSelectedItems().forEach(item => {
        const data = {};
        tableKeys.forEach(key => {
          data[key] = item[key];
        });
        selection.push(data);
      });
    }
    return selection;
  }

  protected getInitialConfigurationState(): any {
    const oColumnsData: OColumnDisplay[] = [];
    Util.parseArray(this.component.visibleColumns, true).forEach((columnAttr: string) => {
      let oCol = this.component.getOColumn(columnAttr);
      oColumnsData.push({
        attr: oCol.attr,
        visible: true,
        width: oCol.definition ? oCol.definition.originalWidth : undefined
      });
    });
    return {
      'initial-configuration': {
        'oColumns-display': oColumnsData,
        'sort-columns': this.component.sortColumns,
        'select-column-visible': this.component.oTableOptions.selectColumn.visible,
        'filter-case-sensitive': this.component.filterCaseSensitive,
        'query-rows': this.component.originalQueryRows,
        'filter-column-active-by-default': this.component.filterColumnActiveByDefault,
        'filter-columns': this.component.originalFilterColumns,
        'grouped-columns': this.component.originalGroupedColumnsArray
      }
    };
  }

  protected getSortState() {
    const sortColumns = [];
    this.component.sort.getSortColumns().forEach(sortData => {
      sortColumns.push(sortData.id + Codes.COLUMNS_ALIAS_SEPARATOR + sortData.direction);
    });
    return {
      'sort-columns': sortColumns.join(Codes.ARRAY_INPUT_SEPARATOR)
    };
  }
}


