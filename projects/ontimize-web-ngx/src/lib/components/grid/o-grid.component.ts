import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Injector,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
  SimpleChange,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatFormFieldAppearance, MatPaginator, MatSelectChange, PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { InputConverter } from '../../decorators/input-converter';
import { IGridItem } from '../../interfaces/o-grid-item.interface';
import { OntimizeServiceProvider } from '../../services/factories';
import { AbstractComponentStateService } from '../../services/state/o-component-state.service';
import { OGridComponentStateClass } from '../../services/state/o-grid-component-state.class';
import { OGridComponentStateService } from '../../services/state/o-grid-component-state.service';
import { OQueryDataArgs } from '../../types/query-data-args.type';
import { SQLOrder } from '../../types/sql-order.type';
import { ObservableWrapper } from '../../util/async';
import { Codes } from '../../util/codes';
import { ServiceUtils } from '../../util/service.utils';
import { Util } from '../../util/util';
import { OFormComponent } from '../form/o-form.component';
import { AbstractOServiceComponent, DEFAULT_INPUTS_O_SERVICE_COMPONENT, DEFAULT_OUTPUTS_O_SERVICE_COMPONENT } from '../o-service-component.class';
import { OMatSort } from '../table/extensions/sort/o-mat-sort';
import { OGridItemComponent } from './grid-item/o-grid-item.component';
import { OGridItemDirective } from './grid-item/o-grid-item.directive';

export const DEFAULT_INPUTS_O_GRID = [
  ...DEFAULT_INPUTS_O_SERVICE_COMPONENT,
  // cols: Amount of columns in the grid list. Default in extra small and small screen is 1, in medium screen is 2, in large screen is 3 and extra large screen is 4.
  'cols',
  // page-size-options [string]: Page size options separated by ';'.
  'pageSizeOptions: page-size-options',
  // show-page-size:Whether to hide the page size selection UI from the user.
  'showPageSize: show-page-size',
  // show-sort:whether or not the sort select is shown in the toolbar
  'showSort: orderable',
  // sortable[string]: columns of the filter, separated by ';'. Default: no value.
  'sortableColumns: sortable-columns',
  // sortColumns[string]: columns of the sortingcolumns, separated by ';'. Default: no value.
  'sortColumn: sort-column',
  // quick-filter-columns [string]: columns of the filter, separated by ';'. Default: no value.
  'quickFilterColumns: quick-filter-columns',
  //  grid-item-height[string]: Set internal representation of row height from the user-provided value.. Default: 1:1.
  'gridItemHeight: grid-item-height',
  // refresh-button [no|yes]: show refresh button. Default: yes.
  'refreshButton: refresh-button',
  // pagination-controls [yes|no|true|false]: show pagination controls. Default: no.
  'paginationControls: pagination-controls',
  // gutterSize: Size of the grid list's gutter in pixels.
  'gutterSize:gutter-size',
  // fix-header [yes|no|true|false]: fixed footer when the content is greather than its own height. Default: no.
  'fixedHeader:fixed-header',
  // show-footer:Indicates whether or not to show the footer:Default:true
  'showFooter:show-footer',
  // insert-button-position [ top | bottom ]: position of the insert button. Default: 'bottom'
  'insertButtonPosition:insert-button-position',
  // insert-button-floatable [no|yes]: Indicates whether or not to position of the insert button is floating . Default: 'yes'
  'insertButtonFloatable:insert-button-floatable',
  'quickfilterAppearance:quickfilter-appearance'
];

export const DEFAULT_OUTPUTS_O_GRID = [
  ...DEFAULT_OUTPUTS_O_SERVICE_COMPONENT
];

const PAGE_SIZE_OPTIONS = [8, 16, 24, 32, 64];

@Component({
  selector: 'o-grid',
  providers: [
    OntimizeServiceProvider,
    { provide: AbstractComponentStateService, useClass: OGridComponentStateService, deps: [Injector] }
  ],
  inputs: DEFAULT_INPUTS_O_GRID,
  outputs: DEFAULT_OUTPUTS_O_GRID,
  templateUrl: './o-grid.component.html',
  styleUrls: ['./o-grid.component.scss'],
  host: {
    '[class.o-grid]': 'true',
    '[class.o-grid-fixed]': 'fixedHeader'
  }
})
export class OGridComponent extends AbstractOServiceComponent<OGridComponentStateService> implements AfterViewInit, OnChanges, OnDestroy, OnInit {

  /* Inputs */
  protected _queryRows = 32;

  @InputConverter()
  public fixedHeader: boolean = false;

