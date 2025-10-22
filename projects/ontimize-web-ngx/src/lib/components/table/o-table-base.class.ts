import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, EventEmitter, TemplateRef } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import type { SnackBarService } from './../../services/snackbar.service';

import type { QuickFilterFunction } from "../../types/quick-filter-function.type";
import type { OColumn } from "./column/o-column.class";
import type { OPermissions } from "../../types/o-permissions.type";
import type { OTableButtons } from "../../interfaces/o-table-buttons.interface";
import type { OTableQuickfilter } from "../../interfaces/o-table-quickfilter.interface";
import type { OTableMenu } from "../../interfaces/o-table-menu.interface";
import type { OColumnValueFilter } from "../../types/table/o-column-value-filter.type";
import type { OContextMenuComponent } from "../contextmenu/o-context-menu.component";
import type { Expression, OFilterDefinition, OGroupedColumnTypes, OTableMenuPermissions, SQLOrder } from "../../types";
import type { OTableComponentStateClass } from "../../services/state/o-table-component-state.class";
import type { OTableHeaderComponent } from "./extensions/header/table-header/o-table-header.component";
import type { MatPaginator } from "@angular/material/paginator";
import type { OTableColumnSelectAllDirective } from "./extensions/header/table-column-select-all/o-table-column-select-all.directive";
import type { OFilterBuilderComponent } from "../filter-builder/o-filter-builder.component";
import { OTableColumnsFilterComponent } from './extensions/header/table-columns-filter/o-table-columns-filter.component';
import { OFilterColumn } from './extensions/header/table-columns-filter/columns/o-table-columns-filter-column.component';
import { BaseService } from '../../services/base-service.class';
import { ServiceResponse } from '../../interfaces/service-response.interface';


export abstract class OTableBase {
  abstract getMenuPermissions(): OTableMenuPermissions;
  abstract rowHeightObservable: Observable<string>;
  abstract initializeCheckboxColumn();
  oTableColumnsFilterComponent: OTableColumnsFilterComponent;
  visibleExportDialogButtons: string;
  service: string;
  serviceType: string;
  exportServiceType: string;
  exportOptsTemplate: any;
  visibleColArray: string[];
  queryMethod: string;
  showNotificationOfReadOnly: boolean;
  abstract reinitializeSortColumns(sortColumns?: SQLOrder[]);
  abstract setGroupColumns(value: any[]);
  abstract clearColumnFilters(triggerDatasourceUpdate?: boolean, columnsAttr?: string[]): void
  abstract refreshColumnsWidthFromLocalStorage();
  abstract rowHeight: string;
  abstract groupedColumnTypes: OGroupedColumnTypes[];
  abstract setGroupedColumnTypes(value: OGroupedColumnTypes[])
  abstract state: OTableComponentStateClass;
  abstract storeFilterInState(arg: OFilterDefinition);
  abstract setFiltersConfiguration();
  abstract reloadPaginatedDataFromStart(clearSelectedItems?: boolean);
  abstract clearFilters(): void;
  abstract resetColumnsWidth();
  abstract componentStateService: any;
  abstract applyDefaultConfiguration();
  abstract applyConfiguration(configurationName: string);

  abstract getColumnsNotIncluded(): string[]
  abstract getComponentFilter(existingFilter?: any): any;
  abstract entity: string;
  abstract getSqlTypes();
  abstract getColumnNames(columns: string[]): { [columnId: string]: string; };
  abstract showCaseSensitiveCheckbox(): boolean;
  abstract pageable: boolean;
  abstract dataSource: any;
  abstract quickFilterCallback: QuickFilterFunction;
  abstract abortQuery: BehaviorSubject<boolean>;
  abstract oTableOptions: any;
  abstract registerQuickFilter(arg: any): void;
  abstract getOColumnFromTh(th: any): OColumn;
  abstract cd: ChangeDetectorRef;
  abstract getClientWidthColumn(col: OColumn): number;
  abstract horizontalScroll: boolean;
  abstract getActionsPermissions(): OPermissions[];
  abstract selection: SelectionModel<Element>;
  abstract registerOTableButtons(arg: OTableButtons);
  abstract add();
  abstract reloadData();
  abstract remove();
  abstract onUpdateScrolledState: EventEmitter<any>;
  abstract rowWidth;
  abstract onContentChange: EventEmitter<any>;
  abstract staticData: Array<any>;
  abstract oTableQuickFilterComponent: OTableQuickfilter;
  abstract quickFilter: boolean;
  abstract groupedColumnsArray: string[];
  abstract isColumnFilterable(column: OColumn): boolean;
  abstract openColumnFilterDialog(column: OColumn, event: Event);
  abstract isColumnFiltersActive: boolean;
  abstract oTableMenu: OTableMenu;
  abstract getOColumn(attr: string): OColumn;
  abstract groupByColumn(column: OColumn, type?: string);
  abstract unGroupByColumn(column: OColumn);
  abstract unGroupByAllColumns();
  abstract filterByColumn(columnValueFilter: OColumnValueFilter);
  abstract refresh();
  abstract copySelection();
  abstract copyAll();
  abstract showAndSelectAllCheckbox();
  abstract doHandleClick(row: any, column: string, rowIndex: number, $event: MouseEvent);
  abstract viewDetail(item: any): void;
  abstract clearSelection(): void;
  abstract isSelectionModeMultiple(): boolean;
  abstract registerContextMenu(value: OContextMenuComponent): void;
  abstract groupable: boolean;
  abstract selectAllCheckbox: boolean;
  abstract isSelectionModeNone(): boolean;
  abstract isAllSelected(): boolean

  abstract nonHidableColumns: string;
  abstract visibleColumns: string;
  abstract sortColArray: SQLOrder[];
  abstract currentPage: number;
  abstract queryRows: number;
  abstract resizable: boolean
  abstract registerTableHeaders(tableHeader: OTableHeaderComponent);
  abstract showButtonsText: boolean;
  abstract matpaginator: MatPaginator;
  abstract isIndeterminate(): boolean;
  abstract onFilterByColumnChange: EventEmitter<any>;
  abstract masterToggle(event: MatCheckboxChange): void;
  abstract tableColumnSelectAllContentChild: OTableColumnSelectAllDirective;

  abstract getColumnFiltersExpression(): Expression;
  abstract columns: string;
  abstract getParentKeysValues();
  abstract filterBuilder: OFilterBuilderComponent;
  abstract readOnlyFunction: (configuration: any) => boolean;
  abstract isComponentReadOnly(selector: string, attr: string): boolean;
  abstract getSnackService(): SnackBarService;
  abstract setSelectedByKeys(keyValues: Array<any>): void;
  abstract setSelectedByMultipleKeys(keyValues: Array<Object>): void;
  abstract setSelectedByRowIds(rowIds: Array<number>): void;
  abstract getFilterColumnByAttr(attr: string): OFilterColumn;
  abstract getValue(): any[];
  abstract setOTableColumnsFilter(tableColumnsFilter: OTableColumnsFilterComponent);
  abstract getAllValues(): any[];
  abstract getDataService(): BaseService<ServiceResponse>;
}
