import { AfterContentInit, AfterViewInit, Component, ContentChildren, ElementRef, EventEmitter, forwardRef, Inject, Injector, NgModule, OnChanges, OnDestroy, OnInit, Optional, QueryList, SimpleChange, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCheckbox } from '@angular/material';
import { merge } from 'rxjs';

import { Codes, Util } from '../../utils';
import { OSharedModule } from '../../shared';
import { OntimizeService } from '../../services';
import { InputConverter } from '../../decorators';
import { ObservableWrapper } from '../../util/async';
import { OFormComponent } from '../form/o-form.component';
import { OQueryDataArgs, ServiceUtils } from '../service.utils';
import { OServiceComponent } from '../o-service-component.class';
import { FilterExpressionUtils } from '../filter-expression.utils';
import { OListItemModule } from './list-item/o-list-item.component';
import { OListItemComponent } from './list-item/o-list-item.component';
import { OListItemDirective } from './list-item/o-list-item.directive';
import { dataServiceFactory } from '../../services/data-service.provider';
import { OSearchInputComponent, OSearchInputModule } from '../input/search-input/o-search-input.component';

export interface IList {
  registerListItemDirective(item: OListItemDirective): void;
  getKeys(): Array<string>;
  setSelected(item: Object);
  isItemSelected(item: Object);
  detailMode: string;
}

export const DEFAULT_INPUTS_O_LIST = [
  ...OServiceComponent.DEFAULT_INPUTS_O_SERVICE_COMPONENT,

  // quick-filter [no|yes]: show quick filter. Default: yes.
  'quickFilter: quick-filter',

  // quick-filter-columns [string]: columns of the filter, separated by ';'. Default: no value.
  'quickFilterColumns: quick-filter-columns',

  // refresh-button [no|yes]: show refresh button. Default: yes.
  'refreshButton: refresh-button',

  'route',

  'selectable',

  'odense : dense',

  // delete-button [no|yes]: show delete button when user select items. Default: yes.
  'deleteButton: delete-button'
];

export const DEFAULT_OUTPUTS_O_LIST = [
  'onClick',
  'onDoubleClick',
  'onInsertButtonClick',
  'onItemDeleted',
  'onDataLoaded',
  'onPaginatedDataLoaded'
];

export interface OListInitializationOptions {
  entity?: string;
  service?: string;
  columns?: string;
  quickFilterColumns?: string;
  keys?: string;
  parentKeys?: string;
}

@Component({
  moduleId: module.id,
  selector: 'o-list',
  providers: [
    { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] }
  ],
  inputs: DEFAULT_INPUTS_O_LIST,
  outputs: DEFAULT_OUTPUTS_O_LIST,
  templateUrl: './o-list.component.html',
  styleUrls: ['./o-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-list]': 'true'
  }
})
export class OListComponent extends OServiceComponent implements AfterContentInit, AfterViewInit, IList, OnDestroy, OnInit, OnChanges {

  public static DEFAULT_INPUTS_O_LIST = DEFAULT_INPUTS_O_LIST;
  public static DEFAULT_OUTPUTS_O_LIST = DEFAULT_OUTPUTS_O_LIST;

  /* Inputs */
  get quickFilter(): boolean {
    return this._quickFilter;
  }
  set quickFilter(val: boolean) {
    val = Util.parseBoolean(String(val));
    this._quickFilter = val;
    if (val) {
      setTimeout(() => this.registerQuickFilter(this.searchInputComponent), 0);
    }
  }
  protected _quickFilter: boolean = true;
  protected quickFilterColumns: string;
  @InputConverter()
  refreshButton: boolean = true;
  protected route: string;
  @InputConverter()
  selectable: boolean = false;
  @InputConverter()
  odense: boolean = false;
  @InputConverter()
  deleteButton: boolean = true;
  /* End Inputs */

  @ContentChildren(OListItemComponent)
  listItemComponents: QueryList<OListItemComponent>;

  @ContentChildren(OListItemDirective)
  listItemDirectives: QueryList<OListItemDirective>;

  @ViewChild(OSearchInputComponent)
  protected searchInputComponent: OSearchInputComponent;
  quickFilterComponent: OSearchInputComponent;

  public onClick: EventEmitter<any> = new EventEmitter();
  public onDoubleClick: EventEmitter<any> = new EventEmitter();
  public onInsertButtonClick: EventEmitter<any> = new EventEmitter();
  public onItemDeleted: EventEmitter<any> = new EventEmitter();
  public onDataLoaded: EventEmitter<any> = new EventEmitter();
  public onPaginatedDataLoaded: EventEmitter<any> = new EventEmitter();

  protected quickFilterColArray: string[];
  protected dataResponseArray: Array<any> = [];
  protected storePaginationState: boolean = false;

  constructor(
    injector: Injector,
    elRef: ElementRef,
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent
  ) {
    super(injector, elRef, form);
  }