  @InputConverter()
  public showPageSize: boolean = false;

  @InputConverter()
  public showSort: boolean = false;

  @InputConverter()
  public showFooter: boolean = true;

  public gridItemHeight = '1:1';

  @InputConverter()
  public refreshButton: boolean = true;

  @InputConverter()
  public paginationControls: boolean = false;

  @InputConverter()
  insertButton: boolean = false;

  @InputConverter()
  public insertButtonFloatable: boolean = true;

  public insertButtonPosition: 'top' | 'bottom' = 'bottom';

  public gutterSize = '1px';
  protected _quickfilterAppearance: MatFormFieldAppearance = 'outline';
  get cols(): number {
    return this._cols || this._colsDefault;
  }
  set cols(value: number) {
    this._cols = value;
  }

  get pageSizeOptions(): number[] {
    return this._pageSizeOptions;
  }
  set pageSizeOptions(val: number[]) {
    if (!(val instanceof Array)) {
      val = Util.parseArray(String(val)).map(a => parseInt(a, 10));
    }
    this._pageSizeOptions = val;
  }

  get sortableColumns(): SQLOrder[] {
    return this._sortableColumns;
  }
  set sortableColumns(val) {
    let parsed = [];
    if (!Util.isArray(val)) {
      parsed = ServiceUtils.parseSortColumns(String(val));
    }
    this._sortableColumns = parsed;
  }

  public quickFilterColumns: string;
  /* End Inputs */

  @ContentChildren(forwardRef(() => OGridItemComponent))
  public inputGridItems: QueryList<OGridItemComponent>;
  @ViewChildren(OGridItemDirective)
  public gridItemDirectives: QueryList<OGridItemDirective>;
  @ViewChild(MatPaginator, { static: false })
  public matpaginator: MatPaginator;

  /* Parsed Inputs */
  protected _sortableColumns: SQLOrder[] = [];
  public sortColumnOrder: SQLOrder;
  /* End parsed Inputs */

  protected _cols;
  protected _colsDefault = 1;
  protected _pageSizeOptions = PAGE_SIZE_OPTIONS;
  protected sortColumn: string;
  public storePaginationState: boolean = false;

  set gridItems(value: IGridItem[]) {
    this._gridItems = value;
  }

  get gridItems(): IGridItem[] {
    return this._gridItems;
  }

  protected _gridItems: IGridItem[] = [];

  set currentPage(val: number) {
    this._currentPage = val;
  }

  get currentPage(): number {
    return this._currentPage;
  }

  protected _currentPage: number = 0;

  protected subscription: Subscription = new Subscription();
  protected media: MediaObserver;

  protected oMatSort: OMatSort;

  constructor(
    injector: Injector,
    elRef: ElementRef,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent
  ) {
    super(injector, elRef, form);
    this.media = this.injector.get(MediaObserver);
    this.oMatSort = new OMatSort();
  }

  get state(): OGridComponentStateClass {
    return this.componentStateService.state;
  }

  public ngOnInit(): void {
    this.initialize();
  }

  public initialize(): void {
    super.initialize();

    if (!Util.isDefined(this.quickFilterColumns)) {
      this.quickFilterColumns = this.columns;
    }
    this.quickFilterColArray = Util.parseArray(this.quickFilterColumns, true);

    if (Util.isDefined(this.state.sortColumn)) {
      this.sortColumn = this.state.sortColumn;
    }
    this.parseSortColumn();

    const existingOption = this.pageSizeOptions.find(option => option === this.queryRows);
    if (!Util.isDefined(existingOption)) {
      this._pageSizeOptions.push(this.queryRows);
      this._pageSizeOptions.sort((i: number, j: number) => i - j);
    }
    if (Util.isDefined(this.state.currentPage)) {
      this.currentPage = this.state.currentPage;
    }
    if (Util.isDefined(this.state.queryRows)) {
      this.queryRows = this.state.queryRows;
    }
  }

  public ngAfterViewInit(): void {
    super.afterViewInit();
    this.filterCaseSensitive = Util.isDefined(this.state.filterCaseSensitive) ?
      this.state.filterCaseSensitive :
      this.filterCaseSensitive;
    this.setGridItemDirectivesData();
    this.subscribeToMediaChanges();
    this.registerQuickFilter(this.searchInputComponent);
    if (this.queryOnInit) {
      this.queryData();
    }
  }

  public ngAfterContentInit(): void {
    this.gridItems = this.inputGridItems.toArray();
    this.subscription.add(this.inputGridItems.changes.subscribe(queryChanges => {
      this.gridItems = queryChanges._results;
    }));
  }

