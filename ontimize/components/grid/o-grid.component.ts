import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ContentChildren, ElementRef, EventEmitter, forwardRef, Inject, Injector, NgModule, OnChanges, OnDestroy, OnInit, Optional, QueryList, SimpleChange, ViewChild, ViewChildren } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { MatPaginator, PageEvent } from '@angular/material';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { OSearchInputModule } from '../../components';
import { InputConverter } from '../../decorators';
import { OntimizeService } from '../../services';
import { dataServiceFactory } from '../../services/data-service.provider';
import { OSharedModule } from '../../shared';
import { Codes, ObservableWrapper, Util } from '../../utils';
import { OFormComponent } from '../form/form-components';
import { OServiceComponent } from '../o-service-component.class';
import { ISQLOrder, OQueryDataArgs, ServiceUtils } from '../service.utils';
import { OGridItemComponent, OGridItemModule } from './grid-item/o-grid-item.component';
import { OGridItemDirective } from './grid-item/o-grid-item.directive';

export const DEFAULT_INPUTS_O_GRID = [
  ...OServiceComponent.DEFAULT_INPUTS_O_SERVICE_COMPONENT,
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
  'showFooter:show-footer'
];

export const DEFAULT_OUTPUTS_O_GRID = [
  'onClick',
  'onDoubleClick',
  'onDataLoaded',
  'onPaginatedDataLoaded'
];

const PAGE_SIZE_OPTIONS = [8, 16, 24, 32, 64];

@Component({
  moduleId: module.id,
  selector: 'o-grid',
  providers: [
    { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] }
  ],
  inputs: DEFAULT_INPUTS_O_GRID,
  outputs: DEFAULT_OUTPUTS_O_GRID,
  templateUrl: './o-grid.component.html',
  styleUrls: ['./o-grid.component.scss'],
  host: {
    '[class.o-grid]': 'true',
    '[class.o-grid-fixed]': 'fixedHeader',
  }
})
export class OGridComponent extends OServiceComponent implements AfterViewChecked, AfterViewInit, OnChanges, OnDestroy, OnInit {

  public static DEFAULT_INPUTS_O_GRID = DEFAULT_INPUTS_O_GRID;
  public static DEFAULT_OUTPUTS_O_GRID = DEFAULT_OUTPUTS_O_GRID;

  /* Inputs */
  @InputConverter()
  public queryRows: number = 32;

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

