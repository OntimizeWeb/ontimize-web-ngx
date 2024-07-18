import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionChange, SelectionModel } from '@angular/cdk/collections';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { DomPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { CdkVirtualScrollViewport, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import {
  AfterContentInit,
  AfterViewInit,
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Injector,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
  SimpleChange,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
  ViewRef,
  forwardRef
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu } from '@angular/material/menu';
import { PageEvent } from '@angular/material/paginator';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatTooltip } from '@angular/material/tooltip';
import moment from 'moment';
import { BehaviorSubject, Observable, Subscription, combineLatest, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

import { BooleanConverter, BooleanInputConverter } from '../../decorators/input-converter';
import { ComponentStateServiceProvider, O_COMPONENT_STATE_SERVICE, OntimizeServiceProvider } from '../../services/factories';
import { SnackBarService } from '../../services/snackbar.service';
import { OTableComponentStateClass } from '../../services/state/o-table-component-state.class';
import { OTableComponentStateService } from '../../services/state/o-table-component-state.service';
import { OColumnDisplay, OFilterDefinition, OGroupedColumnTypes, OTableGlobalConfig } from '../../types';
import { Expression } from '../../types/expression.type';
import { OPermissions } from '../../types/o-permissions.type';
import { OQueryDataArgs } from '../../types/query-data-args.type';
import { QuickFilterFunction } from '../../types/quick-filter-function.type';
import { SQLOrder } from '../../types/sql-order.type';
import { OColumnAggregate } from '../../types/table/o-column-aggregate.type';
import { ColumnValueFilterOperator, OColumnValueFilter } from '../../types/table/o-column-value-filter.type';
import { TableFilterByColumnDialogResult } from '../../types/table/o-table-filter-by-column-data.type';
import { OTableInitializationOptions } from '../../types/table/o-table-initialization-options.type';
import { OTableMenuPermissions } from '../../types/table/o-table-menu-permissions.type';
import { OTablePermissions } from '../../types/table/o-table-permissions.type';
import { ObservableWrapper } from '../../util/async';
import { Codes } from '../../util/codes';
import { FilterExpressionUtils } from '../../util/filter-expression.utils';
import { PermissionsUtils } from '../../util/permissions';
import { ServiceUtils } from '../../util/service.utils';
import { SQLTypes } from '../../util/sqltypes';
import { Util } from '../../util/util';
import { OContextMenuComponent } from '../contextmenu/o-context-menu.component';
import { OFormComponent } from '../form/o-form.component';
import { AbstractOServiceComponent } from '../o-service-component.class';
import { OTableColumnCalculatedComponent } from './column/calculated/o-table-column-calculated.component';
import { OBaseTableCellRenderer } from './column/cell-renderer/o-base-table-cell-renderer.class';
import { OColumn } from './column/o-column.class';
import { OTableColumnComponent } from './column/o-table-column.component';
import { OTableContextMenuComponent } from './extensions/contextmenu/o-table-context-menu.component';
import { DefaultOTableOptions } from './extensions/default-o-table-options.class';
import { OTableFilterByColumnDataDialogComponent } from './extensions/dialog/filter-by-column/o-table-filter-by-column-data-dialog.component';
import { OBaseTablePaginator } from './extensions/footer/paginator/o-base-table-paginator.class';
import { OTableButtonComponent } from './extensions/header/table-button/o-table-button.component';
import { OTableColumnSelectAllDirective } from './extensions/header/table-column-select-all/o-table-column-select-all.directive';
import { OFilterColumn } from './extensions/header/table-columns-filter/columns/o-table-columns-filter-column.component';
import { OTableColumnsFilterComponent } from './extensions/header/table-columns-filter/o-table-columns-filter.component';
import { OTableColumnsGroupingColumnComponent } from './extensions/header/table-columns-grouping/columns/o-table-columns-grouping-column.component';
import { OTableHeaderComponent } from './extensions/header/table-header/o-table-header.component';
import { OTableInsertableRowComponent } from './extensions/header/table-insertable-row/o-table-insertable-row.component';
import { OTableOptionComponent } from './extensions/header/table-option/o-table-option.component';
import { OTableDataSourceService } from './extensions/o-table-datasource.service';
import { OTableVirtualScrollStrategy } from './extensions/o-table-strategy.service';
import { OTableDao } from './extensions/o-table.dao';
import { OTableGroupedRow } from './extensions/row/o-table-row-group.class';
import { OTableRowExpandableComponent, OTableRowExpandedChange } from './extensions/row/table-row-expandable/o-table-row-expandable.component';
import { OMatSort } from './extensions/sort/o-mat-sort';
import { OTableBase } from './o-table-base.class';
import { O_TABLE_GLOBAL_CONFIG } from './utils/o-table.tokens';

import type { IOContextMenuContext } from '../../interfaces/o-context-menu.interface';
import type { OTableButton } from '../../interfaces/o-table-button.interface';
import type { OTableButtons } from '../../interfaces/o-table-buttons.interface';
import type { OTableColumnsGrouping } from '../../interfaces/o-table-columns-grouping-interface';
import type { OTableDataSource } from '../../interfaces/o-table-datasource.interface';
import type { OTableMenu } from '../../interfaces/o-table-menu.interface';
import type { OTableOptions } from '../../interfaces/o-table-options.interface';
import type { OTablePaginator } from '../../interfaces/o-table-paginator.interface';
import type { OTableQuickfilter } from '../../interfaces/o-table-quickfilter.interface';
import type { ServiceResponse } from '../../interfaces/service-response.interface';
export const DEFAULT_INPUTS_O_TABLE = [
  // visible-columns [string]: visible columns, separated by ';'. Default: no value.
  'visibleColumns: visible-columns',

  // visible-columns-by-default [string]: columns that are visible by default, separated by ';'. Default: no value.
  'defaultVisibleColumns: default-visible-columns',

  // editable-columns [string]: columns that can be edited directly over the table, separated by ';'. Default: no value.
  // 'editableColumns: editable-columns',

  // sort-columns [string]: initial sorting, with the format column:[ASC|DESC], separated by ';'. Default: no value.
  'sortColumns: sort-columns',

  'quickFilterCallback: quick-filter-function',

  // delete-button [no|yes]: show delete button. Default: yes.
  'deleteButton: delete-button',

  // refresh-button [no|yes]: show refresh button. Default: yes.
  'refreshButton: refresh-button',

  // columns-visibility-button [no|yes]: show columns visibility button. Default: yes.
  'columnsVisibilityButton: columns-visibility-button',

  // // columns-resize-button [no|yes]: show columns resize button. Default: yes.
  // 'columnsResizeButton: columns-resize-button',

  // // columns-group-button [no|yes]: show columns group button. Default: yes.
  // 'columnsGroupButton: columns-group-button',

  // export-button [no|yes]: show export button. Default: yes.
  'exportButton: export-button',

  // show-configuration-option [yes|no|true|false]: show configuration button in header. Default: yes.
  'showConfigurationOption: show-configuration-option',

  // show-buttons-text [yes|no|true|false]: show text of header buttons. Default: yes.
  'showButtonsText: show-buttons-text',

  // select-all-checkbox [yes|no|true|false]:  show in the menu the option of selection check boxes . Default: no.
  'selectAllCheckbox: select-all-checkbox',

  // pagination-controls [yes|no|true|false]: show pagination controls. Default: yes.
  'paginationControls: pagination-controls',

  // fix-header [yes|no|true|false]: fixed header and footer when the content is greather than its own height. Default: yes.
  'fixedHeader: fixed-header',

  // show-title [yes|no|true|false]: show the table title. Default: no.
  'showTitle: show-title',

  // edition-mode [none | inline | click | dblclick]: edition mode. Default none
  'editionMode: edition-mode',

  // selection-mode [none | simple | multiple ]: selection mode. Default multiple
  'selectionMode: selection-mode',

  'horizontalScroll: horizontal-scroll',

  'showPaginatorFirstLastButtons: show-paginator-first-last-buttons',

  'autoAlignTitles: auto-align-titles',

  'multipleSort: multiple-sort',
  // select-all-checkbox-visible [yes|no|true|false]: show selection check boxes.Default: no.
  'selectAllCheckboxVisible: select-all-checkbox-visible',

  'orderable',

  'resizable',

  'keepSelectedItems: keep-selected-items',

  // export-mode ['visible'|'local'|'all']: sets the mode to export data. Default: 'visible'
  'exportMode: export-mode',

  // exportServiceType [ string ]: The service used by the table for exporting it's data, it must implement 'IExportService' interface. Default: 'OntimizeExportService'
  'exportServiceType: export-service-type',

  // auto-adjust [true|false]: Auto adjust column width to fit its content. Default: true
  'autoAdjust: auto-adjust',

  // show-filter-option [yes|no|true|false]: show filter menu option in the header menu. Default: yes.
  'showFilterOption: show-filter-option',

  // visible-export-dialog-buttons [string]: visible buttons in export dialog, separated by ';'. Default/no configured: show all. Empty value: hide all.
  'visibleExportDialogButtons: visible-export-dialog-buttons',

  // row-class [function, (rowData: any, rowIndex: number) => string | string[]]: adds the class or classes returned by the provided function to the table rows.
  'rowClass: row-class',

  // filter-column-active-by-default [yes|no|true|false]: show icon filter by default in the table. Default:yes
  'filterColumnActiveByDefault:filter-column-active-by-default',

  // grouped-columns [string]: grouped columns separated by ';'. Default: no value.
  'groupedColumns: grouped-columns',

  // groupable[boolean]: Indicates whether or not the column can be groupable. By default: true
  'groupable',

  // expand-groups-same-level[boolean]: Indicates if click in row expands/collapses all rows on same level. By default: true
  'expandGroupsSameLevel: expand-groups-same-level',

  // collapse-grouped-columns [yes|no|true|false]: Whether collapse the grouped columns by default
  'collapseGroupedColumns: collapse-grouped-columns',

  // virtual-scroll [yes|no|true|false]: Whether enabled or not the virtual scroll
  'virtualScroll: virtual-scroll',

  //context-menu [yes|no|true|false]: Indicates whether or not to include the table context menu
  'contextMenu: context-menu',

  // show-expandable-icon-function [function]: Expandable function to check if expandable has data to show or not icon
  'showExpandableIconFunction: show-expandable-icon-function',

  // show-report-on-demand-option [yes|no|true|false]: show report on demand option in the table menu. Default: yes.
  'showReportOnDemandOption: show-report-on-demand-option',

  // show-charts-on-demand-option [yes|no|true|false]: show charts on demand option in the header menu
  'showChartsOnDemandOption: show-charts-on-demand-option',

  // show-reset-width-option [yes|no|true|false]: show reset width menu option in the header menu
  'showResetWidthOption: show-reset-width-option',

  'disableSelectionFunction: disable-selection-function',

  'nonHidableColumns: non-hidable-columns'
];

export const DEFAULT_OUTPUTS_O_TABLE = [
  'onRowSelected',
  'onRowDeselected',
  'onRowDeleted'
];

const stickyHeaderSelector = '.mat-mdc-header-row .mat-mdc-table-sticky';
const stickyFooterSelector = '.mat-mdc-footer-row .mat-mdc-table-sticky';
const rowSelector = '.mat-mdc-row';
const headerSelector = '.mat-mdc-header-row';
const footerSelector = '.mat-mdc-header-row';

type DisableSelectionFunction = (item: any) => boolean;

@Component({
  selector: 'o-table',
  templateUrl: './o-table.component.html',
  styleUrls: ['./o-table.component.scss'],
  providers: [
    OntimizeServiceProvider,
    ComponentStateServiceProvider,
    OTableDataSourceService,
    { provide: O_COMPONENT_STATE_SERVICE, useClass: OTableComponentStateService },
    { provide: VIRTUAL_SCROLL_STRATEGY, useClass: OTableVirtualScrollStrategy },
    { provide: OTableBase, useExisting: forwardRef(() => OTableComponent) }
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ],
  inputs: DEFAULT_INPUTS_O_TABLE,
  outputs: DEFAULT_OUTPUTS_O_TABLE,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.o-table]': 'true',
    '[class.ontimize-table]': 'true',
    '[class.o-table-fixed]': 'fixedHeader',
    '[class.o-table-disabled]': '!enabled',
    '(document:click)': 'handleDOMClick($event)'
  }
})
export class OTableComponent extends AbstractOServiceComponent<OTableComponentStateService> implements OnInit, OnDestroy, AfterViewInit, AfterContentInit {
  public static DEFAULT_BASE_SIZE_SPINNER = 100;
  public static FIRST_LAST_CELL_PADDING = 24;
  public static EXPANDED_ROW_CONTAINER_CLASS = 'expanded-row-container-';
  public static AVAILABLE_GROUPING_COLUMNS_RENDERERS = ['currency', 'integer', 'real'];

  public DETAIL_MODE_NONE = Codes.DETAIL_MODE_NONE;
  public EDIT_MODE_NONE = Codes.EDITION_MODE_NONE;

  protected snackBarService: SnackBarService;

  public paginator: OTablePaginator;

  sort: OMatSort;

  @ViewChild(OMatSort)
  set oMatSort(_sort: OMatSort) {
    if (Util.isDefined(_sort) &&
      (!Util.isDefined(this.sort) || (Util.isDefined(this.sort) && Util.stringify(this.sort) !== Util.stringify(_sort)))) {
      this.sort = _sort;
      this.registerSortListener();
      this.setDatasource();
    }
  };

  public virtualScrollViewport: CdkVirtualScrollViewport;

  public oTableGlobalConfig: OTableGlobalConfig;
  @ViewChild('virtualScrollViewPort') set cdkVirtualScrollViewport(value: CdkVirtualScrollViewport) {
    if (value != this.virtualScrollViewport) {
      this.virtualScrollViewport = value;
      this.updateHeaderAndFooterStickyPositions();
      if (this.checkViewportSizeSubscription) {
        this.checkViewportSizeSubscription.unsubscribe();
      }

      if (this.virtualScrollViewport) {
        this.checkViewportSizeSubscription = this.checkViewPortSubject.subscribe(x => {
          if (x) {
            this.checkViewportSize();
          }
        });
      }
    }
  }

  // only for insideTabBugWorkaround
  protected tableHeaders: Array<OTableHeaderComponent> = [];

  @ViewChild('spinnerContainer', { read: ElementRef })
  spinnerContainer: ElementRef;

  @ContentChild(OTableRowExpandableComponent)
  tableRowExpandable: OTableRowExpandableComponent;

  _filterColumns: Array<OFilterColumn>;
  portalHost: Array<DomPortalOutlet> = [];
  onDataLoadedCellRendererSubscription: Subscription;



