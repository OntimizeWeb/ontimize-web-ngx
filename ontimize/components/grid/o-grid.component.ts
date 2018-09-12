import { CommonModule } from "@angular/common";
import { Component, ContentChildren, ElementRef, EventEmitter, forwardRef, Inject, Injector, NgModule, OnChanges, OnDestroy, OnInit, Optional, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { RouterModule } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { OFormDataNavigation, OSearchInputComponent, OSearchInputModule } from "../../components";
import { InputConverter } from "../../decorators";
import { OntimizeService } from '../../services';
import { dataServiceFactory } from '../../services/data-service.provider';
import { OSharedModule } from '../../shared';
import { Codes, ObservableWrapper, Util } from "../../utils";
import { OFormComponent } from '../form/form-components';
import { OServiceComponent } from '../o-service-component.class';
import { OQueryDataArgs } from "../service.utils";
import { OGridItemComponent, OGridItemModule } from "./grid-item/o-grid-item.component";
import { OGridItemDirective } from "./grid-item/o-grid-item.directive";


export const DEFAULT_INPUTS_O_GRID = [
  ...OServiceComponent.DEFAULT_INPUTS_O_SERVICE_COMPONENT,
  /*cols: Amount of columns in the grid list. Default in extra small and small screen is 1, in medium screen is 2, in large screen is 3 and extra large screen is 4.  */
  'oCols:cols',
  /*page-size : Number of items to display on a page. By default set to 4.*/
  'oPageSize: page-size',
  /*page-size-options: The set of provided page size options to display to the user.*/
  'pageSizeOptions: page-size-options',
  /*show-page-size:Whether to hide the page size selection UI from the user.*/
  'showPageSize: show-page-size',
  /*show-sort:whether or not the sort select is shown in the toolbar */
  'showSort: orderable',
  // sortable[string]: columns of the filter, separated by ';'. Default: no value.
  'sortableColumns:sortable-columns',
  // sortColumns[string]: columns of the sortingcolumns, separated by ';'. Default: no value.
  'sortColumn: sort-column',
  // quick-filter [no|yes]: show quick filter. Default: yes.
  'quickFilter: quick-filter',
  //  grid-item-height[string]: Set internal representation of row height from the user-provided value.. Default: 1:1.
  'gridItemHeight: grid-item-height'

];

export const DEFAULT_OUTPUTS_O_GRID = [
  'onClick',
  'onDoubleClick',
  'onDataLoaded',
];

const SEPARATOR_COLUMNS = ';';
const PAGE_SIZE_OPTIONS = [8, 16, 24, 32, 64];
const PAGE_SIZE = 32;

@Component({
  selector: 'o-grid',
  providers: [
    { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] }
  ],
  inputs: DEFAULT_INPUTS_O_GRID,
  outputs: DEFAULT_OUTPUTS_O_GRID,
  templateUrl: './o-grid.component.html',
  styleUrls: ['./o-grid.component.scss'],
  host: {
    '[class.o-grid]': 'true'
  }
})

export class OGridComponent extends OServiceComponent implements OnDestroy, OnInit, OnChanges {
  constructor(
    injector: Injector,
    elRef: ElementRef,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent
  ) {
    super(injector, elRef, form);
    this.subscription.add(this.injector.get(ObservableMedia));
  }




  /**inputs */

  get oCols() {
    return this._oCols || this.oColsDefault;
  }

  set oCols(value: number) {
    this._oCols = value;
  }

  get pageSize() {
    return this.oPageSize || this._oPageSize;
  }

  set pageSize(value: number) {
    this.oPageSize = value;
    this.renderData();
  }

  @InputConverter()
  showPageSize: boolean = false;

  @InputConverter()
  showSort: boolean = false;


  get quickFilter(): boolean {
    return this._quickFilter;
  }

  @InputConverter()
  set quickFilter(val: boolean) {
    val = Util.parseBoolean(String(val));
    this._quickFilter = val;
    if (val) {
      setTimeout(() => this.registerQuickFilter(this.searchInputComponent), 0);
    }
  }

  public gridItemHeight = "1:1"
  public sortColumn: string;
  /*Events*/
  public onClick: EventEmitter<any> = new EventEmitter();
  public onDoubleClick: EventEmitter<any> = new EventEmitter();
  public onDataLoaded: EventEmitter<any> = new EventEmitter();

  public dataResponseArray: Array<any> = [];




  @ViewChild(OSearchInputComponent)
  protected searchInputComponent: OSearchInputComponent;

  quickFilterComponent: OSearchInputComponent;

  @ContentChildren(OGridItemComponent) inputGridItems: QueryList<OGridItemComponent>;