  public gutterSize = '1px';

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
      val = Util.parseArray(String(val)).map(a => parseInt(a));
    }
    this._pageSizeOptions = val;
  }

  get sortableColumns(): ISQLOrder[] {
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

  public onClick: EventEmitter<any> = new EventEmitter();
  public onDoubleClick: EventEmitter<any> = new EventEmitter();
  public onDataLoaded: EventEmitter<any> = new EventEmitter();
  public onPaginatedDataLoaded: EventEmitter<any> = new EventEmitter();

  @ContentChildren(OGridItemComponent)
  public inputGridItems: QueryList<OGridItemComponent>;
  @ViewChildren(OGridItemDirective)
  public gridItemDirectives: QueryList<OGridItemDirective>;
  @ViewChild(MatPaginator)
  public matpaginator: MatPaginator;

  /* Parsed Inputs */
  protected _sortableColumns: ISQLOrder[] = [];
  protected sortColumnOrder: ISQLOrder;
  /* End parsed Inputs */

  protected _cols;
  protected _colsDefault = 1;
  protected _pageSizeOptions = PAGE_SIZE_OPTIONS;
  protected sortColumn: string;
  protected dataResponseArray: any[] = [];
  protected storePaginationState: boolean = false;

  set gridItems(value: OGridItemComponent[]) {
    this._gridItems = value;
  }
  get gridItems(): OGridItemComponent[] {
    return this._gridItems;
  }
  protected _gridItems: OGridItemComponent[];

  set currentPage(val: number) {
    this._currentPage = val;
  }
  get currentPage(): number {
    return this._currentPage;
  }
  protected _currentPage: number = 0;

  protected subscription: Subscription = new Subscription();
  protected media: ObservableMedia;

  constructor(
    injector: Injector,
    elRef: ElementRef,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent
  ) {
    super(injector, elRef, form);
    this.media = this.injector.get(ObservableMedia);
  }

  public ngOnInit(): void {
    this.initialize();
  }

  public initialize(): void {
    super.initialize();

    if (this.state.hasOwnProperty('sort-column')) {
      this.sortColumn = this.state['sort-column'];
    }

    this.parseSortColumn();

    const existingOption = this.pageSizeOptions.find(option => option === this.queryRows);
    if (!Util.isDefined(existingOption)) {
      this._pageSizeOptions.push(this.queryRows);
      this._pageSizeOptions.sort((i: number, j: number) => i - j);
    }

    if (!Util.isDefined(this.quickFilterColumns)) {
      this.quickFilterColumns = this.columns;
    }
    this.quickFilterColArray = Util.parseArray(this.quickFilterColumns, true);

    if (this.state.hasOwnProperty('currentPage')) {
      this.currentPage = this.state['currentPage'];
    }

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

  public ngAfterViewInit(): void {
    super.afterViewInit();
    this.setGridItemDirectivesData();
    if (this.searchInputComponent) {
      this.registerQuickFilter(this.searchInputComponent);
    }
  }

  public ngAfterViewChecked(): void {
    this.subscription.add(this.media.subscribe((change: MediaChange) => {
      switch (change.mqAlias) {
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
    }));
  }

  public ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    super.ngOnChanges(changes);
  }

  public reloadData(): void {
    if (!this.pageable) {
      this.filterData();
    } else {
      let queryArgs: OQueryDataArgs = {};
      queryArgs = {
        offset: this.paginationControls ? (this.currentPage * this.queryRows) : 0,
        length: Math.max(this.queryRows, this.dataResponseArray.length),
        replace: true
      };
      this.queryData(void 0, queryArgs);
    }
  }

  public reloadPaginatedDataFromStart(): void {
    this.currentPage = 0;
    this.dataResponseArray = [];
    this.reloadData();
  }


  public setDataArray(data: any): void {
    if (Util.isArray(data)) {
      this.dataResponseArray = data;
    } else if (Util.isObject(data)) {
      this.dataResponseArray = [data];
    } else {
      console.warn('Component has received not supported service data. Supported data are Array or Object');
      this.dataResponseArray = [];
    }
    this.filterData();
  }

  /**
   * Filters data locally
   * @param value the filtering value
   */
  public filterData(value?: string, loadMore?: boolean): void {
    value = Util.isDefined(value) ? value : Util.isDefined(this.quickFilterComponent) ? this.quickFilterComponent.getValue() : void 0;
    if (this.state && Util.isDefined(value)) {
      this.state.filterValue = value;
    }
    if (this.pageable) {
      const queryArgs: OQueryDataArgs = {
        offset: 0,
        length: this.queryRows,
        replace: true
      };
      this.queryData(void 0, queryArgs);
      return;
    }

    if (this.dataResponseArray && this.dataResponseArray.length > 0) {
      let filteredData = this.dataResponseArray.slice(0);
      if (value && value.length > 0) {
        const caseSensitive = this.isFilterCaseSensitive();
        const self = this;

        filteredData = filteredData.filter(item => {
          return self.getQuickFilterColumns().some(col => {
            const regExpStr = Util.escapeSpecialCharacter(Util.normalizeString(value, !caseSensitive));
            return new RegExp(regExpStr).test(Util.normalizeString(item[col] + '', !caseSensitive));
          });

        });
      }
      if (Util.isDefined(this.sortColumnOrder)) {
        // Simple sorting
        const sort = this.sortColumnOrder;
        const factor = (sort.ascendent ? 1 : -1);
        // filteredData = filteredData.sort((a, b) => (Util.normalizeString(a[sort.columnName]) > Util.normalizeString(b[sort.columnName])) ? (1 * factor) : (Util.normalizeString(b[sort.columnName]) > Util.normalizeString(a[sort.columnName])) ? (-1 * factor) : 0);
        filteredData.sort((a, b) => {
          const aOp = isNaN(a[sort.columnName]) ? Util.normalizeString(a[sort.columnName]) : a[sort.columnName];
          const bOp = isNaN(b[sort.columnName]) ? Util.normalizeString(b[sort.columnName]) : b[sort.columnName];
          return (aOp > bOp) ? (1 * factor) : (bOp > aOp) ? (-1 * factor) : 0;
        });
      }
      if (this.paginationControls) {
        this.dataArray = filteredData.splice(this.currentPage * this.queryRows, this.queryRows);
      } else {
        this.dataArray = filteredData.splice(0, this.queryRows * (this.currentPage + 1));
      }
    } else {
      this.dataArray = this.dataResponseArray;
    }
  }

  public registerGridItem(item: OGridItemDirective): void {
    if (item) {
      const self = this;
      if (self.detailMode === Codes.DETAIL_MODE_CLICK) {
        item.onClick(gridItem => self.onItemDetailClick(gridItem));
      }
      if (Codes.isDoubleClickMode(self.detailMode)) {
        item.onDoubleClick(gridItem => self.onItemDetailDblClick(gridItem));
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

  public getQueryArguments(filter: Object, ovrrArgs?: OQueryDataArgs): any[] {
    const queryArguments = super.getQueryArguments(filter, ovrrArgs);
    // queryArguments[3] = this.getSqlTypesForFilter(queryArguments[1]);
    if (this.pageable && Util.isDefined(this.sortColumn)) {
      queryArguments[6] = this.sortColumnOrder ? [this.sortColumnOrder] : this.sortColumnOrder;
    }
    return queryArguments;
  }

  public parseSortColumn(): void {
    const parsed = (ServiceUtils.parseSortColumns(this.sortColumn) || [])[0];
    const exists = parsed ? this.sortableColumns.find((item: ISQLOrder) => (item.columnName === parsed.columnName) && (item.ascendent === parsed.ascendent)) : false;
    if (exists) {
      this.sortColumnOrder = parsed;
    }
  }

  get currentOrderColumn(): number {
    if (!Util.isDefined(this.sortColumnOrder)) {
      return undefined;
    }
    let index;
    this.sortableColumns.forEach((item: ISQLOrder, i: number) => {
      if ((item.columnName === this.sortColumnOrder.columnName) &&
        (item.ascendent === this.sortColumnOrder.ascendent)) {
        index = i;
      }
    });
    return index;
  }

  set currentOrderColumn(val: number) {
    this.sortColumnOrder = this.sortableColumns[val];
  }

  public onChangePage(e: PageEvent): void {
    if (!this.pageable) {
      this.currentPage = e.pageIndex;
      this.queryRows = e.pageSize;
      this.filterData();
      return;
    }
    const tableState = this.state;

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
      newStartRecord = Math.max(tableState.queryRecordOffset, (this.currentPage * this.queryRows));
      const newEndRecord = Math.min(newStartRecord + this.queryRows, tableState.totalQueryRecordsNumber);
      queryLength = Math.min(this.queryRows, newEndRecord - newStartRecord);
    }

    const queryArgs: OQueryDataArgs = {
      offset: newStartRecord,
      length: queryLength
    };
    this.queryData(void 0, queryArgs);
  }

  public getDataToStore(): Object {
    const dataToStore = super.getDataToStore();
    dataToStore['currentPage'] = this.currentPage;

    if (this.storePaginationState) {
      dataToStore['queryRecordOffset'] = Math.max(
        (this.state.queryRecordOffset - this.dataArray.length),
        (this.state.queryRecordOffset - this.queryRows)
      );
    } else {
      delete dataToStore['queryRecordOffset'];
    }

    if (Util.isDefined(this.sortColumnOrder)) {
      dataToStore['sort-column'] = this.sortColumnOrder.columnName + Codes.COLUMNS_ALIAS_SEPARATOR +
        (this.sortColumnOrder.ascendent ? Codes.ASC_SORT : Codes.DESC_SORT);
    }
    return dataToStore;
  }

  public getSortOptionText(col: ISQLOrder): string {
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

  protected setData(data: any, sqlTypes?: any, replace?: boolean): void {
    if (Util.isArray(data)) {
      let dataArray = data;
      let respDataArray = data;
      if (!replace) {
        if (this.pageable) {
          dataArray = this.paginationControls ? data : (this.dataArray || []).concat(data);
          respDataArray = this.paginationControls ? data : (this.dataResponseArray || []).concat(data);
        } else {
          dataArray = data.slice(this.paginationControls ? ((this.queryRows * (this.currentPage + 1)) - this.queryRows) : 0, this.queryRows * (this.currentPage + 1));
          respDataArray = data;
        }
      }
      this.dataArray = dataArray;
      this.dataResponseArray = respDataArray;
      if (!this.pageable) {
        this.filterData();
      }
    } else {
      this.dataArray = [];
      this.dataResponseArray = [];
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
    if (this.pageable) {
      ObservableWrapper.callEmit(this.onPaginatedDataLoaded, data);
    }
    ObservableWrapper.callEmit(this.onDataLoaded, this.dataResponseArray);
  }

  protected saveDataNavigationInLocalStorage(): void {
    super.saveDataNavigationInLocalStorage();
    this.storePaginationState = true;
  }

  protected setGridItemDirectivesData(): void {
    const self = this;
    this.gridItemDirectives.changes.subscribe(() => {
      this.gridItemDirectives.toArray().forEach((element: OGridItemDirective, index) => {
        element.setItemData(self.dataArray[index]);
        element.setGridComponent(self);
        self.registerGridItem(element);
      });
    });
  }

}

@NgModule({
  declarations: [OGridComponent, OGridItemDirective],
  imports: [CommonModule, OGridItemModule, OSearchInputModule, OSharedModule, RouterModule],
  exports: [OGridComponent, OGridItemComponent, OGridItemDirective],
  entryComponents: [OGridItemComponent]
})
export class OGridModule { }