  public tableContextMenu: OContextMenuComponent;

  @BooleanInputConverter()
  selectAllCheckbox: boolean = false;
  @BooleanInputConverter()
  exportButton: boolean = true;
  @BooleanInputConverter()
  showConfigurationOption: boolean = true;
  @BooleanInputConverter()
  columnsVisibilityButton: boolean = true;
  @BooleanInputConverter()
  showFilterOption: boolean = true;
  @BooleanInputConverter()
  showReportOnDemandOption: boolean = true;
  @BooleanInputConverter()
  showChartsOnDemandOption: boolean = true;
  @BooleanInputConverter()
  showButtonsText: boolean = true;
  @BooleanInputConverter()
  filterColumnActiveByDefault: boolean = true;
  @BooleanInputConverter()
  showResetWidthOption: boolean = true;

  // Expandable input callback function
  showExpandableIconFunction: (row: any, rowIndex: number) => boolean | Promise<boolean> | Observable<boolean>;

  protected _oTableOptions: OTableOptions;

  get oTableOptions(): OTableOptions {
    return this._oTableOptions;
  }

  set oTableOptions(value: OTableOptions) {
    this._oTableOptions = value;
  }

  set quickFilter(value: boolean) {
    value = Util.parseBoolean(String(value));
    this._quickFilter = value;
    this._oTableOptions.filter = value;
  }

  get quickFilter(): boolean {
    return this._quickFilter;
  }

  set filterCaseSensitive(value: boolean) {
    this._filterCaseSensitive = BooleanConverter(value);
    if (this._oTableOptions) {
      this._oTableOptions.filterCaseSensitive = this._filterCaseSensitive;
    }
  }

  get filterCaseSensitive(): boolean {
    return this._filterCaseSensitive;
  }

  @BooleanInputConverter()
  insertButton: boolean = true;
  @BooleanInputConverter()
  refreshButton: boolean = true;
  @BooleanInputConverter()
  deleteButton: boolean = true;
  @BooleanInputConverter()
  fixedHeader: boolean = true;
  @BooleanInputConverter()
  showTitle: boolean = false;
  editionMode: string = Codes.EDITION_MODE_NONE;
  selectionMode: string = Codes.SELECTION_MODE_MULTIPLE;

  protected _horizontalScroll = false;
  @BooleanInputConverter()
  set horizontalScroll(value: boolean) {
    this._horizontalScroll = BooleanConverter(value);
    this.refreshColumnsWidthFromOriginalDefinition();
  }

  get horizontalScroll(): boolean {
    return this._horizontalScroll;
  }

  @BooleanInputConverter()
  showPaginatorFirstLastButtons: boolean = true;
  @BooleanInputConverter()
  autoAlignTitles: boolean = true;
  @BooleanInputConverter()
  multipleSort: boolean = true;
  @BooleanInputConverter()
  orderable: boolean = true;
  @BooleanInputConverter()
  resizable: boolean = true;
  @BooleanInputConverter()
  autoAdjust: boolean = true;
  @BooleanInputConverter()
  groupable: boolean = true;
  @BooleanInputConverter()
  expandGroupsSameLevel: boolean = true;
  @BooleanInputConverter()
  collapseGroupedColumns: boolean = false;
  @BooleanInputConverter()
  virtualScroll: boolean = true;
  @BooleanInputConverter()
  contextMenu: boolean = true;
  // Maintaining this getter to allow component extensions (avoiding a breaking change)
  get enabled(): boolean {
    return this.oenabled;
  }
  protected _selectAllCheckboxVisible: boolean;
  set selectAllCheckboxVisible(value: boolean) {
    this._selectAllCheckboxVisible = BooleanConverter(value);
    if (this.state) {
      this._selectAllCheckboxVisible = BooleanConverter(this.state.selectColumnVisible);
    }
    this._oTableOptions.selectColumn.visible = this._selectAllCheckboxVisible;
    this.initializeCheckboxColumn();
  }

  get selectAllCheckboxVisible(): boolean {
    return this._selectAllCheckboxVisible;
  }

  @BooleanInputConverter()
  keepSelectedItems: boolean = true;

  public exportMode: string = Codes.EXPORT_MODE_VISIBLE;
  public exportServiceType: string;
  public visibleExportDialogButtons: string;
  public daoTable: OTableDao | null;
  public dataSource: OTableDataSource | null;
  public visibleColumns: string;
  public searcheableColumns: string[] = [];
  public defaultVisibleColumns: string;
  public groupedColumns: string;
  public nonHidableColumns: string;

  public sortColumns: string;
  public groupedColumnTypes: OGroupedColumnTypes[] = [];
  public rowClass: (rowData: any, rowIndex: number) => string | string[];

  /*parsed inputs variables */
  protected _visibleColArray: string[] = [];

  get visibleColArray(): any[] {
    return this._visibleColArray;
  }

  set visibleColArray(arg: any[]) {
    const permissionsBlocked = this.permissions && this.permissions.columns ? this.permissions.columns.filter(col => col.visible === false).map(col => col.attr) : [];
    const permissionsChecked = arg.filter(value => permissionsBlocked.indexOf(value) === -1);
    this._visibleColArray = permissionsChecked;
    if (this._oTableOptions) {
      const containsSelectionCol = this._oTableOptions.visibleColumns.indexOf(Codes.NAME_COLUMN_SELECT) !== -1;
      const containsExpandableCol = this._oTableOptions.visibleColumns.indexOf(Codes.NAME_COLUMN_EXPANDABLE) !== -1;
      if (containsSelectionCol) {
        this._visibleColArray.unshift(Codes.NAME_COLUMN_SELECT);
      }
      if (containsSelectionCol && containsExpandableCol) {
        this._visibleColArray = [this._visibleColArray[0]].concat(Codes.NAME_COLUMN_EXPANDABLE, this._visibleColArray.splice(1));

      } else {
        if (containsExpandableCol) {
          this._visibleColArray.unshift(Codes.NAME_COLUMN_EXPANDABLE);
        }
      }
      this._oTableOptions.visibleColumns = this._visibleColArray;
      this.groupingHeadersRows = this._oTableOptions.visibleColumns.map(visibleCol => 'groupHeader-' + visibleCol);
    }
  }

  sortColArray: SQLOrder[] = [];
  /*end of parsed inputs variables */

  protected tabGroupContainer: MatTabGroup;
  protected tabContainer: MatTab;
  tabGroupChangeSubscription: Subscription;

  protected pendingQuery: boolean = false;
  protected pendingQueryFilter = undefined;

  protected setStaticData: boolean = false;
  protected avoidQueryColumns: Array<any> = [];
  protected asyncLoadColumns: Array<any> = [];
  protected asyncLoadSubscriptions: object = {};

  protected querySubscription: Subscription;
  protected contextMenuSubscription: Subscription;
  protected virtualScrollSubscription: Subscription;
  protected checkViewportSizeSubscription: Subscription;
  protected finishQuerySubscription: boolean = false;

  public onRowSelected: EventEmitter<any> = new EventEmitter();
  public onRowDeselected: EventEmitter<any> = new EventEmitter();
  public onRowDeleted: EventEmitter<any> = new EventEmitter();
  public onReinitialize: EventEmitter<any> = new EventEmitter();
  public onContentChange: EventEmitter<any> = new EventEmitter();
  public onFilterByColumnChange: EventEmitter<any> = new EventEmitter();

  protected selectionChangeSubscription: Subscription;

  public oTableFilterByColumnDataDialogComponent: OTableFilterByColumnDataDialogComponent;
  public oTableColumnsFilterComponent: OTableColumnsFilterComponent;

  private showTotalsSubject = new BehaviorSubject<boolean>(false);
  public showTotals: Observable<boolean> = this.showTotalsSubject.asObservable();
  private loadingSortingSubject = new BehaviorSubject<boolean>(false);
  protected loadingSorting: Observable<boolean> = this.loadingSortingSubject.asObservable();
  private loadingScrollSubject = new BehaviorSubject<boolean>(false);
  public loadingScroll: Observable<boolean> = this.loadingScrollSubject.asObservable();

  public showLoading: Observable<boolean> = combineLatest([
    this.loading.pipe(debounceTime(200)), // avoid displaying loading spinner for a very short time
    this.loadingSorting,
    this.loadingScroll
  ]).pipe(
    distinctUntilChanged((prev, curr) => prev[0] === curr[0] && prev[1] === curr[1] && prev[2] === curr[2]), // avoid emitting same value multiple times
    map((res: boolean[]) => res.some(r => r))
  );

  public oTableInsertableRowComponent: OTableInsertableRowComponent;
  public showFirstInsertableRow: boolean = false;
  public showLastInsertableRow: boolean = false;
  public expandableItem: SelectionModel<any>;

  protected clickTimer;
  protected clickDelay = 200;
  protected clickPrevent = false;
  public editingCell: any;
  protected editingRow: any;

  set currentPage(val: number) {
    this._currentPage = val;
    if (this.paginator) {
      this.paginator.pageIndex = val;
      if (this.matpaginator) {
        this.matpaginator.pageIndex = val;
      }
    }
  }

  get currentPage(): number {
    return this._currentPage;
  }

  public oTableQuickFilterComponent: OTableQuickfilter;
  protected sortSubscription: Subscription;
  protected onRenderedDataChange: Subscription;
  protected previousRendererData;

  quickFilterCallback: QuickFilterFunction;
  disableSelectionFunction: DisableSelectionFunction;

  @ViewChild('tableBody')
  protected tableBodyEl: ElementRef;
  @ViewChild('tableHeader', { read: ElementRef })
  tableHeaderEl: ElementRef;
  @ViewChild('tableToolbar', { read: ElementRef })
  tableToolbarEl: ElementRef;

  horizontalScrolled: boolean;
  public onUpdateScrolledState: EventEmitter<any> = new EventEmitter();
  public rowWidth;

  storePaginationState: boolean = false;

  /* In the case the table havent paginationControl and pageable, the table has pagination virtual*/
  pageScrollVirtual = 1;

  public static DEFAULT_ROW_HEIGHT = 36;
  protected permissions: OTablePermissions;
  matMenu: MatMenu;

  @ViewChild('tableMenu')
  oTableMenu: OTableMenu;

  @ContentChildren(OTableOptionComponent)
  tableOptions: QueryList<OTableOptionComponent>;

  oTableButtons: OTableButtons;

  @ContentChildren(OTableButtonComponent)
  tableButtons: QueryList<OTableButton>;

  @ContentChild('o-table-quickfilter', { static: true })
  quickfilterContentChild: OTableQuickfilter;


  @ViewChild('exportOptsTemplate')
  exportOptsTemplate: TemplateRef<any>;

  @ContentChild(OTableColumnSelectAllDirective)
  tableColumnSelectAllContentChild: OTableColumnSelectAllDirective;



  public groupedColumnsArray: string[] = [];
  @HostListener('window:resize', [])
  updateScrolledState(): void {
    if (this.horizontalScroll) {
      setTimeout(() => {
        const bodyWidth = this.tableBodyEl.nativeElement.clientWidth;
        const scrollWidth = this.tableBodyEl.nativeElement.scrollWidth;
        const previousState = this.horizontalScrolled;
        this.horizontalScrolled = scrollWidth > bodyWidth;
        if (previousState !== this.horizontalScrolled) {
          this.onUpdateScrolledState.emit(this.horizontalScrolled);
        }
      }, 0);
    }
    this.checkViewportSize();
  }

  protected _isColumnFiltersActive: boolean = false;

  get isColumnFiltersActive(): boolean {
    return this._isColumnFiltersActive;
  }

  set isColumnFiltersActive(val: boolean) {
    this._isColumnFiltersActive = val;
  }

  groupingHeadersRows: string[] = [];

  public oTableColumnsGroupingComponent: OTableColumnsGrouping;

  @ContentChild(OTableContextMenuComponent, { static: true })
  contextMenuContentChild: OTableContextMenuComponent;

  protected triggerSelectionEvents: boolean = true;

  @ViewChildren(MatTooltip)
  tooltip: QueryList<MatTooltip>;

  constructor(
    public injector: Injector,
    elRef: ElementRef,
    protected dialog: MatDialog,
    private _viewContainerRef: ViewContainerRef,
    private appRef: ApplicationRef,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    @Optional() @Inject(VIRTUAL_SCROLL_STRATEGY) public readonly scrollStrategy: OTableVirtualScrollStrategy
  ) {
    super(injector, elRef, form);

    this._oTableOptions = new DefaultOTableOptions();

    try {
      this.tabGroupContainer = this.injector.get(MatTabGroup);
      this.tabContainer = this.injector.get(MatTab);
    } catch (error) {
      // Do nothing due to not always is contained on tab.
    }

    this.snackBarService = this.injector.get(SnackBarService);
    this.getInjectionTokenConfig();
  }

  private getInjectionTokenConfig() {
    try {
      const oTableGlobalConfig = this.injector.get(O_TABLE_GLOBAL_CONFIG);
      if (Util.isDefined(oTableGlobalConfig.autoAdjust)) {
        this.autoAdjust = oTableGlobalConfig.autoAdjust;
      };
      if (Util.isDefined(oTableGlobalConfig.autoAlignTitles)) {
        this.autoAlignTitles = oTableGlobalConfig.autoAlignTitles;
      }
      if (Util.isDefined(oTableGlobalConfig.filterColumnActiveByDefault)) {
        this.filterColumnActiveByDefault = oTableGlobalConfig.filterColumnActiveByDefault;
      }
      if (Util.isDefined(oTableGlobalConfig.editionMode) && Codes.isValidEditionMode(oTableGlobalConfig.editionMode)) {
        this.editionMode = oTableGlobalConfig.editionMode;
      }
      if (Util.isDefined(oTableGlobalConfig.detailMode && Codes.isValidDetailMode(oTableGlobalConfig.detailMode))) {
        this.detailMode = oTableGlobalConfig.detailMode;
      }

      if (Util.isDefined(oTableGlobalConfig.rowHeight) && Codes.isValidRowHeight(oTableGlobalConfig.rowHeight)) {
        this.rowHeight = oTableGlobalConfig.rowHeight;
      };
    } catch (error) {
      // Do nothing because is optional
    }

  }

  get state(): OTableComponentStateClass {
    return this.componentStateService.state;
  }

  ngOnInit() {
    this.initialize();
    if (this.oTableButtons && this.tableButtons && this.tableButtons.length > 0) {
      this.oTableButtons.registerButtons(this.tableButtons.toArray());
    }
  }

