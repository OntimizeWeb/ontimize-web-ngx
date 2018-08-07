import { AfterContentInit, Component, ContentChildren, ElementRef, EventEmitter, forwardRef, Inject, Injector, NgModule, OnChanges, OnInit, Optional, QueryList, SimpleChange, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCheckbox } from '@angular/material';
import { Observable } from 'rxjs';

import { Util, Codes } from '../../utils';
import { OSharedModule } from '../../shared';
import { ServiceUtils } from '../service.utils';
import { OntimizeService } from '../../services';
import { InputConverter } from '../../decorators';
import { ObservableWrapper } from '../../util/async';
import { OFormComponent } from '../form/o-form.component';
import { OFormDataNavigation } from '../form/form-components';
import { OServiceComponent } from '../o-service-component.class';
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
  'onListDataLoaded',
  'onPaginatedListDataLoaded'
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
  selector: 'o-list',
  providers: [
    { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] }
  ],
  inputs: DEFAULT_INPUTS_O_LIST,
  outputs: DEFAULT_OUTPUTS_O_LIST,
  templateUrl: './o-list.component.html',
  styleUrls: ['./o-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OListComponent extends OServiceComponent implements OnInit, IList, AfterContentInit, OnChanges {

  public static DEFAULT_INPUTS_O_LIST = DEFAULT_INPUTS_O_LIST;
  public static DEFAULT_OUTPUTS_O_LIST = DEFAULT_OUTPUTS_O_LIST;

  /* Inputs */
  @InputConverter()
  quickFilter: boolean = true;
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
  searchInputComponent: OSearchInputComponent;

  public onClick: EventEmitter<any> = new EventEmitter();
  public onDoubleClick: EventEmitter<any> = new EventEmitter();
  public onInsertButtonClick: EventEmitter<any> = new EventEmitter();
  public onItemDeleted: EventEmitter<any> = new EventEmitter();
  public onListDataLoaded: EventEmitter<any> = new EventEmitter();
  public onPaginatedListDataLoaded: EventEmitter<any> = new EventEmitter();

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

  registerSearchInput(input: OSearchInputComponent) {
    if (input && this.quickFilter) {
      var self = this;
      input.onSearch.subscribe(val => {
        self.filterData(val);
      });
    }
  }

  public onListItemClicked(onNext: (item: OListItemDirective) => void): Object {
    return ObservableWrapper.subscribe(this.onClick, onNext);
  }

  ngOnInit(): void {
    this.initialize();
  }

  public ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (typeof (changes['staticData']) !== 'undefined') {
      this.dataResponseArray = changes['staticData'].currentValue;
      let filter = (this.state && this.state.filterValue) ? this.state.filterValue : undefined;
      this.filterData(filter);
    }
  }

  reinitialize(options: OListInitializationOptions) {
    super.reinitialize(options);
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
      let queryArgs = {
        offset: 0,
        length: initialQueryLength || this.queryRows
      };
      this.queryData(this.parentItem, queryArgs);
    }
  }

  ngOnDestroy() {
    this.destroy();
  }

  destroy() {
    super.destroy();
    this.onRouteChangeStorageSubscribe.unsubscribe();
  }

  ngAfterViewInit() {
    if (this.searchInputComponent) {
      this.registerSearchInput(this.searchInputComponent);
    }
  }

  getDense() {
    return this.odense || undefined;
  }

  protected setListItemsData() {
    var self = this;
    this.listItemComponents.forEach(function (element: OListItemComponent, index) {
      element.setItemData(self.dataResponseArray[index]);
    });
  }

  protected setListItemDirectivesData() {
    var self = this;
    this.listItemDirectives.forEach(function (element: OListItemDirective, index) {
      element.setItemData(self.dataResponseArray[index]);
      element.setListComponent(self);
      self.registerListItemDirective(element);
    });
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

  registerListItemDirective(item: OListItemDirective) {
    if (item) {
      var self = this;
      if (this.detailMode === Codes.DETAIL_MODE_CLICK) {
        item.onClick(directiveItem => {
          self.onItemDetailClick(directiveItem);
        });
      }
      if (Codes.isDoubleClickMode(this.detailMode)) {
        item.onDblClick(directiveItem => {
          self.onItemDetailDblClick(directiveItem);
        });
      }
    }
  }

  onItemDetailClick(item: OListItemDirective | OListItemComponent) {
    if (this.oenabled && this.detailMode === Codes.DETAIL_MODE_CLICK) {
      this.saveDataNavigationInLocalStorage();
      this.viewDetail(item.getItemData());
      ObservableWrapper.callEmit(this.onClick, item);
    }
  }

  onItemDetailDblClick(item: OListItemDirective | OListItemComponent) {
    if (this.oenabled && Codes.isDoubleClickMode(this.detailMode)) {
      this.saveDataNavigationInLocalStorage();
      this.viewDetail(item.getItemData());
      ObservableWrapper.callEmit(this.onDoubleClick, item);
    }
  }

  protected saveDataNavigationInLocalStorage(): void {
    // Save data of the list in navigation-data in the localstorage
    OFormDataNavigation.storeNavigationData(this.injector, this.getKeysValues());
    this.storePaginationState = true;
  }

  protected getKeysValues(): any[] {
    let data = this.dataArray;
    const _self = this;
    return data.map(function (row, i, a) {
      let obj = {};
      _self.keysArray.map(function (key, i, a) {
        if (row[key] !== undefined) {
          obj[key] = row[key];
        }
      });

      return obj;
    });
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
      this.filterData(this.state.filterValue);
    } else {
      this.setDataArray([]);
    }

    this.loaderSubscription.unsubscribe();
    if (this.pageable) {
      ObservableWrapper.callEmit(this.onPaginatedListDataLoaded, data);
    }
    ObservableWrapper.callEmit(this.onListDataLoaded, this.dataResponseArray);
  }

  /**
   *@deprecated
   */
  onReload() {
    this.reloadData();
  }

  reloadData() {
    let queryArgs = {};
    if (this.pageable) {
      this.state.queryRecordOffset = 0;
      queryArgs = {
        length: this.dataResponseArray.length,
        replace: true
      };
    }
    if (this.selectable) {
      this.selectedItems = [];
      this.state.selectedIndexes = [];
    }
    this.queryData(this.parentItem, queryArgs);
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

      returnVal = returnVal.replace(new RegExp('[a\u00E1A\u00C1]', 'gi'), '[a\u00E1A\u00C1]');
      returnVal = returnVal.replace(new RegExp('[e\u00E9E\u00C9]', 'gi'), '[e\u00E9E\u00C9]');
      returnVal = returnVal.replace(new RegExp('[i\u00EDI\u00CD]', 'gi'), '[i\u00EDI\u00CD]');
      returnVal = returnVal.replace(new RegExp('[o\u00F3O\u00D3]', 'gi'), '[o\u00F3O\u00D3]');
      returnVal = returnVal.replace(new RegExp('[u\u00FAU\u00DA]', 'gi'), '[u\u00FAU\u00DA]');
      //ñÑ
      returnVal = returnVal.replace(new RegExp('[\u00F1\u00D1]', 'gi'), '[\u00F1\u00D1]');

      returnVal = returnVal.replace(new RegExp('\\*', 'gi'), '.*');
      returnVal = returnVal.replace(new RegExp('\\+', 'gi'), '\\\\+');
      returnVal = returnVal.replace(new RegExp('\\?', 'gi'), '\\\\?');
      returnVal = returnVal.replace(new RegExp('\\(', 'gi'), '\\\\(');
      returnVal = returnVal.replace(new RegExp('\\)', 'gi'), '\\\\)');
    }

    return returnVal;
  }
  /**
   * Improve this method.
   * Filters data locally.
   *  */
  filterData(value: string): void {
    if (this.state) {
      this.state.filterValue = value;
    }
    if (value && value.length > 0 && this.dataResponseArray && this.dataResponseArray.length > 0) {
      var _val = this.configureFilterValue(value);
      var self = this;
      var filteredData = this.dataResponseArray.filter(item => {
        let found = false;
        let regExp: RegExp = new RegExp(_val, 'i');
        self.quickFilterColArray.forEach(col => {
          let current = item[col];
          if (current) {
            if (typeof current === 'string') {
              let match = regExp.exec(current.toLowerCase());
              if (match && match.length > 0) {
                found = true;
              }
            }
          }
        });
        return found;
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
          let queryArgs = {
            offset: this.state.queryRecordOffset,
            length: this.queryRows
          };
          this.queryData(this.parentItem, queryArgs);
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
            Observable.merge(filters.map((kv => this.dataService[this.deleteMethod](kv, this.entity)))).subscribe(obs => obs.subscribe(res => {
              console.log('[OList.remove]: response', res);
              ObservableWrapper.callEmit(this.onItemDeleted, selectedItems);
            }, error => {
              this.dialogService.alert('ERROR', 'MESSAGES.ERROR_DELETE');
              console.log('[OList.remove]: error', error);
            }, () => {
              console.log('[OList.remove]: success');
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

  hasTitle(): boolean {
    return this.title !== undefined;
  }

}

@NgModule({
  declarations: [OListComponent],
  imports: [CommonModule, OListItemModule, OSearchInputModule, OSharedModule, RouterModule],
  exports: [OListComponent],
  entryComponents: [MatCheckbox]
})
export class OListModule { }