  public subscribeToMediaChanges(): void {
    this.subscription.add(this.media.asObservable().subscribe((change: MediaChange[]) => {
      if (change && change[0]) {
        switch (change[0].mqAlias) {
          case 'xs':
          case 'sm':
            this._colsDefault = 1;
            break;
          case 'md':
            this._colsDefault = 2;
            break;
          case 'lg':
          case 'xl':
            this._colsDefault = 4;
        }
      }
    }));
  }

  public reloadData(): void {
    let queryArgs: OQueryDataArgs = {};
    if (this.pageable) {
      this.state.queryRecordOffset = 0;
      queryArgs = {
        offset: this.paginationControls ? (this.currentPage * this.queryRows) : 0,
        length: Math.max(this.queryRows, this.dataResponseArray.length),
        replace: true
      };
    }
    this.queryData(void 0, queryArgs);
  }

  public reloadPaginatedDataFromStart(): void {
    this.currentPage = 0;
    this.dataResponseArray = [];
    this.reloadData();
  }

  protected getSortedDataFromArray(dataArray: any[]): any[] {
    if (Util.isDefined(this.sortColumnOrder)) {
      return this.oMatSort.getSortedDataBySQLOrder(dataArray, [this.sortColumnOrder]);
    }
    return dataArray;
  }

  protected getPaginationDataFromArray(dataArray: any[]): any[] {
    let result = dataArray;
    if (this.paginationControls) {
      result = dataArray.splice(this.currentPage * this.queryRows, this.queryRows);
    } else {
      result = dataArray.splice(0, this.queryRows * (this.currentPage + 1));
    }
    return result;
  }

  public registerGridItemDirective(item: OGridItemDirective): void {
    if (item) {
      if (this.detailMode === Codes.DETAIL_MODE_CLICK) {
        item.onClick(gridItem => this.onItemDetailClick(gridItem));
      }
      if (Codes.isDoubleClickMode(this.detailMode)) {
        item.onDoubleClick(gridItem => this.onItemDetailDblClick(gridItem));
      }
    }
  }

  public onItemDetailClick(item: OGridItemDirective): void {
    if (this.oenabled && this.detailMode === Codes.DETAIL_MODE_CLICK) {
      this.saveDataNavigationInLocalStorage();
      this.viewDetail(item.getItemData());
      ObservableWrapper.callEmit(this.onClick, item);
    }
  }

  public onItemDetailDblClick(item: OGridItemDirective): void {
    if (this.oenabled && Codes.isDoubleClickMode(this.detailMode)) {
      this.saveDataNavigationInLocalStorage();
      this.viewDetail(item.getItemData());
      ObservableWrapper.callEmit(this.onDoubleClick, item);
    }
  }

  public ngOnDestroy(): void {
    this.destroy();
  }