  getComponentKey(): string {
    return 'OListComponent_' + this.oattr;
  }

  ngOnInit(): void {
    this.initialize();
  }

  ngAfterViewInit() {
    super.afterViewInit();
    if (Util.isDefined(this.searchInputComponent)) {
      this.registerQuickFilter(this.searchInputComponent);
    }
  }

  ngAfterContentInit() {
    var self = this;
    self.setListItemsData();
    this.listItemComponents.changes.subscribe(() => {
      self.setListItemsData();
    });
    self.setListItemDirectivesData();
    this.listItemDirectives.changes.subscribe(() => {
      self.setListItemDirectivesData();
    });
  }

  ngOnDestroy() {
    this.destroy();
  }

  public ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (typeof (changes['staticData']) !== 'undefined') {
      this.dataResponseArray = changes['staticData'].currentValue;
      let filter = (this.state && this.state.filterValue) ? this.state.filterValue : undefined;
      this.filterData(filter);
    }
  }

  initialize(): void {
    super.initialize();

    if (this.staticData && this.staticData.length) {
      this.dataResponseArray = this.staticData;
    }
    if (this.quickFilterColumns) {
      this.quickFilterColArray = Util.parseArray(this.quickFilterColumns, true);
    } else {
      this.quickFilterColArray = this.colArray;
    }
    let initialQueryLength = undefined;
    if (this.state.hasOwnProperty('queryRecordOffset')) {
      initialQueryLength = this.state.queryRecordOffset;
    }
    this.state.queryRecordOffset = 0;
    if (!this.state.hasOwnProperty('totalQueryRecordsNumber')) {
      this.state.totalQueryRecordsNumber = 0;
    }
    if (this.queryOnInit) {
      let queryArgs: OQueryDataArgs = {
        offset: 0,
        length: initialQueryLength || this.queryRows
      };
      this.queryData(void 0, queryArgs);
    }
  }

  reinitialize(options: OListInitializationOptions) {
    super.reinitialize(options);
  }

  registerQuickFilter(input: OSearchInputComponent) {
    this.quickFilterComponent = input;
    if (Util.isDefined(this.quickFilterComponent)) {
      if (this.state.hasOwnProperty('filterValue')) {
        this.quickFilterComponent.setValue(this.state.filterValue);
      }
      this.quickFilterComponent.onSearch.subscribe(val => this.filterData(val));
    }
  }

  registerListItemDirective(item: OListItemDirective) {
    if (item) {
      var self = this;
      item.onClick(directiveItem => {
        self.onItemDetailClick(directiveItem);
      });
      item.onDoubleClick(directiveItem => {
        self.onItemDetailDoubleClick(directiveItem);
      });
    }
  }

  getDense() {
    return this.odense || undefined;
  }

  protected setListItemsData() {
    var self = this;
    this.listItemComponents.forEach((element: OListItemComponent, index) => {
      element.setItemData(self.dataResponseArray[index]);
    });
  }

  protected setListItemDirectivesData() {
    var self = this;
    this.listItemDirectives.forEach((element: OListItemDirective, index) => {
      element.setItemData(self.dataResponseArray[index]);
      element.setListComponent(self);
      self.registerListItemDirective(element);
    });
  }

  public onListItemClicked(onNext: (item: OListItemDirective) => void): Object {
    return ObservableWrapper.subscribe(this.onClick, onNext);
  }

  public onItemDetailClick(item: OListItemDirective | OListItemComponent) {
    let data = item.getItemData();
    if (this.oenabled && this.detailMode === Codes.DETAIL_MODE_CLICK) {
      this.saveDataNavigationInLocalStorage();
      this.viewDetail(data);
    }
    ObservableWrapper.callEmit(this.onClick, data);
  }

  public onItemDetailDoubleClick(item: OListItemDirective | OListItemComponent) {
    let data = item.getItemData();
    if (this.oenabled && Codes.isDoubleClickMode(this.detailMode)) {
      this.saveDataNavigationInLocalStorage();
      this.viewDetail(data);
    }
    ObservableWrapper.callEmit(this.onDoubleClick, data);
  }

  protected saveDataNavigationInLocalStorage(): void {
    super.saveDataNavigationInLocalStorage();
    this.storePaginationState = true;
  }

  getDataToStore(): Object {
    let dataToStore = super.getDataToStore();
    if (!this.storePaginationState) {
      delete dataToStore['queryRecordOffset'];
    }
    return dataToStore;
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
        this.filterData(this.state.filterValue);
      } else {
        this.setDataArray(this.dataResponseArray);
      }
    } else {
      this.setDataArray([]);
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
    if (this.pageable) {
      ObservableWrapper.callEmit(this.onPaginatedDataLoaded, data);
    }
    ObservableWrapper.callEmit(this.onDataLoaded, this.dataResponseArray);
  }

  reloadData() {
    let queryArgs: OQueryDataArgs = {};
    if (this.pageable) {
      this.state.queryRecordOffset = 0;
      queryArgs = {
        length: Math.max(this.queryRows, this.dataResponseArray.length),
        replace: true
      };
    }
    if (this.selectable) {
      this.selectedItems = [];
      this.state.selectedIndexes = [];
    }
    this.queryData(void 0, queryArgs);
  }

  reloadPaginatedDataFromStart(): void {
    this.dataResponseArray = [];
    this.reloadData();
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

  /**
   * Filters data locally
   * @param value the filtering value
   */
  filterData(value: string): void {
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
        return self.quickFilterColArray.some(col => {
          return new RegExp('^' + Util.normalizeString(this.configureFilterValue(value)).split('*').join('.*') + '$').test(Util.normalizeString(item[col]));
        });
      });
      this.setDataArray(filteredData);
    } else {
      this.setDataArray(this.dataResponseArray);
    }
  }

  isItemSelected(item) {
    let result = this.selectedItems.find(current => {
      let itemKeys = Object.keys(item);
      let currentKeys = Object.keys(current);
      if (itemKeys.length !== currentKeys.length) {
        return false;
      }
      let found = true;
      itemKeys.forEach(key => {
        if (current.hasOwnProperty(key)) {
          if (current[key] !== item[key]) {
            found = false;
          }
        } else {
          found = false;
        }
      });
      return found;
    });
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  setSelected(item) {
    if (this.selectable) {
      let idx = this.selectedItems.indexOf(item);
      let wasSelected = idx > -1;
      if (wasSelected) {
        this.selectedItems.splice(idx, 1);
      } else {
        this.selectedItems.push(item);
      }
      this.updateSelectedState(item, !wasSelected);
      return !wasSelected;
    }
    return undefined;
  }

  updateSelectedState(item: Object, isSelected: boolean) {
    let selectedIndexes = this.state.selectedIndexes || [];
    let itemIndex = this.dataResponseArray.indexOf(item);
    if (isSelected && selectedIndexes.indexOf(itemIndex) === -1) {
      selectedIndexes.push(itemIndex);
    } else if (!isSelected) {
      selectedIndexes.splice(selectedIndexes.indexOf(itemIndex), 1);
    }
    this.state.selectedIndexes = selectedIndexes;
  }

  onScroll(e: Event): void {
    if (this.pageable) {
      let pendingRegistries = this.dataResponseArray.length < this.state.totalQueryRecordsNumber;
      if (!this.loading && pendingRegistries) {
        let element = e.target as any;
        if (element.offsetHeight + element.scrollTop + 5 >= element.scrollHeight) {
          let queryArgs: OQueryDataArgs = {
            offset: this.state.queryRecordOffset,
            length: this.queryRows
          };
          this.queryData(void 0, queryArgs);
        }
      }
    }
  }

  remove(clearSelectedItems: boolean = false) {
    let selectedItems = this.getSelectedItems();
    if (selectedItems.length > 0) {
      this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DELETE').then(res => {
        if (res === true) {
          if (this.dataService && (this.deleteMethod in this.dataService) && this.entity && (this.keysArray.length > 0)) {
            let filters = ServiceUtils.getArrayProperties(selectedItems, this.keysArray);
            merge(filters.map((kv => this.dataService[this.deleteMethod](kv, this.entity)))).subscribe(obs => obs.subscribe(res => {
              ObservableWrapper.callEmit(this.onItemDeleted, selectedItems);
            }, error => {
              this.dialogService.alert('ERROR', 'MESSAGES.ERROR_DELETE');
              console.log('[OList.remove]: error', error);
            }, () => {
              this.reloadData();
            }));
          } else {
            this.deleteLocalItems();
          }
        } else if (clearSelectedItems) {
          this.clearSelection();
        }
      });
    }
  }

  add(e?: Event) {
    this.onInsertButtonClick.emit(e);
    super.insertDetail();
  }



  getComponentFilter(existingFilter: any = {}): any {
    let filter = existingFilter;
    // Apply quick filter
    if (this.pageable && Util.isDefined(this.quickFilterComponent)) {
      const searchValue = this.quickFilterComponent.getValue();
      if (Util.isDefined(searchValue)) {
        filter[FilterExpressionUtils.BASIC_EXPRESSION_KEY] = FilterExpressionUtils.buildArrayExpressionLike(this.quickFilterColArray, searchValue);
      }
    }
    return super.getComponentFilter(filter);
  }

}

@NgModule({
  declarations: [OListComponent],
  imports: [CommonModule, OListItemModule, OSearchInputModule, OSharedModule, RouterModule],
  exports: [OListComponent],
  entryComponents: [MatCheckbox]
})
export class OListModule { }