  @ViewChildren(OGridItemDirective)
  gridItemDirectives: QueryList<OGridItemDirective>;

  set gridItems(value: OGridItemComponent[]) {
    this._gridItems = value;
  }

  get gridItems(): OGridItemComponent[] {
    return this._gridItems;
  }

  private _oCols;
  private oColsDefault = 1;
  protected _quickFilter: boolean = true;
  protected quickFilterColumns: string;

  private subscription: Subscription = new Subscription();
  private media: ObservableMedia;
  private _gridItems: OGridItemComponent[];
  private _oPageSize = PAGE_SIZE;

  private _pageSizeOptions = PAGE_SIZE_OPTIONS;
  private oPageSize;
  private sortableColumns;



  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    super.initialize();
    this.media = this.injector.get(ObservableMedia);

    if (this.staticData && this.staticData.length) {
      this.dataResponseArray = this.staticData;
    }

    let initialQueryLength = undefined;
    if (this.queryOnInit) {
      let queryArgs: OQueryDataArgs = {
        offset: 0,
        length: initialQueryLength || this.queryRows
      };
      this.queryData(void 0, queryArgs);
    }
  }

  ngAfterContentInit(): void {
    this.gridItems = this.inputGridItems.toArray();
    this.subscription.add(this.inputGridItems.changes.subscribe((queryChanges) => {
      this.gridItems = queryChanges._results;
    }));
  };

  ngAfterViewInit() {
    if (Util.isDefined(this.searchInputComponent)) {
      this.registerQuickFilter(this.searchInputComponent);
    }
    this.setGridItemDirectivesData();
  }

  ngAfterViewChecked(): void {
    this.subscription.add(
      this.media.subscribe((change: MediaChange) => {
        switch (change.mqAlias) {
          case 'xs':
          case 'sm':
            this.oColsDefault = 1;
            break;
          case 'md':
            this.oColsDefault = 2;
            break;
          case 'lg':
          case 'xl':
            this.oColsDefault = 4;
        }
      }));
  }


  protected setGridItemDirectivesData() {
    var self = this;

    this.gridItemDirectives.changes.subscribe(() => {
      
      this.gridItemDirectives.toArray().forEach((element: OGridItemDirective, index) => {
        element.setItemData(self.dataResponseArray[index]);
        element.setGridComponent(self);
        self.registerGridItem(element);
      });
    });
  }



  reloadData() {
    let queryArgs: OQueryDataArgs = {};
    this.queryData(void 0, queryArgs);
  }


  registerQuickFilter(input: OSearchInputComponent) {
    this.quickFilterComponent = input;
    if (Util.isDefined(this.quickFilterComponent)) {
      if (this.state.hasOwnProperty('filterValue')) {
        this.quickFilterComponent.setValue(this.state.filterValue);
      }
      this.quickFilterComponent.onSearch.subscribe(val => this.renderData());
    }
  }

  /**
 * Filters data locally
 * @param value the filtering value
 */
  filterData(value: string): any[] {
    let data = [];
    if (this.state) {
      this.state.filterValue = value;
    }
    if (this.pageable) {
      let queryArgs: OQueryDataArgs = {
        offset: 0,
        length: this.queryRows,
        replace: true
      };
      this.queryData(void 0, queryArgs);
    } else if (value && value.length > 0 && this.dataResponseArray && this.dataResponseArray.length > 0) {
      var self = this;
      let filteredData = this.dataResponseArray.filter(item => {
        return self.columns.split(SEPARATOR_COLUMNS).some(col => {
          return new RegExp('^' + Util.normalizeString(this.configureFilterValue(value)).split('*').join('.*') + '$').test(Util.normalizeString(item[col]));
        });
      });
      data = filteredData;
    } else {
      data = this.dataResponseArray;

    }
    return data;

  }

  renderData() {
    let data = this.dataArray;
    if (this.quickFilterComponent) {
      data = this.filterData(this.quickFilterComponent.getValue());
    }
    data = this.sortedData(data);
    data = Object.assign([], data);
    data = this.paginatedData(data)
    this.setDataArray(data);

  }

  protected setData(data: any, sqlTypes?: any, replace?: boolean) {
    if (Util.isArray(data)) {
      let respDataArray = data;
      if (this.pageable && !replace) {
        respDataArray = (this.dataResponseArray || []).concat(data);
      }

      let selectedIndexes = this.state.selectedIndexes || [];
      for (let i = 0; i < selectedIndexes.length; i++) {
        if (selectedIndexes[i] < this.dataResponseArray.length) {
          this.selectedItems.push(this.dataResponseArray[selectedIndexes[i]]);
        }
      }
      this.dataResponseArray = respDataArray;
      if (!this.pageable) {
        this.renderData();
      } else {
        this.setDataArray(this.dataResponseArray);
      }
    } else {
      this.setDataArray([]);
    }

    this.loaderSubscription.unsubscribe();

    ObservableWrapper.callEmit(this.onDataLoaded, this.dataResponseArray);
  }


  /** Returns a sorted copy of the database data. */
  protected sortedData(data: any[]): any[] {
    if (!this.sortColumn) { return data; }
    return data.sort(this.sortFunction.bind(this));

  }

  /** Returns a sorted copy of the database data. */
  protected paginatedData(data: any[]): any[] {
    let dataPaginated = data;
    return dataPaginated.splice(0, this.pageSize);
  }

  protected sortFunction(a: any, b: any) {
    let propertyA: number | string = '';
    let propertyB: number | string = '';
    [propertyA, propertyB] = [a[this.sortColumn], b[this.sortColumn]];

    let valueA = typeof propertyA === 'undefined' ? '' : propertyA === '' ? propertyA : isNaN(+propertyA) ? propertyA.toString().trim().toLowerCase() : +propertyA;
    let valueB = typeof propertyB === 'undefined' ? '' : propertyB === '' ? propertyB : isNaN(+propertyB) ? propertyB.toString().trim().toLowerCase() : +propertyB;
    return (valueA <= valueB ? -1 : 1);
  }

  configureFilterValue(value: string) {
    let returnVal = value;
    if (value && value.length > 0) {
      if (!value.startsWith('*')) {
        returnVal = '*' + returnVal;
      }
      if (!value.endsWith('*')) {
        returnVal = returnVal + '*';
      }
    }
    return returnVal;
  }

  get pageSizeOptions(): Array<number> {
    return this._pageSizeOptions;
  }

  set pageSizeOptions(value: Array<number>) {
    this._pageSizeOptions = value;
  }


  get sortColumnsArray(): Array<string> {
    let columns = this.columns.split(SEPARATOR_COLUMNS);
    if (this.sortableColumns) {
      return this.sortableColumns.split(SEPARATOR_COLUMNS)
    }
    return columns;
  }


  registerGridItem(item: OGridItemDirective) {
    if (item) {
      var self = this;
      if (self.detailMode === Codes.DETAIL_MODE_CLICK) {
        item.onClick(gridItem => {
          self.onItemDetailClick(gridItem);
        });
      }
      if (Codes.isDoubleClickMode(self.detailMode)) {
        item.onDoubleClick(gridItem => {
          self.onItemDetailDblClick(gridItem);
        });
      }
    }
  }



  public onItemDetailClick(item: OGridItemDirective) {
    if (this.oenabled && this.detailMode === Codes.DETAIL_MODE_CLICK) {
      this.saveDataNavigationInLocalStorage();
      this.viewDetail(item.getItemData());
      ObservableWrapper.callEmit(this.onClick, item);
    }
  }

  public onItemDetailDblClick(item: OGridItemDirective) {
    if (this.oenabled && Codes.isDoubleClickMode(this.detailMode)) {
      this.saveDataNavigationInLocalStorage();
      this.viewDetail(item.getItemData());
      ObservableWrapper.callEmit(this.onDoubleClick, item);
    }
  }

  public showButtonNext() {
    return this.dataArray.length < this.dataResponseArray.length
  }
  protected saveDataNavigationInLocalStorage(): void {
    // Save data of the list in navigation-data in the localstorage
    OFormDataNavigation.storeNavigationData(this.injector, this.getKeysValues());
  }

  protected getKeysValues(): any[] {
    let data = this.dataArray;
    const self = this;
    return data.map((row) => {
      let obj = {};
      self.keysArray.map((key) => {
        if (row[key] !== undefined) {
          obj[key] = row[key];
        }
      });
      return obj;
    });
  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.destroy();
  }

  destroy() {
    super.destroy();
    this.onRouteChangeStorageSubscribe.unsubscribe();
  }

  nextData() {
    this.dataArray = this.dataArray.concat(this.dataResponseArray.slice(this.dataArray.length - 1, (this.dataArray.length + this.pageSize)));
  }
}

@NgModule({
  declarations: [OGridComponent, OGridItemDirective],
  imports: [CommonModule, OSharedModule, RouterModule, OGridItemModule, OSearchInputModule],
  exports: [OGridComponent, OGridItemComponent, OGridItemDirective],
  entryComponents: [OGridItemComponent]
})
export class OGridModule { }