  public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    if (changes.staticData !== undefined) {
      this.dataResponseArray = changes.staticData.currentValue;
      this.onDataLoaded.emit(this.dataResponseArray);
      /* if the static data changes after registering the quick filter,
      the filterData method is called else when registering the quickfilter
      or when a change occurs */
      if (this.quickFilterComponent) {
        this.filterData();
      }
    }
  }

  public destroy(): void {
    super.destroy();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public loadMore(): void {
    this.currentPage += 1;
    if (this.pageable) {
      const queryArgs: OQueryDataArgs = {
        offset: this.state.queryRecordOffset,
        length: this.queryRows
      };
      this.queryData(void 0, queryArgs);
    } else {
      this.filterData(void 0, true);
    }
  }

  get totalRecords(): number {
    if (this.pageable) {
      return this.getTotalRecordsNumber();
    }
    return this.dataResponseArray.length;
  }

  public getQueryArguments(filter: object, ovrrArgs?: OQueryDataArgs): any[] {
    const queryArguments = super.getQueryArguments(filter, ovrrArgs);
    // queryArguments[3] = this.getSqlTypesForFilter(queryArguments[1]);
    if (this.pageable && Util.isDefined(this.sortColumn)) {
      queryArguments[6] = this.sortColumnOrder ? [this.sortColumnOrder] : this.sortColumnOrder;
    }
    return queryArguments;
  }

  public parseSortColumn(): void {
    const parsed = (ServiceUtils.parseSortColumns(this.sortColumn) || [])[0];
    const index = this.findSortableColumnIndex(parsed);
    if (Util.isDefined(index) && index !== -1) {
      this.sortColumnOrder = parsed;
    }
  }

  get currentOrderColumn(): number {
    return this.findSortableColumnIndex(this.sortColumnOrder);
  }

  set currentOrderColumn(val: number) {
    this.sortColumnOrder = this.sortableColumns[val];
  }

  protected findSortableColumnIndex(sortableColumn: SQLOrder): number {
    if (!Util.isDefined(sortableColumn)) {
      return null;
    }
    return this.sortableColumns
      .findIndex(item => item.columnName === sortableColumn.columnName
        && item.ascendent === sortableColumn.ascendent);
  }

  public onChangePage(e: PageEvent): void {
    if (!this.pageable) {
      this.currentPage = e.pageIndex;
      this.queryRows = e.pageSize;
      this.filterData();
      return;
    }
    const goingBack = e.pageIndex < this.currentPage;
    this.currentPage = e.pageIndex;
    const pageSize = e.pageSize;

    const oldQueryRows = this.queryRows;
    const changingPageSize = (oldQueryRows !== pageSize);
    this.queryRows = pageSize;

    let newStartRecord;
    let queryLength;

    if (goingBack || changingPageSize) {
      newStartRecord = (this.currentPage * this.queryRows);
      queryLength = this.queryRows;
    } else {
      newStartRecord = Math.max(this.state.queryRecordOffset, (this.currentPage * this.queryRows));
      const newEndRecord = Math.min(newStartRecord + this.queryRows, this.state.totalQueryRecordsNumber);
      queryLength = Math.min(this.queryRows, newEndRecord - newStartRecord);
    }

    const queryArgs: OQueryDataArgs = {
      offset: newStartRecord,
      length: queryLength
    };
    this.queryData(void 0, queryArgs);
  }

  public getDataToStore(): any {
    return this.componentStateService.getDataToStore();
  }

  public getSortOptionText(col: SQLOrder): string {
    let result;
    let colTextKey = `GRID.SORT_BY_${col.columnName.toUpperCase()}_` + (col.ascendent ? 'ASC' : 'DESC');
    result = this.translateService.get(colTextKey);
    if (result !== colTextKey) {
      return result;
    }
    colTextKey = 'GRID.SORT_BY_' + (col.ascendent ? 'ASC' : 'DESC');
    result = this.translateService.get(colTextKey, [(this.translateService.get(col.columnName) || '')]);
    return result;
  }

  public add(): void {
    super.insertDetail();
  }

  protected parseResponseArray(data: any[], replace?: boolean) {
    let result = data;
    if (this.pageable && !replace) {
      // dataArray = this.paginationControls ? data : (this.dataArray || []).concat(data);
      result = this.paginationControls ? data : (this.dataResponseArray || []).concat(data);
    } else if (!this.pageable) {
      // dataArray = data.slice(this.paginationControls ? ((this.queryRows * (this.currentPage + 1)) - this.queryRows) : 0, this.queryRows * (this.currentPage + 1));
      result = data;
    }
    return result;
  }

  protected saveDataNavigationInLocalStorage(): void {
    super.saveDataNavigationInLocalStorage();
    this.storePaginationState = true;
  }

  protected setGridItemDirectivesData(): void {
    this.gridItemDirectives.changes.subscribe(() => {
      this.gridItemDirectives.toArray().forEach((element: OGridItemDirective, index) => {
        element.setItemData(this.dataArray[index]);
        element.setGridComponent(this);
        this.registerGridItemDirective(element);
      });
    });
  }

  public pageSizeChanged() {
    if (this.pageable) {
      this.reloadData();
    } else {
      this.filterData();
    }
  }

  public sortColumnChanged(event: MatSelectChange) {
    this.currentOrderColumn = event.value;
    if (this.pageable) {
      this.reloadData();
    } else {
      this.filterData();
    }
  }

  public registerQuickFilter(arg: any): void {
    super.registerQuickFilter(arg);
    if (Util.isDefined(this.quickFilterComponent) && Util.isDefined(this.state.quickFilterActiveColumns)) {
      const parsedArr = Util.parseArray(this.state.quickFilterActiveColumns, true);
      this.quickFilterComponent.setActiveColumns(parsedArr);
    }
  }
  get quickfilterAppearance(): MatFormFieldAppearance {
    return this._quickfilterAppearance;
  }

  set quickfilterAppearance(value: MatFormFieldAppearance) {
    const values = ['legacy', 'standard', 'fill', 'outline'];
    if (values.indexOf(value) === -1) {
      console.warn('The quickfilterAppearance attribute is undefined');
      value = 'outline';
    }
    this._quickfilterAppearance = value;
  }
}