  ngAfterViewInit() {
    super.afterViewInit();
    this.initTableAfterViewInit();
    if (this.oTableMenu) {
      this.matMenu = this.oTableMenu.matMenu;
      this.oTableMenu.registerOptions(this.tableOptions.toArray());
    }

    if (this.tableRowExpandable) {
      this.expandableItem = new SelectionModel<any>(this.tableRowExpandable.multiple, []);
      this.createExpandableColumn();
    }
  }

  ngAfterContentInit() {
    if (this.tableColumnSelectAllContentChild) {
      //
      this.setCustomDefinitionInSelectColumn(this.tableColumnSelectAllContentChild)
    }
  }

  setCustomDefinitionInSelectColumn(definition: OTableColumnSelectAllDirective) {
    if (definition.title) {
      this._oTableOptions.selectColumn.title = definition.title;
    }
    if (definition.width) {
      this._oTableOptions.selectColumn.width = definition.width;
    }
    if (definition.minWidth) {
      this._oTableOptions.selectColumn.minWidth = definition.minWidth;
    }
    if (definition.maxWidth) {
      this._oTableOptions.selectColumn.maxWidth = definition.maxWidth;
    }
    if (definition.resizable) {
      this._oTableOptions.selectColumn.resizable = definition.resizable;
    }
  }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    super.ngOnChanges(changes);
    if (Util.isDefined(changes.autoAdjust) && changes.autoAdjust.currentValue !== changes.autoAdjust.previousValue) {
      this.autoAdjust = changes.autoAdjust.currentValue;
    }
  }

  updateHeaderAndFooterStickyPositions() {
    if (this.virtualScrollSubscription) {
      this.virtualScrollSubscription.unsubscribe();
    }

    if (this.virtualScrollViewport) {
      const zone = this.injector.get(NgZone);
      this.virtualScrollSubscription = this.scrollStrategy.stickyChange.pipe(
        distinctUntilChanged(),
        filter(() => this.fixedHeader || this.hasInsertableRow())
      ).subscribe(x => {
        zone.run(() => {
          this.elRef.nativeElement.querySelectorAll(stickyHeaderSelector).forEach((el: HTMLElement) => {
            el.style.top = - x + 'px';
          });
          this.elRef.nativeElement.querySelectorAll(stickyFooterSelector).forEach((el: HTMLElement) => {
            el.style.bottom = x + 'px';
          });
        });
      });
    }
  }

  protected createExpandableColumn() {
    this._oTableOptions.expandableColumn = new OColumn();
    this._oTableOptions.expandableColumn.visible = this.tableRowExpandable && this.tableRowExpandable.expandableColumnVisible;
    this.updateStateExpandedColumn();
  }

  ngOnDestroy() {

    //detach all porta host created
    if (this.portalHost) {
      this.portalHost.forEach(x => x.detach());
    }
    this.destroy();
  }

  getSuffixColumnInsertable() {
    return Codes.SUFFIX_COLUMN_INSERTABLE;
  }

  getActionsPermissions(): OPermissions[] {
    return this.permissions ? (this.permissions.actions || []) : [];
  }

  getMenuPermissions(): OTableMenuPermissions {
    const result: OTableMenuPermissions = this.permissions ? this.permissions.menu : undefined;
    return result ? result : {
      visible: true,
      enabled: true,
      items: []
    };
  }

  getOColumnPermissions(attr: string): OPermissions {
    const columns = this.permissions ? (this.permissions.columns || []) : [];
    return columns.find(comp => comp.attr === attr) || { attr: attr, enabled: true, visible: true };
  }

  protected getActionPermissions(attr: string): OPermissions {
    const actionsPerm = this.permissions ? (this.permissions.actions || []) : [];
    const permissions: OPermissions = actionsPerm.find(p => p.attr === attr);
    return permissions || {
      attr: attr,
      visible: true,
      enabled: true
    };
  }

  protected checkEnabledActionPermission(attr: string) {
    const actionsPerm = this.permissions ? (this.permissions.actions || []) : [];
    const permissions: OPermissions = actionsPerm.find(p => p.attr === attr);
    const enabledPermision = PermissionsUtils.checkEnabledPermission(permissions);
    if (!enabledPermision) {
      this.snackBarService.open('MESSAGES.OPERATION_NOT_ALLOWED_PERMISSION');
    }
    return enabledPermision;
  }

  /**
   * Method what initialize vars and configuration
   */
  initialize(): any {
    super.initialize();

    this._oTableOptions = new DefaultOTableOptions();
    if (this.tabGroupContainer && this.tabContainer) {
      this.registerTabListener();
    }

    // Initialize params of the table
    this.initializeParams();

    this.initializeDao();

    this.permissions = this.permissionsService.getTablePermissions(this.oattr, this.actRoute);
  }

  protected initializeDao() {
    // Configure dao methods
    const queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
    const methods = {
      query: queryMethodName,
      update: this.updateMethod,
      delete: this.deleteMethod,
      insert: this.insertMethod
    };

    if (this.staticData) {
      this.queryOnBind = false;
      this.queryOnInit = false;
      this.daoTable = new OTableDao(undefined, this.entity, methods);
      this.setDataArray(this.staticData);
    } else {
      this.configureService();
      this.daoTable = new OTableDao(this.dataService, this.entity, methods);
    }
  }

  /**
   * Allow reinitialize table adding options
   * @param options
   */
  reinitialize(options: OTableInitializationOptions): void {
    if (options) {
      const clonedOpts = Object.assign({}, options);
      if (clonedOpts.hasOwnProperty('entity')) {
        this.entity = clonedOpts.entity;
      }
      if (clonedOpts.hasOwnProperty('service')) {
        this.service = clonedOpts.service;
      }
      if (clonedOpts.hasOwnProperty('columns')) {
        this.columns = clonedOpts.columns;
      }
      if (clonedOpts.hasOwnProperty('visibleColumns')) {
        this.visibleColumns = clonedOpts.visibleColumns;
      }
      if (clonedOpts.hasOwnProperty('defaultVisibleColumns')) {
        this.defaultVisibleColumns = clonedOpts.defaultVisibleColumns;
      }
      if (clonedOpts.hasOwnProperty('keys')) {
        this.keys = clonedOpts.keys;
      }
      if (clonedOpts.hasOwnProperty('sortColumns')) {
        this.sortColumns = clonedOpts.sortColumns;
      }
      if (clonedOpts.hasOwnProperty('parentKeys')) {
        this.parentKeys = clonedOpts.parentKeys;
      }

      if (clonedOpts.hasOwnProperty('filterColumns')) {
        if (!this.oTableColumnsFilterComponent) {
          this.oTableColumnsFilterComponent = new OTableColumnsFilterComponent(this.injector, this);
          this.oTableMenu.onVisibleFilterOptionChange.next(this.filterColumnActiveByDefault);
          this.oTableColumnsFilterComponent.columns = clonedOpts.filterColumns;
        }
        else {
          this.oTableColumnsFilterComponent.columns = this.searcheableColumns.join(";");
        }
      }
    }

    this.destroy();
    this.initialize();
    this.state.reset(this.pageable);
    this.initTableAfterViewInit();
    this.onReinitialize.emit(null);
  }

  protected initTableAfterViewInit() {
    this.parseVisibleColumns();
    this.parseSearcheableColumns();
    this.setDatasource();
    this.parseGroupedColumns();
    this.parseGroupedColumnTypes();
    this.parseSortColumns();
    this.setFiltersConfiguration();
    this.addDefaultRowButtons();
    if (Util.isDefined(this.oTableColumnsGroupingComponent)) {
      this.setGroupColumns(this.oTableColumnsGroupingComponent.columnsArray);
    }
    if (this.queryOnInit) {
      this.queryData();
    }
  }
  parseSearcheableColumns() {
    this.searcheableColumns = this.visibleColArray.filter(col => {
      const oCol = this.getOColumn(col);
      return oCol && oCol.searchable;
    })

  }
  destroy() {
    super.destroy();
    if (this.tabGroupChangeSubscription) {
      this.tabGroupChangeSubscription.unsubscribe();
    }
    if (this.selectionChangeSubscription) {
      this.selectionChangeSubscription.unsubscribe();
    }
    if (this.sortSubscription) {
      this.sortSubscription.unsubscribe();
    }
    if (this.onRenderedDataChange) {
      this.onRenderedDataChange.unsubscribe();
    }
    if (this.contextMenuSubscription) {
      this.contextMenuSubscription.unsubscribe();
    }

    if (this.virtualScrollSubscription) {
      this.virtualScrollSubscription.unsubscribe();
    }

    if (this.checkViewportSizeSubscription) {
      this.checkViewportSizeSubscription.unsubscribe();
    }

    if (this.scrollStrategy) {
      this.scrollStrategy.destroy();
    }

    Object.keys(this.asyncLoadSubscriptions).forEach(idx => {
      if (this.asyncLoadSubscriptions[idx]) {
        this.asyncLoadSubscriptions[idx].unsubscribe();
      }
    });
  }

  /**
   * Method update store localstorage, call of the ILocalStorage
   */
  getDataToStore() {
    return this.componentStateService.getDataToStore();
  }

  registerQuickFilter(arg: any) {
    const quickFilter = (arg as OTableQuickfilter);
    // forcing quickFilterComponent to be undefined, table uses oTableQuickFilterComponent
    this.quickFilterComponent = undefined;
    this.oTableQuickFilterComponent = quickFilter;
    if (Util.isDefined(this.oTableQuickFilterComponent)) {
      this.oTableQuickFilterComponent.setValue(this.state.quickFilterValue, false);
      this.quickFilterSubscription = this.oTableQuickFilterComponent.onChange.subscribe(val => {
        this.onSearch.emit(val);
      });
    }
  }

  registerPagination(value: OTablePaginator) {
    this.paginationControls = true;
    this.paginator = value;
  }

  registerContextMenu(value: OContextMenuComponent): void {
    this.tableContextMenu = value;
    this.contextMenuSubscription = this.tableContextMenu.onShow.subscribe((params: IOContextMenuContext) => {
      params.class = 'o-table-context-menu ' + this.rowHeight;
      if (params.data && !this.isRowSelected(params.data.rowValue)) {
        this.clearSelection();
        this.selectedRow(params.data.rowValue);
      }
    });
  }

  registerDefaultColumn(column: string) {
    if (Util.isDefined(this.getOColumn(column))) {
      // a default column definition trying to replace an already existing definition
      return;
    }
    const colDef: OColumn = this.createOColumn(column, this);
    this.pushOColumnDefinition(colDef);
  }

  /**
   * Store all columns and properties in var columnsArray
   * @param column
   */
  registerColumn(column: OTableColumnComponent | OTableColumnCalculatedComponent | any) {
    const columnAttr = (typeof column === 'string') ? column : column.attr;
    const columnPermissions: OPermissions = this.getOColumnPermissions(columnAttr);
    if (!columnPermissions.visible) {
      return;
    }

    if (typeof column === 'string') {
      this.registerDefaultColumn(column);
      return;
    }

    const columnDef = this.getOColumn(column.attr);
    if (Util.isDefined(columnDef) && Util.isDefined(columnDef.definition)) {
      // a o-table-column definition trying to replace an already existing o-table-column definition
      return;
    }

    const colDef: OColumn = this.createOColumn(column.attr, this, column);
    let columnWidth = this.getColumnWidthFromState(colDef);
    if (Util.isDefined(columnWidth)) {
      colDef.width = columnWidth;
    }
    if (column && (column.asyncLoad || column.type === 'action')) {
      this.avoidQueryColumns.push(column.attr);
      if (column.asyncLoad) {
        this.asyncLoadColumns.push(column.attr);
      }
    }
    this.pushOColumnDefinition(colDef);
  }

  protected pushOColumnDefinition(colDef: OColumn) {
    colDef.visible = (this._visibleColArray.indexOf(colDef.attr) !== -1);
    // Find column definition by name
    const alreadyExisting = this.getOColumn(colDef.attr);
    if (alreadyExisting !== undefined) {
      const replacingIndex = this._oTableOptions.columns.indexOf(alreadyExisting);
      this._oTableOptions.columns[replacingIndex] = colDef;
    } else {
      this._oTableOptions.columns.push(colDef);
    }
    this.ensureColumnsOrder();
    this.refreshEditionModeWarn();
  }

  protected refreshEditionModeWarn() {
    if (this.editionMode !== Codes.EDITION_MODE_NONE) {
      return;
    }
    const editableColumns = this._oTableOptions.columns.filter(col => {
      return Util.isDefined(col.editor);
    });
    setTimeout(() => {
      if (editableColumns.length > 0 && !this.hasInsertableRow()) {
        console.warn('Using a column with a editor but there is no edition-mode defined');
      }
    }, 100);
  }

  registerColumnAggregate(column: OColumnAggregate) {
    this.showTotalsSubject.next(true);
    const alreadyExisting = this.getOColumn(column.attr);
    if (alreadyExisting !== undefined) {
      const replacingIndex = this._oTableOptions.columns.indexOf(alreadyExisting);
      this._oTableOptions.columns[replacingIndex].aggregate = column;
    }
  }

  registerTableHeaders(tableHeader: OTableHeaderComponent) {
    if (this.tableHeaders.findIndex(header => header.column.attr === tableHeader.column.attr) === -1) {
      this.tableHeaders.push(tableHeader);
    }
  }

  parseVisibleColumns(defaultConfiguration: boolean = false) {
    if (this.state.columnsDisplay) {
      // filtering columns that might be in state storage but not in the actual table definition
      let stateCols: OColumnDisplay[] = [];
      this.state.columnsDisplay.forEach((oCol, index) => {
        const isVisibleColInColumns = this._oTableOptions.columns.find(col => col.attr === oCol.attr) !== undefined;

        if (isVisibleColInColumns) {
          stateCols.push(oCol);
        } else {
          console.warn('Unable to load the column ' + oCol.attr + ' from the localstorage');
        }
      });
      if (defaultConfiguration) {
        stateCols = this.state.initialConfiguration.columnsDisplay;
      } else {
        stateCols = this.checkChangesVisibleColummnsInInitialConfiguration(stateCols);
      }

      this._oTableOptions.columns.sort((a: OColumn, b: OColumn) => {
        const indexA = stateCols.findIndex(col => col.attr === a.attr);
        const indexB = stateCols.findIndex(col => col.attr === b.attr);
        return indexA - indexB;
      });
      this.visibleColArray = stateCols.filter(item => item.visible).map(item => item.attr);
    } else {
      this.visibleColArray = Util.parseArray(this.defaultVisibleColumns ? this.defaultVisibleColumns : this.visibleColumns, true);
      this._oTableOptions.columns.sort((a: OColumn, b: OColumn) => this.visibleColArray.indexOf(a.attr) - this.visibleColArray.indexOf(b.attr));
    }
  }

  checkChangesVisibleColummnsInInitialConfiguration(stateCols: OColumnDisplay[]): OColumnDisplay[] {
    if (this.state.initialConfiguration.columnsDisplay) {
      const originalVisibleColArray =
        this.state.initialConfiguration.columnsDisplay.filter(x => x.visible).map(x => x.attr);

      const visibleColArray = Util.parseArray(this.visibleColumns, true);

      // Find values in visible-columns that they arent in original-visible-columns in localstorage
      // in this case you have to add this column to this.visibleColArray
      const colToAddInVisibleCol = Util.differenceArrays(visibleColArray, originalVisibleColArray);
      colToAddInVisibleCol.forEach((colAdd) => {
        let indexCol = stateCols.findIndex(col => col.attr === colAdd);
        if (indexCol > -1) {
          stateCols[indexCol].visible = true;
        }
        stateCols.sort((a: OColumn, b: OColumn) => visibleColArray.indexOf(a.attr) - visibleColArray.indexOf(b.attr));
      });


      // Find values in original-visible-columns in localstorage that they arent in this.visibleColArray
      // in this case you have to delete this column to this.visibleColArray
      const colToDeleteInVisibleCol = Util.differenceArrays(originalVisibleColArray, visibleColArray);
      if (colToDeleteInVisibleCol.length > 0) {
        stateCols = stateCols.filter(col => colToDeleteInVisibleCol.indexOf(col.attr) === -1);
      }

      //If the columns in originalVisibleColArray has changed the sorting
      const changeSortVisibleColumns = JSON.stringify(visibleColArray) !== JSON.stringify(originalVisibleColArray);
      if (changeSortVisibleColumns && visibleColArray.length === originalVisibleColArray.length) {
        visibleColArray.forEach((col, toIndex) => {
          const fromIndexToChange = stateCols.findIndex(stateCol => stateCol.attr === col);
          moveItemInArray(stateCols, fromIndexToChange, toIndex);
        });

      }
    }
    return stateCols;
  }

  parseSortColumns() {
    const sortColumnsParam = this.state.sortColumns || this.sortColumns;
    this.sortColArray = ServiceUtils.parseSortColumns(sortColumnsParam);

    // checking the original sort columns with the sort columns in initial configuration in local storage
    if (this.state.sortColumns && this.state.initialConfiguration.sortColumns) {

      const initialConfigSortColumnsArray = ServiceUtils.parseSortColumns(this.state.initialConfiguration.sortColumns);
      const originalSortColumnsArray = ServiceUtils.parseSortColumns(this.sortColumns);
      // Find values in visible-columns that they arent in original-visible-columns in localstorage
      // in this case you have to add this column to this.visibleColArray
      const colToAddInVisibleCol = Util.differenceArrays(originalSortColumnsArray, initialConfigSortColumnsArray);
      if (colToAddInVisibleCol.length > 0) {
        colToAddInVisibleCol.forEach(colAdd => {
          this.sortColArray.push(colAdd);
        });
      }

      const colToDelInVisibleCol = Util.differenceArrays(initialConfigSortColumnsArray, originalSortColumnsArray);
      if (colToDelInVisibleCol.length > 0) {
        colToDelInVisibleCol.forEach((colDel) => {
          this.sortColArray.forEach((col, i) => {
            if (col.columnName === colDel.columnName) {
              this.sortColArray.splice(i, 1);
            }
          });
        });
      }
    }

    // ensuring column existence and checking its orderable state
    for (let i = this.sortColArray.length - 1; i >= 0; i--) {
      const colName = this.sortColArray[i].columnName;
      const oCol = this.getOColumn(colName);
      if (!Util.isDefined(oCol) || !oCol.orderable) {
        this.sortColArray.splice(i, 1);
      }
    }

  }

  protected ensureColumnsOrder() {

    let columnsOrder = [];
    if (this.state.columnsDisplay) {
      columnsOrder = this.state.columnsDisplay.map(item => item.attr);
    } else {
      columnsOrder = this.colArray.filter(attr => this.visibleColArray.indexOf(attr) === -1);
      columnsOrder.push(...this.visibleColArray);
    }

    this._oTableOptions.columns.sort((a: OColumn, b: OColumn) => {
      if (columnsOrder.indexOf(a.attr) === -1) {
        // if it is not in local storage because it is new, keep order
        return 0;
      } else {
        return columnsOrder.indexOf(a.attr) - columnsOrder.indexOf(b.attr);
      }
    });


  }

  initializeParams(): void {
    // If visible-columns is not present then visible-columns is all columns
    if (!this.visibleColumns) {
      this.visibleColumns = this.columns;
    }
    if (this.colArray.length) {
      this.colArray.forEach((x: string) => this.registerColumn(x));
      this.ensureColumnsOrder();
    }
    // Initialize quickFilter
    this._oTableOptions.filter = this.quickFilter;

    if (this.state.currentPage) {
      this.currentPage = this.state.currentPage;
    }

    // Initialize paginator
    if (!this.paginator && this.paginationControls) {
      this.paginator = new OBaseTablePaginator();
      this.paginator.pageSize = this.queryRows;
      this.paginator.pageIndex = this.currentPage;
      this.paginator.showFirstLastButtons = this.showPaginatorFirstLastButtons;
    }

    if (!Util.isDefined(this.selectAllCheckboxVisible)) {
      this._oTableOptions.selectColumn.visible = !!this.state.selectColumnVisible;
    } else {
      // checking the original selectAllCheckboxVisible with select-column-visible in initial configuration in local storage
      if (Util.isDefined(this.state.initialConfiguration.selectColumnVisible)
        && this.selectAllCheckboxVisible === this.state.initialConfiguration.selectColumnVisible) {
        this._oTableOptions.selectColumn.visible = !!this.state.selectColumnVisible;
      } else {
        this._oTableOptions.selectColumn.visible = this.selectAllCheckboxVisible;
      }
    }

    //Initialize show filter by column icon
    this.isColumnFiltersActive = this.filterColumnActiveByDefault;

    this.selection = new SelectionModel<Element>(this.isSelectionModeMultiple(), []);

    this.initializeCheckboxColumn();

    if (this.storeState) {
      // if query-rows in initial configuration is equals to original query-rows input
      // query_rows will be the value in local storage
      if (Util.isDefined(this.state.queryRows) && Util.isDefined(this.state.initialConfiguration.queryRows)
        && this.state.initialConfiguration.queryRows === this.originalQueryRows) {
        this.queryRows = this.state.queryRows;
      }
    }

  }
  updateStateExpandedColumn() {
    if (!this.tableRowExpandable || !this.tableRowExpandable.expandableColumnVisible) { return; }
    if (this._oTableOptions.visibleColumns[0] === Codes.NAME_COLUMN_SELECT && this._oTableOptions.visibleColumns[1] !== Codes.NAME_COLUMN_EXPANDABLE) {
      this._oTableOptions.visibleColumns = [this._oTableOptions.visibleColumns[0]].concat(Codes.NAME_COLUMN_EXPANDABLE, this._oTableOptions.visibleColumns.splice(1));
    } else if (this._oTableOptions.visibleColumns[0] !== Codes.NAME_COLUMN_EXPANDABLE) {
      this._oTableOptions.visibleColumns.unshift(Codes.NAME_COLUMN_EXPANDABLE);
    }
  }

  registerTabListener() {
    // When table is contained into tab component, it is necessary to init table component when attached to DOM.
    this.tabGroupChangeSubscription = this.tabGroupContainer.selectedTabChange.subscribe((evt) => {
      let interval;
      const timerCallback = (tab: MatTab) => {
        if (tab && tab.content.isAttached) {
          clearInterval(interval);
          if (tab === this.tabContainer) {
            this.insideTabBugWorkaround();
            if (this.pendingQuery) {
              this.queryData(this.pendingQueryFilter);
            }
            this.checkViewportSize();
          }
        }
      };
      interval = setInterval(() => { timerCallback(evt.tab); }, 100);
    });
  }

  protected insideTabBugWorkaround() {
    this.refreshSortHeaders();
  }

  registerSortListener() {
    if (Util.isDefined(this.sort)) {
      this.sortSubscription?.unsubscribe();
      this.sortSubscription = this.sort.oSortChange.subscribe(this.onSortChange.bind(this));
      this.sort.setMultipleSort(this.multipleSort);
    }


  }

  public updateSortingSubject(value: boolean) {
    /* the loadingSortingSubject not refresh in the template
    because change detection not working with virtual scrolling */
    const ngZone = this.injector.get(NgZone);
    if (ngZone) {
      ngZone.run(() => this.loadingSortingSubject.next(value)
      );
    } else {
      this.loadingSortingSubject.next(value);
      if (this.cd && !(this.cd as ViewRef).destroyed) {
        this.cd.detectChanges();
      }
    }
  }

  protected onSortChange(sortArray: any[]) {
    this.sortColArray = [];
    sortArray.forEach((sort) => {
      if (sort.direction !== '') {
        this.sortColArray.push({
          columnName: sort.id,
          ascendent: sort.direction === Codes.ASC_SORT
        });
      }
    });
    if (this.pageable) {
      this.reloadData();
    } else {
      this.updateSortingSubject(true);
    }
  }

  setDatasource() {
    //Deleted previous instance and subscribers
    delete this.dataSource;
    if (this.onRenderedDataChange) this.onRenderedDataChange.unsubscribe();

    const dataSourceService = this.injector.get(OTableDataSourceService);
    this.dataSource = dataSourceService.getInstance(this);
    this.registerDataSourceListeners();
  }

  protected registerDataSourceListeners() {
    this.onRenderedDataChange = this.dataSource.onRenderedDataChange.subscribe(() => {
      this.stopEdition();
      this.checkSelectedItemData();
      if (!this.pageable) {
        setTimeout(() => {
          this.updateSortingSubject(false);
          if (this.cd && !(this.cd as ViewRef).destroyed) {
            this.cd.detectChanges();
          }
        }, 500);
      }
    });
  }

  public getExpandedRowContainerClass(rowIndex: number): string {
    return OTableComponent.EXPANDED_ROW_CONTAINER_CLASS + rowIndex;
  }

  public getExpandableItems(): any[] {
    return this.expandableItem.selected;
  }

  /**
   * Allow to expand or collapse the expandable row.
   * @param item
   * @param rowIndex
   * @param event
   */
  public toogleRowExpandable(item: any, rowIndex: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    this.expandableItem.toggle(item);

    if (this.portalHost[rowIndex]) {
      this.portalHost[rowIndex].detach();
    }

    if (this.getStateExpand(item) === 'collapsed') {
      const eventTableRowExpandableChange = this.emitTableRowExpandableChangeEvent(item, rowIndex);
      this.tableRowExpandable.onCollapsed.emit(eventTableRowExpandableChange);
    } else {
      this.portalHost[rowIndex] = new DomPortalOutlet(
        this.elRef.nativeElement.querySelector('.' + this.getExpandedRowContainerClass(rowIndex)),
        null,
        this.appRef,
        this.injector
      );

      const templatePortal = new TemplatePortal(this.tableRowExpandable.templateRef, this._viewContainerRef, { $implicit: item });
      this.portalHost[rowIndex].attachTemplatePortal(templatePortal);
      const eventTableRowExpandableChange = this.emitTableRowExpandableChangeEvent(item, rowIndex);
      this.tableRowExpandable.onExpanded.emit(eventTableRowExpandableChange);
    }
  }

  private emitTableRowExpandableChangeEvent(data, rowIndex) {
    const event = new OTableRowExpandedChange();
    event.rowIndex = rowIndex;
    event.data = data;

    return event;
  }

  public isExpanded(data: any): boolean {
    return this.expandableItem.isSelected(data);
  }

  public getStateExpand(row) {
    return this.isExpanded(row) ? 'expanded' : 'collapsed';
  }

  public isColumnExpandable(): boolean {
    return (Util.isDefined(this.tableRowExpandable) && Util.isDefined(this._oTableOptions.expandableColumn)) ? this._oTableOptions.expandableColumn.visible : false;
  }

  get hasExpandedRow(): boolean {
    return Util.isDefined(this.tableRowExpandable);
  }

  public hasInsertableRow(): boolean {
    return Util.isDefined(this.oTableInsertableRowComponent);
  }

  public getNumVisibleColumns(): number {
    return this.oTableOptions.visibleColumns.length;
  }

  /**
   * This method manages the call to the service
   * @param filter
   * @param ovrrArgs
   */
  queryData(filter?: any, ovrrArgs?: OQueryDataArgs) {
    // If tab exists and is not active then wait for queryData
    if (this.isInsideInactiveTab()) {
      this.pendingQuery = true;
      this.pendingQueryFilter = filter;
      return;
    }
    this.pendingQuery = false;
    this.pendingQueryFilter = undefined;

    this.queryCellRenderers().subscribe(() => {
      super.queryData(filter, ovrrArgs);
    });
  }

  protected isInsideInactiveTab(): boolean {
    let result: boolean = false;
    if (this.tabContainer && this.tabGroupContainer) {
      result = !(this.tabContainer.isActive || (this.tabGroupContainer.selectedIndex === this.tabContainer.position));
    }
    return result;
  }

  getComponentFilter(existingFilter: any = {}): any {
    let filter = existingFilter;
    if (this.pageable) {
      if (Object.keys(filter).length > 0) {
        const parentItemExpr = FilterExpressionUtils.buildExpressionFromObject(filter);
        filter = {};
        filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] = parentItemExpr;
      }
      const beColFilter = this.getColumnFiltersExpression();
      // Add column filters basic expression to current filter
      if (beColFilter && !Util.isDefined(filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY])) {
        filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] = beColFilter;
      } else if (beColFilter) {
        filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY] =
          FilterExpressionUtils.buildComplexExpression(filter[FilterExpressionUtils.FILTER_EXPRESSION_KEY], beColFilter, FilterExpressionUtils.OP_AND);
      }
    }

    return super.getComponentFilter(filter);
  }

  protected getQuickFilterExpression(): Expression {
    if (Util.isDefined(this.oTableQuickFilterComponent) && this.pageable) {
      return this.oTableQuickFilterComponent.filterExpression;
    }
    return undefined;
  }

  getColumnFiltersExpression(): Expression {
    // Apply column filters
    const columnFilters: OColumnValueFilter[] = this.dataSource.getColumnValueFilters();
    const beColumnFilters: Array<Expression> = [];
    columnFilters.forEach(colFilter => {
      // Prepare basic expressions
      switch (colFilter.operator) {
        case ColumnValueFilterOperator.IN:
          if (Util.isArray(colFilter.values)) {
            const besIn: Array<Expression> = colFilter.values.map(value => FilterExpressionUtils.buildExpressionEquals(colFilter.attr, value));
            let beIn: Expression = besIn.pop();
            besIn.forEach(be => {
              beIn = FilterExpressionUtils.buildComplexExpression(beIn, be, FilterExpressionUtils.OP_OR);
            });
            beColumnFilters.push(beIn);
          }
          break;
        case ColumnValueFilterOperator.BETWEEN:
          if (Util.isArray(colFilter.values) && colFilter.values.length === 2) {
            const beFrom = FilterExpressionUtils.buildExpressionMoreEqual(colFilter.attr, colFilter.values[0]);
            const beTo = FilterExpressionUtils.buildExpressionLessEqual(colFilter.attr, colFilter.values[1]);
            beColumnFilters.push(FilterExpressionUtils.buildComplexExpression(beFrom, beTo, FilterExpressionUtils.OP_AND));
          }
          break;
        case ColumnValueFilterOperator.EQUAL:
          beColumnFilters.push(FilterExpressionUtils.buildExpressionLike(colFilter.attr, colFilter.values));
          break;
        case ColumnValueFilterOperator.LESS_EQUAL:
          beColumnFilters.push(FilterExpressionUtils.buildExpressionLessEqual(colFilter.attr, colFilter.values));
          break;
        case ColumnValueFilterOperator.MORE_EQUAL:
          beColumnFilters.push(FilterExpressionUtils.buildExpressionMoreEqual(colFilter.attr, colFilter.values));
          break;
      }

    });
    // Build complete column filters basic expression
    let beColFilter: Expression = beColumnFilters.pop();
    beColumnFilters.forEach(be => {
      beColFilter = FilterExpressionUtils.buildComplexExpression(beColFilter, be, FilterExpressionUtils.OP_AND);
    });
    return beColFilter;
  }

  updatePaginationInfo(queryRes: any) {
    super.updatePaginationInfo(queryRes);
  }

  initViewPort(data: any[]) {

    if (this.virtualScrollViewport && data) {
      const headerElRef = this.elRef.nativeElement.querySelector(headerSelector);
      const footerElRef = this.elRef.nativeElement.querySelector(footerSelector);
      const rowElRef = this.elRef.nativeElement.querySelector(rowSelector);

      const headerHeight = headerElRef ? headerElRef.offsetHeight : 0;
      const footerHeight = footerElRef ? footerElRef.offsetHeight : 0;
      const rowHeight = rowElRef ? rowElRef.offsetHeight : OTableComponent.DEFAULT_ROW_HEIGHT;

      // set config viewport
      this.scrollStrategy.setConfig(rowHeight, headerHeight, footerHeight);
      if (this.previousRendererData !== this.dataSource.renderedData) {
        this.scrollStrategy.dataLength = data.length;
      }
    }
  }

  protected setData(data: any, sqlTypes: any) {
    this.daoTable.sqlTypesChange.next(sqlTypes);
    this.daoTable.setDataArray(data);
    if (this.pageable) {
      ObservableWrapper.callEmit(this.onPaginatedDataLoaded, data);
    }
    ObservableWrapper.callEmit(this.onDataLoaded, this.daoTable.data);
  }

  protected canSetStaticData(staticData): boolean {
    return super.canSetStaticData(staticData) && Util.isDefined(this.daoTable);
  }

  showDialogError(error: string, errorOptional?: string) {
    if (Util.isDefined(error) && !Util.isObject(error)) {
      this.dialogService.alert('ERROR', error);
    } else {
      this.dialogService.alert('ERROR', errorOptional);
    }
  }

  projectContentChanged() {
    this.loadingScrollSubject.next(false);

    this.initViewPort(this.dataSource.renderedData);

    if (this.previousRendererData !== this.dataSource.renderedData) {
      this.previousRendererData = this.dataSource.renderedData;
      ObservableWrapper.callEmit(this.onContentChange, this.dataSource.renderedData);
    }

    if (this.state.selection && this.dataSource.renderedData.length > 0 && this.getSelectedItems().length === 0) {
      this.checkSelectedItemData();
    }
  }

  getAttributesValuesToQuery(): Array<string> {
    const columns = super.getAttributesValuesToQuery();
    if (this.avoidQueryColumns.length > 0) {
      for (let i = columns.length - 1; i >= 0; i--) {
        const col = columns[i];
        if (this.avoidQueryColumns.indexOf(col) !== -1) {
          columns.splice(i, 1);
        }
      }
    }
    return columns;
  }

  getQueryArguments(filter: object, ovrrArgs?: OQueryDataArgs): Array<any> {
    const queryArguments = super.getQueryArguments(filter, ovrrArgs);
    Object.assign(queryArguments[3], this.getSqlTypesForFilter(queryArguments[1]));
    Object.assign(queryArguments[3], ovrrArgs ? ovrrArgs.sqltypes || {} : {});
    if (this.pageable) {
      queryArguments[5] = this.paginator.isShowingAllRows(queryArguments[5]) ? this.state.totalQueryRecordsNumber : queryArguments[5];
      queryArguments[6] = this.sortColArray;
    }
    return queryArguments;
  }

  getSqlTypesForFilter(filter): object {
    const allSqlTypes = this.getSqlTypes();
    const sqlTypes = {};
    Object.keys(allSqlTypes).forEach(key => {
      if (filter.indexOf(key) !== -1 && allSqlTypes[key] !== SQLTypes.OTHER) {
        sqlTypes[key] = allSqlTypes[key];
      }
    });
    return sqlTypes;
  }

  onExportButtonClicked() {
    if (this.oTableMenu) {
      this.oTableMenu.onExportButtonClicked();
    }
  }

  onChangeColumnsVisibilityClicked() {
    if (this.oTableMenu) {
      this.oTableMenu.onChangeColumnsVisibilityClicked();
    }
  }

  onMatTableContentChanged() {
    //
  }

  /**
   * Triggers navigation to new item insertion
   */
  add() {
    if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_INSERT)) {
      return;
    }
    super.insertDetail();
  }

  /**
   * Removes selected rows
   * @param [clearSelectedItems]
   */
  remove(clearSelectedItems: boolean = false) {
    if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_DELETE)) {
      return;
    }
    const selectedItems = this.getSelectedItems();
    if (selectedItems.length === 0) {
      return;
    }

    this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DELETE').then(res => {
      if (res === true) {
        if (this.dataService && (this.deleteMethod in this.dataService) && this.entity && (this.keysArray.length > 0)) {
          const filters = ServiceUtils.getArrayProperties(selectedItems, this.keysArray);
          const sqlTypesArg = this.getSqlTypesOfKeys();
          this.daoTable.removeQuery(filters, sqlTypesArg).subscribe(
            {
              next: (v) => {
                ObservableWrapper.callEmit(this.onRowDeleted, selectedItems);
              },
              error: (e) => {
                this.showDialogError(e, 'MESSAGES.ERROR_DELETE');
              },
              complete: () => {
                // Ensuring that the deleted items will not longer be part of the selectionModel
                selectedItems.forEach(item => {
                  this.selection.deselect(item);
                });
                if (this.formLayoutManager) {
                  this.formLayoutManager.closeDetails(filters, { exitWithoutConfirmation: true });
                }
                this.reloadData();
              }
            });

        } else {
          this.deleteLocalItems();
        }
      } else if (clearSelectedItems) {
        this.clearSelection();
      }
    });

  }

  /**
   * Refreshs table component
   */
  refresh() {
    this.reloadData();
  }

  /**
   * Shows and select all checkbox
   */
  showAndSelectAllCheckbox() {
    if (this.isSelectionModeMultiple()) {
      if (this.selectAllCheckbox) {
        this._oTableOptions.selectColumn.visible = true;
      }
      this.initializeCheckboxColumn();
      this.selectAll();
    }
  }

  reloadPaginatedDataFromStart(clearSelectedItems: boolean = true) {
    if (this.pageable) {
      // Initialize page index
      this.currentPage = 0;
      this.reloadData(clearSelectedItems);
    }
  }

  /**
   * Reloads data
   */
  reloadData(clearSelectedItems: boolean = true) {
    if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_REFRESH)) {
      return;
    }
    this.componentStateService.refreshSelection();
    if (clearSelectedItems) {
      this.clearSelection();
    }
    this.finishQuerySubscription = false;
    this.pendingQuery = true;
    let queryArgs: OQueryDataArgs;
    if (this.pageable) {
      queryArgs = {
        offset: this.currentPage * this.queryRows,
        length: this.queryRows
      };
    }
    this.stopEdition(false);
    this.queryData(void 0, queryArgs);
  }

  handleClick(row: any, column: OColumn, rowIndex: number, cellRef: ElementRef, event: MouseEvent) {
    this.clickTimer = setTimeout(() => {
      if (!this.clickPrevent) {
        if (this.oenabled && column.editor
          && (this.detailMode !== Codes.DETAIL_MODE_CLICK)
          && (this.editionMode === Codes.EDITION_MODE_CLICK)) {
          this.activateColumnEdition(column, row, cellRef);
        } else {
          this.doHandleClick(row, column.attr, rowIndex, event);
        }
      }
      this.clickPrevent = false;
    }, this.clickDelay);

  }

  doHandleClick(row: any, column: string, rowIndex: number, $event: MouseEvent) {
    if (!this.oenabled) {
      return;
    }
    if ((this.detailMode === Codes.DETAIL_MODE_CLICK)) {
      this.onClick.emit({ row: row, rowIndex: rowIndex, mouseEvent: $event, columnName: column, cell: row[column] });
      this.saveDataNavigationInLocalStorage();
      this.clearSelection();
      this.selectedRow(row);
      this.viewDetail(row);
      return;
    }
    if (this.isSelectionModeMultiple() && ($event.ctrlKey || $event.metaKey)) {
      // TODO: test $event.metaKey on MAC
      this.selectedRow(row);
      this.onClick.emit({ row: row, rowIndex: rowIndex, mouseEvent: $event, columnName: column, cell: row[column] });
    } else if (this.isSelectionModeMultiple() && $event.shiftKey) {
      this.handleMultipleSelection(row);
    } else if (!this.isSelectionModeNone()) {
      const selectedItems = this.getSelectedItems();
      if (this.isRowSelected(row) && selectedItems.length === 1 && this.editionEnabled) {
        return;
      } else {
        this.clearSelectionAndEditing();
      }
      this.selectedRow(row);
      this.onClick.emit({ row: row, rowIndex: rowIndex, mouseEvent: $event, columnName: column, cell: row[column] });
    }
  }

  handleMultipleSelection(item: any) {
    if (this.selection.selected.length > 0) {
      const first = this.dataSource.renderedData.indexOf(this.selection.selected[0]);
      const last = this.dataSource.renderedData.indexOf(item);
      const indexFrom = Math.min(first, last);
      const indexTo = Math.max(first, last);
      this.clearSelection();
      this.dataSource.renderedData.slice(indexFrom, indexTo + 1).forEach(e => this.selectedRow(e));
      ObservableWrapper.callEmit(this.onClick, this.selection.selected);
    }
  }

  protected saveDataNavigationInLocalStorage() {
    super.saveDataNavigationInLocalStorage();
    this.storePaginationState = true;
  }

  handleDoubleClick(row: any, column: OColumn, rowIndex: number, cellRef: ElementRef, $event: MouseEvent) {
    clearTimeout(this.clickTimer);
    this.clickPrevent = true;

    if (this.oenabled && column.editor
      && (!Codes.isDoubleClickMode(this.detailMode))
      && (Codes.isDoubleClickMode(this.editionMode))) {
      this.activateColumnEdition(column, row, cellRef);
    } else {
      this.onDoubleClick.emit({ row: row, rowIndex: rowIndex, mouseEvent: $event, columnName: column.attr, cell: row[column.attr] });
      if (this.oenabled && Codes.isDoubleClickMode(this.detailMode)) {
        this.saveDataNavigationInLocalStorage();
        this.viewDetail(row);
      }
    }
  }
  get editionEnabled(): boolean {
    return this._oTableOptions.columns.some(item => item.editing);
  }

  handleDOMClick(event) {
    if (this._oTableOptions.selectColumn.visible) {
      return;
    }

    if (this.editionEnabled) {
      return;
    }

    const overlayContainer = document.body.getElementsByClassName('cdk-overlay-container')[0];
    if (overlayContainer && overlayContainer.contains(event.target)) {
      return;
    }

    const tableContainer = this.elRef.nativeElement.querySelector('.o-table-container');
    const tableContent = this.elRef.nativeElement.querySelector('.o-table-container table.mat-table');
    if (tableContainer && tableContent && tableContainer.contains(event.target) && !tableContent.contains(event.target)) {
      this.clearSelection();
    }
  }

  protected activateColumnEdition(column: OColumn, row: any, cellRef: any) {
    if (cellRef && column.editing && this.editingCell === cellRef) {
      return;
    }
    const columnPermissions: OPermissions = this.getOColumnPermissions(column.attr);
    if (columnPermissions.enabled === false) {
      console.warn(`${column.attr} edition not allowed due to permissions`);
      return;
    }

    this.clearSelectionAndEditing();
    this.selectedRow(row);
    this.editingCell = cellRef;
    const rowData = {};
    this.keysArray.forEach((key) => {
      rowData[key] = row[key];
    });
    rowData[column.attr] = row[column.attr];
    this.editingRow = row;
    column.editing = true;
    column.editor.startEdition(rowData);
  }

  updateCellData(column: OColumn, data: any, saveChanges: boolean) {
    if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_UPDATE)) {
      const res = new Observable(innerObserver => {
        innerObserver.error();
      });
      return res;
    }
    column.editing = false;
    if (saveChanges && this.editingRow !== undefined) {
      Object.assign(this.editingRow, data);
    }
    this.stopEdition();
    if (saveChanges && column.editor.updateRecordOnEdit) {
      const toUpdate = {};
      toUpdate[column.attr] = data[column.attr];
      const kv = this.extractKeysFromRecord(data);
      return this.updateRecord(kv, toUpdate);
    }
    return undefined;
  }

  protected getKeysValues(): any[] {
    const data = this.getAllValues();
    return data.map((row) => {
      const obj = {};
      this.keysArray.forEach((key) => {
        if (row[key] !== undefined) {
          obj[key] = row[key];
        }
      });

      return obj;
    });
  }

  onShowsSelects() {
    if (this.oTableMenu) {
      this.oTableMenu.onShowsSelects();
    }
  }

  initializeCheckboxColumn() {
    // Initializing row selection listener
    if (!this.selectionChangeSubscription && this._oTableOptions.selectColumn.visible) {
      this.selectionChangeSubscription = this.selection.changed.subscribe((selectionData: SelectionChange<any>) => {
        if (this.triggerSelectionEvents && selectionData) {
          if (selectionData.added.length > 0) {
            ObservableWrapper.callEmit(this.onRowSelected, selectionData.added);
          }
          if (selectionData.removed.length > 0) {
            ObservableWrapper.callEmit(this.onRowDeselected, selectionData.removed);
          }
        }
      });
    }
    this.updateSelectionColumnState();
  }

  protected updateSelectionColumnState() {
    if (!this._oTableOptions.selectColumn.visible) {
      this.clearSelection();
    }
    if (this._oTableOptions.visibleColumns && this._oTableOptions.selectColumn.visible
      && this._oTableOptions.visibleColumns[0] !== Codes.NAME_COLUMN_SELECT) {
      this._oTableOptions.visibleColumns.unshift(Codes.NAME_COLUMN_SELECT);
    } else if (this._oTableOptions.visibleColumns && !this._oTableOptions.selectColumn.visible
      && this._oTableOptions.visibleColumns[0] === Codes.NAME_COLUMN_SELECT) {
      this._oTableOptions.visibleColumns.shift();
    }
    this.updateStateExpandedColumn();
  }

  public getNumRowSelectedInCurrentData(): number {
    return this.dataSource ? this.dataSource.renderedData.filter(x => !this.isDisableCheckbox(x) && this.isRowSelected(x)).length : 0;
  }

  public isAllSelected(): boolean {
    const numSelected = this.getNumRowSelectedInCurrentData();
    const numRows = this.dataSource ? this.dataSource.renderedData.length : 0;
    return numSelected > 0 && numSelected === numRows;
  }

  public isIndeterminate(): boolean {
    const numSelected = this.getNumRowSelectedInCurrentData();
    const numRows = this.dataSource ? this.dataSource.renderedData.length : 0;
    return numSelected > 0 && numRows > 0 && numSelected !== numRows;
  }

  public masterToggle(event: MatCheckboxChange): void {
    event.checked ? this.selectAll() : this.clearSelection();
  }

  public selectAll(): void {
    this.dataSource.renderedData.forEach(row => this.setSelected(row));
  }

  public selectionCheckboxToggle(event: MatCheckboxChange, row: any): void {
    if (this.isSelectionModeSingle()) {
      this.clearSelection();
    }
    event.checked ? this.selectedRow(row) : this.selection.deselect(row);
    this.state.selection = this.selection.selected;
  }

  public selectedRow(row: any): void {
    this.setSelected(row);
    this.cd.detectChanges();
  }

  public clearSelection(): void {
    if (Util.isDefined(this.selection)) {
      this.selection.clear();
    }
    if (Util.isDefined(this.state)) {
      this.state.selection = [];
    }
  }

  public setSelected(item: any): void {
    if (this.isDisableCheckbox(item)) {
      return;
    }
    if (Util.isDefined(item) && !this.isRowSelected(item)) {
      this.selection.select(item);
    }
  }

  get showDeleteButton(): boolean {
    return this.deleteButton;
  }

  getTrackByFunction(): (index: number, item: any) => string {
    const self = this;

    return (index: number, item: any) => {

      let itemId: string = '';

      if (this.isGroup(index, item)) {
        itemId += item.column;
      } else {
        const keysLenght = self.keysArray.length;
        self.keysArray.forEach((key: string, idx: number) => {
          const suffix = idx < (keysLenght - 1) ? ';' : '';
          itemId += item[key] + suffix;
        });
      }

      const hasAsyncAndVisibleCols = this.asyncLoadColumns.some(c => this._oTableOptions.visibleColumns.includes(c));
      if (self.asyncLoadColumns.length && hasAsyncAndVisibleCols && !self.finishQuerySubscription) {
        self.queryRowAsyncData(index, item);
        if (self.paginator && index === (self.paginator.pageSize - 1)) {
          self.finishQuerySubscription = true;
        }
        return itemId;
      } else {
        return itemId;
      }
    };
  }

  queryRowAsyncData(rowIndex: number, rowData: any) {
    const kv = ServiceUtils.getObjectProperties(rowData, this.keysArray);
    // Repeating checking of visible column
    const av = this.asyncLoadColumns.filter(c => this._oTableOptions.visibleColumns.indexOf(c) !== -1);
    if (av.length === 0) {
      // Skipping query if there are not visible asyncron columns
      return;
    }
    const columnQueryArgs = [kv, av, this.entity, undefined, undefined, undefined, undefined];
    const queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
    if (this.dataService && (queryMethodName in this.dataService) && this.entity) {
      if (this.asyncLoadSubscriptions[rowIndex]) {
        this.asyncLoadSubscriptions[rowIndex].unsubscribe();
      }
      this.asyncLoadSubscriptions[rowIndex] = this.dataService[queryMethodName]
        .apply(this.dataService, columnQueryArgs)
        .subscribe((res: ServiceResponse) => {
          if (res.isSuccessful()) {
            let data;
            if (Util.isArray(res.data) && res.data.length === 1) {
              data = res.data[0];
            } else if (Util.isObject(res.data)) {
              data = res.data;
            }
            this.daoTable.setAsynchronousColumn(data, rowData);
            this.cd.detectChanges();
          }
        });
    }
  }


  /**
   * Returns the current page table data.
   * @returns
   */
  getValue() {
    return this.dataSource.getCurrentData();
  }


  /**
   * Gets all values
   * @returns
   */
  getAllValues() {
    return this.dataSource.getCurrentAllData();
  }


  /**
   * Gets all rendered values
   * @returns
   */
  getAllRenderedValues() {
    return this.dataSource.getAllRendererData();
  }


  /**
   * Returns the current page table renderer data.
   * @returns
   */
  getRenderedValue() {
    return this.dataSource.getCurrentRendererData();
  }


  /**
   * Gets sql types from data source and table columns
   * @returns
   */
  getSqlTypes() {
    const allSqlTypes = Util.isDefined(this.dataSource.sqlTypes) ? this.dataSource.sqlTypes : {};
    this._oTableOptions.columns.forEach((col: OColumn) => {
      if (col.sqlType) {
        allSqlTypes[col.attr] = col.sqlType;
      }
    });
    return allSqlTypes;
  }

  setOTableColumnsFilter(tableColumnsFilter: OTableColumnsFilterComponent) {
    this.oTableColumnsFilterComponent = tableColumnsFilter;
  }

  get filterColumns(): OFilterColumn[] {
    if (this.state.initialConfiguration.filterColumns === this.originalFilterColumns
      && this.state.filterColumns) {
      return this.state.filterColumns;
    }
    return this.originalFilterColumns;
  }

  get originalFilterColumns(): Array<OFilterColumn> {
    let sortColumnsFilter = [];
    if (this.oTableColumnsFilterComponent) {
      sortColumnsFilter = this.oTableColumnsFilterComponent.columnsArray;
    }
    return sortColumnsFilter;
  }

  get originalGroupedColumnsArray(): Array<string> {
    return Util.parseArray(this.groupedColumns, true);
  }

  getStoredColumnsFilters() {
    return this.state.storedFilters;
  }

  getStoredGroupedColumns() {
    return this.state.storedConfigurations;
  }

  onFilterByColumnClicked() {
    if (this.oTableMenu) {
      this.oTableMenu.onFilterByColumnClicked();
    }
  }

  onStoreFilterClicked() {
    if (this.oTableMenu) {
      this.oTableMenu.onStoreFilterClicked();
    }
  }

  onLoadFilterClicked() {
    if (this.oTableMenu) {
      this.oTableMenu.onLoadFilterClicked();
    }
  }

  onClearFilterClicked() {
    if (this.oTableMenu) {
      this.oTableMenu.onClearFilterClicked();
    }
  }

  /**
   * Clear all filters(column filter, quickfilter and filter builder) and reload data
   * @param [triggerDatasourceUpdate]
   */
  clearFilters(triggerDatasourceUpdate: boolean = true): void {

    this.dataSource.clearColumnFilters(triggerDatasourceUpdate);
    if (this.oTableMenu && this.oTableMenu.columnFilterOption) {
      this.oTableMenu.columnFilterOption.setActive(this.isColumnFiltersActive);
    }
    this.onFilterByColumnChange.emit();
    if (this.oTableQuickFilterComponent) {
      this.oTableQuickFilterComponent.setValue(void 0);
    }

    if (this.filterBuilder) {
      this.filterBuilder.clearFilter();
      this.filterBuilder.triggerReload();
    }

  }

  clearColumnFilter(attr: string, triggerDatasourceUpdate: boolean = true): void {
    this.dataSource.clearColumnFilter(attr, triggerDatasourceUpdate);
    this.onFilterByColumnChange.emit();
    this.reloadPaginatedDataFromStart(false);
  }

  filterByColumn(columnValueFilter: OColumnValueFilter) {
    this.dataSource.addColumnFilter(columnValueFilter);
    this.onFilterByColumnChange.emit();
    if (this.pageable) {
      this.reloadPaginatedDataFromStart(false);
    }
  }

  clearColumnFilters(triggerDatasourceUpdate: boolean = true, columnsAttr?: string[]): void {
    this.dataSource.clearColumnFilters(triggerDatasourceUpdate, columnsAttr);
    this.onFilterByColumnChange.emit();
    this.reloadPaginatedDataFromStart(false);
  }

  isColumnFilterable(column: OColumn): boolean {
    return Util.isDefined(this.oTableColumnsFilterComponent) ? this.oTableColumnsFilterComponent.isColumnFilterable(column.attr) : this.isSearcheableColumn(column);
  }

  isSearcheableColumn(column: OColumn): boolean {
    return this.searcheableColumns.includes(column.attr);
  }
  isColumnFilterActive(column: OColumn): boolean {
    return this.isColumnFiltersActive && Util.isDefined(this.dataSource.getColumnValueFilterByAttr(column.attr));
  }

  openColumnFilterDialog(column: OColumn, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    const dialogRef = this.dialog.open(OTableFilterByColumnDataDialogComponent, {
      data: {
        previousFilter: this.dataSource.getColumnValueFilterByAttr(column.attr),
        column: column,
        activeSortDirection: this.getSortFilterColumn(column),
        tableData: this.dataSource.getCurrentData(),
        preloadValues: this.oTableColumnsFilterComponent ? this.oTableColumnsFilterComponent.preloadValues : true,
        mode: this.oTableColumnsFilterComponent ? this.oTableColumnsFilterComponent.mode : 'default',
        startView: this.getStartViewFilterColumn(column)
      },
      minWidth: '380px',
      disableClose: true,
      panelClass: ['o-dialog-class', 'o-table-dialog']
    });

    dialogRef.afterClosed().subscribe(result => {
      switch (result) {
        case TableFilterByColumnDialogResult.ACCEPT:
          const columnValueFilter = dialogRef.componentInstance.getColumnValuesFilter();
          this.filterByColumn(columnValueFilter);
          break;
        case TableFilterByColumnDialogResult.CLEAR:
          const col = dialogRef.componentInstance.column;
          this.clearColumnFilter(col.attr);
          break;
      }
    });
    dialogRef.componentInstance.onSortFilterValuesChange.subscribe(sortedFilterableColumn => {
      // guardar en localstorage el cambio
      this.storeFilterColumns(sortedFilterableColumn);
    });
  }

  storeFilterColumns(sortColumnFilter: OFilterColumn) {
    if (this.state.filterColumns) {
      // if exists in state then updated sort value
      const filterColumn = this.filterColumns.find(x => x.attr === sortColumnFilter.attr);
      if (Util.isDefined(filterColumn)) {
        filterColumn.sort = sortColumnFilter.sort;
      } else {
        // else exists in state then added filter column
        this.filterColumns.push(sortColumnFilter);
      }
    }
    this.state.filterColumns = this.filterColumns;
  }

  getStartViewFilterColumn(column: OColumn): string {
    let startView;
    // at first, get state in localstorage
    if (this.state.filterColumns) {
      this.state.filterColumns.forEach((element: OFilterColumn) => {
        if (element.attr === column.attr) {
          startView = element.startView;
        }
      });
    }

    if (!Util.isDefined(startView) && this.oTableColumnsFilterComponent) {
      startView = this.oTableColumnsFilterComponent.getStartViewValueOfFilterColumn(column.attr);
    }

    return startView;
  }

  getSortFilterColumn(column: OColumn): string {
    let sortColumn;
    // at first, get state in localstorage
    if (this.state.filterColumns) {
      const filterCol = this.state.filterColumns.find((element: OFilterColumn) => element.attr === column.attr);
      if (filterCol) {
        sortColumn = filterCol.sort;
      }
    }

    // if not value in localstorage, get sort value in o-table-column-filter-column component
    if (!Util.isDefined(sortColumn) && this.oTableColumnsFilterComponent) {
      sortColumn = this.oTableColumnsFilterComponent.getSortValueOfFilterColumn(column.attr);
    }

    // if either value in o-table-column-filter-column or localstorage, get sort value in sortColArray
    if (!Util.isDefined(sortColumn) && this.sortColArray.find(x => x.columnName === column.attr)) {
      sortColumn = this.isColumnSortActive(column) ? 'asc' : 'desc';
    }

    return sortColumn;
  }

  get disableTableMenuButton(): boolean {
    return !!(this.permissions && this.permissions.menu && this.permissions.menu.enabled === false);
  }

  get showTableMenuButton(): boolean {
    const permissionHidden = !!(this.permissions && this.permissions.menu && this.permissions.menu.visible === false);
    if (permissionHidden) {
      return false;
    }
    const staticOpt = this.selectAllCheckbox || this.exportButton || this.showConfigurationOption || this.columnsVisibilityButton || (this.showFilterOption && this.oTableColumnsFilterComponent !== undefined);
    return staticOpt || this.tableOptions.length > 0;
  }

  setOTableInsertableRow(tableInsertableRow: OTableInsertableRowComponent) {
    const insertPerm: OPermissions = this.getActionPermissions(PermissionsUtils.ACTION_INSERT);
    if (insertPerm.visible) {
      tableInsertableRow.enabled = insertPerm.enabled;
      this.oTableInsertableRowComponent = tableInsertableRow;
      this.showFirstInsertableRow = this.oTableInsertableRowComponent.isFirstRow();
      this.showLastInsertableRow = !this.showFirstInsertableRow;
      this.oTableInsertableRowComponent.initializeEditors();
    }
  }

  clearSelectionAndEditing(clearSelection: boolean = true) {
    if (clearSelection) {
      this.clearSelection();
    }
    this._oTableOptions.columns
      .filter(oColumn => oColumn.editing)
      .forEach(oColumn => {
        oColumn.editing = false;
      });
  }

  protected checkSelectedItemData() {
    this.triggerSelectionEvents = false;
    if (Util.isDefined(this.state.selection) && this.state.selection.length > 0) {
      this.state.selection.forEach(selectedItem => {
        const selectedItemKeys = Object.keys(selectedItem);
        // finding selected item data in the table rendered data
        const foundItem = this.dataSource.renderedData.find(data =>
          selectedItemKeys.every(key => data[key] === selectedItem[key])
        );
        if (foundItem && !this.isRowSelected(foundItem)) {
          this.setSelected(foundItem);
        }
      });
    }
    this.triggerSelectionEvents = true;
  }

  useDetailButton(column: OColumn): boolean {
    return column.type === 'editButtonInRow' || column.type === 'detailButtonInRow';
  }

  onDetailButtonClick(column: OColumn, row: any, event: any) {
    event.preventDefault();
    event.stopPropagation();
    switch (column.type) {
      case 'editButtonInRow':
        this.editDetail(row);
        break;
      case 'detailButtonInRow':
        this.viewDetail(row);
        break;
    }
  }

  getDetailButtonIcon(column: OColumn) {
    let result = '';
    switch (column.type) {
      case 'editButtonInRow':
        result = this.editButtonInRowIcon;
        break;
      case 'detailButtonInRow':
        result = this.detailButtonInRowIcon;
        break;
    }
    return result;
  }

  usePlainRender(column: OColumn, row: any): boolean {
    return !this.useDetailButton(column) && !column.renderer && (!column.editor || (!column.editing || !this.isRowSelected(row)));
  }

  useCellRenderer(column: OColumn, row: any): boolean {
    return column.renderer && (!column.editing || column.editing && !this.isRowSelected(row));
  }

  useCellEditor(column: OColumn, row: any): boolean {
    // TODO Add column.editor instanceof OTableCellEditorBooleanComponent to condition
    if (column.editor && column.editor.autoCommit) {
      return false;
    }
    return column.editor && column.editing && this.isRowSelected(row);
  }

  isSelectionModeMultiple(): boolean {
    return this.selectionMode === Codes.SELECTION_MODE_MULTIPLE;
  }

  isSelectionModeSingle(): boolean {
    return this.selectionMode === Codes.SELECTION_MODE_SINGLE;
  }

  isSelectionModeNone(): boolean {
    return this.selectionMode === Codes.SELECTION_MODE_NONE;
  }

  onChangePage(evt: PageEvent) {
    this.finishQuerySubscription = false;
    if (!this.pageable) {
      this.currentPage = evt.pageIndex;
      return;
    }

    const goingBack = evt.pageIndex < this.currentPage;
    this.currentPage = evt.pageIndex;
    const pageSize = this.paginator.isShowingAllRows(evt.pageSize) ? this.state.totalQueryRecordsNumber : evt.pageSize;

    const oldQueryRows = this.queryRows;
    const changingPageSize = (oldQueryRows !== pageSize);
    this.queryRows = pageSize;
    this.paginator.pageSize = pageSize;

    let newStartRecord: number;
    let queryLength: number;

    if (goingBack || changingPageSize) {
      newStartRecord = (this.currentPage * this.queryRows);
      queryLength = this.queryRows;
    } else {
      newStartRecord = Math.max(this.state.queryRecordOffset, (this.currentPage * this.queryRows));
      const newEndRecord = Math.min(newStartRecord + this.queryRows, this.state.totalQueryRecordsNumber);
      queryLength = this.disablePageSizeCalculation ? this.queryRows : Math.min(this.queryRows, newEndRecord - newStartRecord);
    }

    const queryArgs: OQueryDataArgs = {
      offset: newStartRecord,
      length: queryLength
    };
    this.finishQuerySubscription = false;
    this.queryData(void 0, queryArgs);
  }

  getOColumn(attr: string): OColumn {
    return this._oTableOptions ? this._oTableOptions.columns.find(item => item.name === attr) : undefined;
  }

  insertRecord(recordData: any, sqlTypes?: object): Observable<any> {
    if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_INSERT)) {
      return undefined;
    }
    if (!Util.isDefined(sqlTypes)) {
      const allSqlTypes = this.getSqlTypes();
      sqlTypes = {};
      Object.keys(recordData).forEach(key => {
        sqlTypes[key] = allSqlTypes[key];
      });
    }
    return this.daoTable.insertQuery(recordData, sqlTypes);
  }

  updateRecord(filter: any, updateData: any, sqlTypes?: object): Observable<any> {
    if (!this.checkEnabledActionPermission(PermissionsUtils.ACTION_UPDATE)) {
      return of(this.dataSource.data);
    }
    const sqlTypesArg = sqlTypes || {};
    if (!Util.isDefined(sqlTypes)) {
      const allSqlTypes = this.getSqlTypes();
      Object.keys(filter).forEach(key => {
        sqlTypesArg[key] = allSqlTypes[key];
      });
      Object.keys(updateData).forEach(key => {
        sqlTypesArg[key] = allSqlTypes[key];
      });
    }
    return this.daoTable.updateQuery(filter, updateData, sqlTypesArg);
  }


  /**
   * Gets data table
   * @returns
   */
  getDataArray() {
    return this.daoTable.data;
  }


  /**
   * Sets data table when is static (ONLY IN THIS CASE)
   * @param data
   */
  setDataArray(data: Array<any>) {
    if (this.daoTable) {
      // remote pagination has no sense when using static-data
      this.pageable = false;
      this.staticData = data;
      this.daoTable.usingStaticData = true;
      this.daoTable.setDataArray(this.staticData);
      this.onDataLoaded.emit(this.daoTable.data);
    }
  }

  protected deleteLocalItems() {
    const dataArray = this.getDataArray();
    const selectedItems = this.getSelectedItems();
    selectedItems.forEach((selectedItem: any) => {
      for (let j = dataArray.length - 1; j >= 0; --j) {
        if (Util.equals(selectedItem, dataArray[j])) {
          dataArray.splice(j, 1);
          break;
        }
      }
    });
    this.clearSelection();
    this.setDataArray(dataArray);
  }

  isColumnSortActive(column: OColumn): boolean {
    const found = this.sortColArray.find(sortC => sortC.columnName === column.attr);
    return found !== undefined;
  }

  isColumnDescSortActive(column: OColumn): boolean {
    const found = this.sortColArray.find(sortC => sortC.columnName === column.attr && !sortC.ascendent);
    return found !== undefined;
  }

  hasTabGroupChangeSubscription(): boolean {
    return this.tabGroupChangeSubscription !== undefined;
  }

  isEmpty(value: any): boolean {
    return !Util.isDefined(value) || ((typeof value === 'string') && !value);
  }

  setFiltersConfiguration(storage: OTableComponentStateClass = this.state) {
    /*
      Checking the original filterCaseSensitive with the filterCaseSensitive in initial configuration in local storage
      if filterCaseSensitive in initial configuration is equals to original filterCaseSensitive input
      filterCaseSensitive will be the value in local storage
    */
    if (storage.initialConfiguration.filterCaseSensitive !== this.filterCaseSensitive) {
      this._oTableOptions.filterCaseSensitive = this.filterCaseSensitive;
    } else {
      this._oTableOptions.filterCaseSensitive = storage.hasOwnProperty('filter-case-sensitive') ? storage['filter-case-sensitive'] : this.filterCaseSensitive;
    }

    if (storage.initialConfiguration.filterColumnActiveByDefault !== this.filterColumnActiveByDefault) {
      this.isColumnFiltersActive = this.filterColumnActiveByDefault;
    } else {
      const confFilterColumnActiveByDefault = storage.hasOwnProperty('filter-column-active') ? storage['filter-column-active'] : this.filterColumnActiveByDefault;
      this.isColumnFiltersActive = confFilterColumnActiveByDefault || this.state.columnValueFilters.length > 0;
    }

    if (Util.isDefined(storage.columnValueFilters)) {
      this.dataSource.initializeColumnsFilters(this.state.columnValueFilters);
      this.onFilterByColumnChange.emit();
    }

    if (this.oTableQuickFilterComponent) {
      this.oTableQuickFilterComponent.setValue(storage['filter']);
      (storage['oColumns'] || []).forEach((oColData: any) => {
        const oCol = this.getOColumn(oColData.attr);
        if (oCol && oColData.hasOwnProperty('searching')) {
          oCol.searching = oColData.searching;
        }
      });
    }

    if (this.filterBuilder && Util.isDefined(storage.filterBuilderValues)) {
      this.filterBuilder.setFilterValues(storage.filterBuilderValues);
      this.filterBuilder.triggerReload();
    }
  }

  onStoreConfigurationClicked() {
    if (this.oTableMenu) {
      this.oTableMenu.onStoreConfigurationClicked();
    }
  }

  onApplyConfigurationClicked() {
    if (this.oTableMenu) {
      this.oTableMenu.onApplyConfigurationClicked();
    }
  }

  applyDefaultConfiguration() {
    this.initializeParams();
    this.parseVisibleColumns(true);
    this.refreshColumnsWidthFromOriginalDefinition();
    this.reinitializateQuickFilterColumns();
    this.resetQueryRows();
    const initialConfigSortColumnsArray = ServiceUtils.parseSortColumns(this.state.initialConfiguration.sortColumns);
    this.reinitializeSortColumns(initialConfigSortColumnsArray);
    this.onReinitialize.emit(null);
    this.clearFilters(false);
    this.reloadData();
  }
  resetQueryRows() {
    if (Util.isDefined(this.state.initialConfiguration.queryRows)) {
      this.queryRows = this.state.initialConfiguration.queryRows;
    }
  }
  applyConfiguration(configurationName: string) {
    const storedConfiguration = this.state.getStoredConfiguration(configurationName);
    if (storedConfiguration) {
      const properties = storedConfiguration['stored-properties'] || [];

      properties.forEach(property => {
        switch (property) {
          case 'sort-columns':
            this.reinitializeSortColumns();
            break;
          case 'oColumns-display':
            this.parseVisibleColumns();
            this.initializeCheckboxColumn();
            this.refreshColumnsWidthFromLocalStorage();
            break;
          case 'quick-filter':
          case 'columns-filter':
          case 'filter-builder':
            this.setFiltersConfiguration();
            break;
          case 'grouped-columns':
            this.parseGroupedColumns();
            break;
          case 'page':
            this.currentPage = this.state.currentPage;
            this.queryRows = this.state.queryRows;
            break;
        }
      });
      this.reloadData();
    }
  }

  getTitleAlignClass(oCol: OColumn) {

    const hasTitleAlign = Util.isDefined(oCol.definition) && Util.isDefined(oCol.definition.titleAlign);
    const autoAlign = (this.autoAlignTitles && !hasTitleAlign) || (hasTitleAlign && oCol.definition.titleAlign === Codes.COLUMN_TITLE_ALIGN_AUTO);
    if (!autoAlign) {
      return oCol.getTitleAlignClass();
    }

    let align = this.getCellAlignClass(oCol);
    if (Util.isDefined(align) && align.length > 0) {
      align = align.substring(2);
    } else {
      switch (oCol.type) {
        case 'image':
        case 'date':
        case 'action':
        case 'boolean':
          align = Codes.COLUMN_TITLE_ALIGN_CENTER;
          break;
        case 'currency':
        case 'integer':
        case 'real':
        case 'percentage':
          align = Codes.COLUMN_TITLE_ALIGN_END;
          break;
        case 'service':
        default:
          align = Codes.COLUMN_TITLE_ALIGN_START;
          break;
      }
    }
    return align;

  }

  public getCellAlignClass(column: OColumn): string {
    return Util.isDefined(column.definition) && Util.isDefined(column.definition.contentAlign) ? 'o-' + column.definition.contentAlign : '';
  }


  public getGroupHeaderCellAlignClass(column: string): string[] {
    const classNameArray = [];
    const oCol = this.getOColumn(column.substr('groupHeader-'.length));
    if (Util.isDefined(oCol)) {
      classNameArray.push(this.getCellAlignClass(oCol));
      classNameArray.push(oCol.className ? oCol.className : '');
    }
    return classNameArray;
  }

  protected addDefaultRowButtons() {
    // check permissions
    if (this.editButtonInRow) {
      this.addButtonInRow('editButtonInRow');
    }
    if (this.detailButtonInRow) {
      this.addButtonInRow('detailButtonInRow');
    }
  }

  protected addButtonInRow(name: string) {
    const colDef: OColumn = this.createOColumn(name, this);
    colDef.type = name;
    colDef.visible = true;
    colDef.searchable = false;
    colDef.orderable = false;
    colDef.resizable = false;
    colDef.groupable = false;
    colDef.title = undefined;
    colDef.width = '48px';
    this.pushOColumnDefinition(colDef);
    this._oTableOptions.visibleColumns.push(name);
  }

  get headerHeight() {
    let height = 0;
    if (this.tableHeaderEl && this.tableHeaderEl.nativeElement) {
      height += this.tableHeaderEl.nativeElement.offsetHeight;
    }
    if (this.tableToolbarEl && this.tableToolbarEl.nativeElement) {
      height += this.tableToolbarEl.nativeElement.offsetHeight;
    }
    return height;
  }

  isDetailMode(): boolean {
    return this.detailMode !== Codes.DETAIL_MODE_NONE;
  }

  copyAll() {
    Util.copyToClipboard(JSON.stringify(this.getRenderedValue()));
  }

  copySelection() {
    const selectedItems = this.dataSource.getRenderedData(this.getSelectedItems());
    Util.copyToClipboard(JSON.stringify(selectedItems));
  }

  destroyActivedTooltips() {
    this.tooltip.forEach(tp => {
      if (tp._overlayRef) {
        tp._overlayRef.detach();
      }
    });
  }

  /**
   * Triggers navigation to item detail, receiving item data
   * @param item
   * @returns detail
   */
  viewDetail(item: any): void {
    if (!this.checkEnabledActionPermission('detail')) {
      return;
    }
    this.destroyActivedTooltips();
    super.viewDetail(item);
  }


  /**
   * Triggers navigation to item edition, receiving item data
   * @param item
   * @returns detail
   */
  editDetail(item: any): void {
    if (!this.checkEnabledActionPermission('edit')) {
      return;
    }
    super.editDetail(item);
  }

  getOColumnFromTh(th: any): OColumn {
    let result: OColumn;
    const classList: any[] = Array.from((th as Element).classList || []);
    const columnClass = classList.find((className: string) => (className.startsWith('mat-column-')));
    if (Util.isDefined(columnClass)) {
      result = this.getOColumn(columnClass.substr('mat-column-'.length));
    }
    return result;
  }

  getOColumnFromGroupHeaderColumn(attr: string): OColumn {
    return this.getOColumn(attr.substr('groupHeader-'.length));
  }

  getThWidthFromOColumn(oColumn: OColumn): any {
    let widthColumn: number;
    const thArray = this.tableHeaderEl.nativeElement.children;
    for (let i = 0; i < thArray.length && !Util.isDefined(widthColumn); i++) {
      const th = thArray[i];
      const classList = th.classList;
      for (let j = 0; j < classList.length && !Util.isDefined(widthColumn); j++) {
        if (classList[j] === 'mat-column-' + oColumn.attr) {
          widthColumn = th.clientWidth;
        }
      }
    }
    return widthColumn;
  }

  getColumnInsertable(name): string {
    return name + this.getSuffixColumnInsertable();
  }

  isRowSelected(row: any): boolean {
    const keys = Object.keys(row);
    return !this.isSelectionModeNone() && this.selection.selected.some((element: any) => keys.every(key => row[key] === element[key]));
  }

  public getColumnWidthFromState(colDef: OColumn): string {
    //1. By default, set width definition
    let columnWidth = colDef.definition && colDef.definition.width ? colDef.definition.width : void 0;
    const storedData = this.state.getColumnDisplay(colDef);
    if (Util.isDefined(storedData) && Util.isDefined(storedData.width)) {
      //2. Set width if the width is stored
      columnWidth = storedData.width;
      // check that the width of the columns saved in the initial configuration
      // in the local storage is different from the original value
      if (this.state.initialConfiguration.columnsDisplay) {
        const initialStoredData = this.state.initialConfiguration.getColumnDisplay(colDef);
        // If original width changed then the width is reseted with this value
        if (initialStoredData && initialStoredData.width && colDef.definition.originalWidth) {
          if (initialStoredData.width !== colDef.definition.originalWidth) {
            columnWidth = colDef.definition.originalWidth;
          }
        }
      }
    }
    return columnWidth;
  }

  refreshColumnsWidthFromLocalStorage() {
    this.oTableOptions.columns.forEach(x => {
      x.width = this.getColumnWidthFromState(x);
    });
  }

  refreshColumnsWidthFromOriginalDefinition() {
    setTimeout(() => {
      this._oTableOptions.columns.filter(c => c.visible).forEach(c => {
        c.width = c.DOMWidth = void 0;
        if (Util.isDefined(c.definition) && Util.isDefined(c.definition.width)) {
          c.width = c.definition.width;
        }
        c.setRenderWidth(this.horizontalScroll, this.getClientWidthColumn(c));
      });
      this.cd.detectChanges();
    }, 0);
  }

  private createOColumn(attr?: string, table?: OTableComponent, column?: OTableColumnComponent & OTableColumnCalculatedComponent): OColumn {
    const instance = new OColumn();
    if (attr) {
      instance.attr = attr;
    }
    if (table) {
      instance.setDefaultProperties({
        orderable: this.orderable,
        resizable: this.resizable,
        groupable: this.groupable
      });
    }
    if (column) {
      instance.setColumnProperties(column);
    }
    return instance;
  }

  public registerOTableButtons(arg: OTableButtons) {
    this.oTableButtons = arg;
    if (this.oTableButtons && this.tableButtons && this.tableButtons.length > 0) {
      this.oTableButtons.registerButtons(this.tableButtons.toArray());
    }
  }

  public getClientWidthColumn(col: OColumn): number {
    return col.DOMWidth || this.getThWidthFromOColumn(col);
  }

  public getMinWidthColumn(col: OColumn): string {
    return Util.extractPixelsValue(col.minWidth, Codes.DEFAULT_COLUMN_MIN_WIDTH) + 'px';
  }

  showExpandableRow(): boolean {
    return Util.isDefined(this.tableRowExpandable);
  }

  /**
   * Gets enable virtual scroll
   */
  get enabledVirtualScroll(): boolean {
    return this.virtualScroll && !this.showExpandableRow() && this.groupedColumnsArray.length === 0;
  }
  /**
   * Parses grouped columns
   */
  parseGroupedColumns() {
    let result = this.state.groupedColumns || this.originalGroupedColumnsArray;
    if (this.state.groupedColumns && this.state.initialConfiguration.groupedColumns) {
      const difference = this.state.initialConfiguration.groupedColumns
        .filter(x => !this.originalGroupedColumnsArray.includes(x));

      if (difference.length > 0) {
        result = this.originalGroupedColumnsArray;
      }
    }
    this.setGroupColumns(result);
  }
  parseGroupedColumnTypes() {
    this.groupedColumnTypes = this.state.groupedColumnTypes;
  }

  /**
   * Groups by column
   * @param column
   */
  groupByColumn(column: OColumn, type?: string) {
    this.checkGroupByColumn(column.attr, true);
    if (type) {
      this.updateGroupedColumnTypes(column.attr, true, type);
    }
    this.dataSource.updateGroupedColumns();
  }

  /**
   * Ungroup by column
   * @param column
   */
  unGroupByColumn(column: OColumn) {
    this.checkGroupByColumn(column.attr, false);
    this.updateGroupedColumnTypes(column.attr, false);
    this.dataSource.updateGroupedColumns();
  }

  /**
   * Ungroup by all columns
   */
  unGroupByAllColumns() {
    this.setGroupColumns([]);
    this.groupedColumnTypes = [];
  }

  setGroupColumns(value: any[]) {
    this.groupedColumnsArray = value;
    this.dataSource.updateGroupedColumns();
  }
  setGroupedColumnTypes(value: OGroupedColumnTypes[]) {
    this.groupedColumnTypes = value;
  }
  checkGroupByColumn(field: string, add: boolean) {
    let found = null;
    for (const column of this.groupedColumnsArray) {
      if (column === field) {
        found = this.groupedColumnsArray.indexOf(column, 0);
      }
    }
    if (found != null && found >= 0) {
      if (!add) {
        this.groupedColumnsArray.splice(found, 1);
      }
    } else {
      if (add) {
        this.groupedColumnsArray.push(field);
      }
    }
  }

  /**
   * Determines whether item is group
   * @param index
   * @param item
   * @returns true if group
   */
  isGroup(index, item): boolean {
    return item instanceof OTableGroupedRow;
  }

  /**
   * Determines whether item is not group
   * @param index
   * @param item
   * @returns true if not group
   */
  isNotGroup(index, item): boolean {
    return !(item instanceof OTableGroupedRow);
  }

  getLastGroups() {
    // Get last groups
    const scores = this.dataSource.renderedData;
    const maxLevel = scores.reduce((acc, curr) => curr.level > acc ? curr.level : acc, 0);
    const maxLevelRenderedData = scores.reduce((r, o) => o.level === maxLevel ? [...r, o] : r, []);
    return maxLevelRenderedData.length;
  }

  groupHeaderClick(row: OTableGroupedRow) {
    this.dataSource.toggleGroupByColumn(row);
  }

  private isInstanceOfOTableCellRendererServiceComponent(renderer: OBaseTableCellRenderer) {
    return Util.isDefined(renderer) && (renderer as any).onDataLoaded && (renderer as any).queryAllData;
  }

  /**
   * Gets column data by attr
   * @param attr
   * @param row
   * @returns column data by attr
   */
  getColumnDataByAttr(attr, row: any): any {
    let operation = null;
    if (this.groupedColumnTypes.length != 0 && this.groupedColumnTypes.findIndex(column => column.attr == attr) != -1) {
      operation = this.groupedColumnTypes[this.groupedColumnTypes.findIndex(column => column.attr == attr)].type;
    }
    const oCol = this.getOColumn(attr);
    if (!Util.isDefined(oCol)) {
      return row[attr];
    }
    const useRenderer = oCol.renderer && oCol.renderer.getCellData;
    if (operation == null) {
      return useRenderer ? oCol.renderer.getCellData(row[oCol.attr], row) : row[oCol.attr];
    }
    else {
      const date = moment(row[oCol.attr]);
      const language = this.translateService.getCurrentLang();
      switch (operation) {
        case "YEAR": return date.year();
        case "MONTH": return moment().locale(language).month(date.month()).format("MMMM");
        case "YEAR_MONTH": return moment().locale(language).month(date.month()).year(date.year()).format("MMMM, YYYY");
        case "YEAR_MONTH_DAY": return useRenderer ? oCol.renderer.getCellData(row[oCol.attr], row) : row[oCol.attr];
      }
    }
  }
  updateGroupedColumnTypes(attr: string, add: boolean, operation?: string) {
    let groupedColumns: OGroupedColumnTypes[] = [];
    let index = this.groupedColumnTypes.findIndex(column => column.attr == attr);
    if (index != -1) {
      if (!add) {
        this.groupedColumnTypes.splice(index, 1);
      }
    }
    else {
      if (add) {
        this.groupedColumnTypes.push({ "attr": attr, "type": operation });
      }
    }
    this.state.groupedColumnTypes = groupedColumns;
  }

  getClassNameGroupHeader(row: OTableGroupedRow): string {
    let className = '';
    if (row.level <= 10) {
      className = 'o-table-group-row o-table-group-row-level-' + row.level;
    }
    return className;
  }

  private stopEdition(clearSelection?: boolean) {
    clearSelection = clearSelection ? clearSelection : false;
    this.editingCell = undefined;
    this.editingRow = undefined;
    this.clearSelectionAndEditing(clearSelection);
  }

  storeFilterInState(arg: OFilterDefinition) {
    this.componentStateService.storeFilter(arg);
  }

  reinitializateQuickFilterColumns() {
    this._oTableOptions.columns
      .filter(column => column.searchable && column.visible)
      .forEach(column => column.searching = true)
  }

  reinitializeSortColumns(sortColumns?: SQLOrder[]) {
    this.tableHeaders = [];
    if (Util.isDefined(sortColumns)) {
      this.sortColArray = sortColumns;
    } else {
      this.parseSortColumns();
    }
    this.sort.setSortColumns(this.sortColArray);
    this.refreshSortHeaders();
  }

  protected refreshSortHeaders() {
    this.tableHeaders.filter(header => Util.isDefined(header.matSortHeader)).forEach(header => header.matSortHeader.refresh());
  }

  getQuickFilterValue(): string {
    return Util.isDefined(this.oTableQuickFilterComponent) ?
      this.oTableQuickFilterComponent.value :
      '';
  }

  public queryCellRenderers(): Observable<any> {
    const quickFilterValue = this.getQuickFilterValue();

    if ((Util.isDefined(quickFilterValue) && quickFilterValue.length > 0) || this.sortColArray.length > 0) {
      const queries = this.oTableOptions.columns
        .filter(oCol => oCol.searching && this.isInstanceOfOTableCellRendererServiceComponent(oCol.renderer))
        .map(oCol => (oCol.renderer as any).queryAllData());

      return queries.length > 0 ? combineLatest(queries) : of(null);
    }
    return of(null);
  }

  tableQuickFilterChanged(value: string) {
    if (this.pageable) {
      this.queryCellRenderers().subscribe(() => {
        this.reloadPaginatedDataFromStart(false);
      });
    } else {
      if (value && value.length) {
        this.dataSource.quickFilter = value;
      }
    }
  }

  // onMatSortChange
  public filterData(value?: string, loadMore?: boolean): void {
    //
  }

  setOTableColumnsGrouping(value: OTableColumnsGrouping) {
    this.oTableColumnsGroupingComponent = value;
  }

  getColumnGroupingComponent(columnAttr: string): OTableColumnsGroupingColumnComponent {
    let result: OTableColumnsGroupingColumnComponent;
    if (Util.isDefined(this.oTableColumnsGroupingComponent)) {
      result = this.oTableColumnsGroupingComponent.getColumnGrouping(columnAttr);
    }
    return result;
  }

  useColumnGroupingAggregate(columnAttr: string): boolean {
    const oCol = this.getOColumn(columnAttr);
    if (!Util.isDefined(oCol)) {
      return false;
    }
    const sqlType = this.getSqlTypes()[columnAttr];
    const hasDefaultAggregate = SQLTypes.isNumericSQLType(sqlType)
      && (!Util.isDefined(oCol.renderer) || OTableComponent.AVAILABLE_GROUPING_COLUMNS_RENDERERS.includes(oCol.type));

    if (!Util.isDefined(this.oTableColumnsGroupingComponent)) {
      return hasDefaultAggregate;
    }
    return this.oTableColumnsGroupingComponent.useColumnAggregate(columnAttr, hasDefaultAggregate);
  }

  protected checkViewportSize() {
    // Its a temporarily fixed for https://github.com/angular/components/issues/10117
    // Solve the issue when switching tabs when the virtual scrolling component is used
    // in a mat - tab component and virtual scroll work abnormally
    if (this.virtualScrollViewport) {
      this.virtualScrollViewport.checkViewportSize();
    }
  }

  // Show expandable icon or not if has data or not
  showExpandableIcon(row: any, rowIndex: number): Observable<boolean> {
    return (Util.isDefined(this.showExpandableIconFunction) && this.showExpandableIconFunction instanceof Function) ? Util.wrapIntoObservable(this.showExpandableIconFunction(row, rowIndex)) : of(true);
  }

  getColumnsNotIncluded(): string[] {
    let colsNotIncluded = [];
    colsNotIncluded = this.oTableOptions.columns.filter(c => void 0 !== c.renderer && (c.type === 'image' || c.type === 'action')).map(c => c.attr);
    colsNotIncluded.push(Codes.NAME_COLUMN_SELECT);
    colsNotIncluded.push(Codes.NAME_COLUMN_EXPANDABLE);
    return colsNotIncluded;
  }

  getColumnNames(columns: string[]): { [columnId: string]: string; } {
    const tableColumnNames = {};
    columns.forEach(c => {
      const oColumn = this._oTableOptions.columns.find(oc => oc.attr === c);
      tableColumnNames[c] = this.translateService.get(oColumn.title ? oColumn.title : oColumn.attr);
    });
    return tableColumnNames;
  }

  resetColumnsWidth() {
    this._oTableOptions.columns.forEach(c => {
      if (Util.isDefined(c.definition)) {
        c.width = Util.isDefined(c.definition.width) ? c.definition.width : c.definition.originalWidth
      } else {
        c.width = "auto";
      }
    });
    this.cd.detectChanges();
    this.updateColumnsDOMWidth();
  }

  updateColumnsDOMWidth() {
    this._oTableOptions.columns.forEach(c => {
      c.DOMWidth = this.getThWidthFromOColumn(c);
    });

  }

  public isDisableCheckbox(item: any): boolean {
    let disable = false;
    if (Util.isDefined(this.disableSelectionFunction)) {
      return this.disableSelectionFunction(item);
    }
    return disable;

  }
}
