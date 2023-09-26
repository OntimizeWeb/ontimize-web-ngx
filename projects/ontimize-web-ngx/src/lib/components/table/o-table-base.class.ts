import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import type { QuickFilterFunction } from "../../types/quick-filter-function.type";
import type { OColumn } from "./column/o-column.class";
import { ChangeDetectorRef, EventEmitter, TemplateRef } from "@angular/core";
import type { OPermissions } from "../../types/o-permissions.type";
import { SelectionModel } from "@angular/cdk/collections";
import type { OTableButtons } from "../../interfaces/o-table-buttons.interface";
import type { OTableQuickfilter } from "../../interfaces/o-table-quickfilter.interface";
import type { OTableMenu } from "../../interfaces/o-table-menu.interface";
import type { OColumnValueFilter } from "../../types/table/o-column-value-filter.type";
import type { OContextMenuComponent } from "../contextmenu/o-context-menu.component";
import type { OFilterDefinition, OGroupedColumnTypes, OTableMenuPermissions, SQLOrder } from "../../types";
import { Observable } from "rxjs";
import type { OTableComponentStateClass } from "../../services/state/o-table-component-state.class";
import type { OTableHeaderComponent } from "./extensions/header/table-header/o-table-header.component";
import type { MatPaginator } from "@angular/material/paginator";

export abstract class OTableBase {
  abstract getMenuPermissions(): OTableMenuPermissions;
  abstract rowHeightObservable: Observable<string>;
  abstract initializeCheckboxColumn();
  visibleExportDialogButtons: string;
  service: string;
  exportServiceType: TemplateRef<any>;
  exportOptsTemplate: any;
  visibleColArray: string[];
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


  abstract visibleColumns: string;
  abstract sortColArray: SQLOrder[];
  abstract currentPage: number;
  abstract queryRows: number;
  abstract resizable: boolean
  abstract registerTableHeaders(tableHeader: OTableHeaderComponent);
  abstract showButtonsText: boolean;
  abstract matpaginator: MatPaginator;
  abstract isIndeterminate(): boolean
}
