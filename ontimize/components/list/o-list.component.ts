import * as $ from 'jquery';
import {
  Component,
  OnChanges,
  SimpleChange,
  OnInit,
  Inject,
  Injector,
  AfterContentInit,
  ContentChildren,
  ViewChild,
  QueryList,
  Optional,
  forwardRef,
  ElementRef,
  NgModule,
  ViewEncapsulation,
  EventEmitter
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { ObservableWrapper } from '../../util/async';

import { MdCheckbox } from '@angular/material';
import { OSharedModule } from '../../shared';
import { CommonModule } from '@angular/common';
import { OntimizeService } from '../../services';
import { dataServiceFactory } from '../../services/data-service.provider';
import { OSearchInputModule, OSearchInputComponent } from '../search-input/o-search-input.component';
import { OListItemModule } from './list-item/o-list-item.component';
import { OFormComponent } from '../form/o-form.component';
import { InputConverter } from '../../decorators';
import { Util } from '../../util/util';
import { OListItemComponent } from './list-item/o-list-item.component';
import { OListItemDirective } from './list-item/o-list-item.directive';

import { OServiceComponent } from '../o-service-component.class';
import { Observable } from 'rxjs/Observable';

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

  'odense : dense'
];

export const DEFAULT_OUTPUTS_O_LIST = [
  'onChange'
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
  inputs: [
    ...DEFAULT_INPUTS_O_LIST
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_LIST
  ],
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
  /* End Inputs */

  @ContentChildren(OListItemComponent)
  listItemComponents: QueryList<OListItemComponent>;

  @ContentChildren(OListItemDirective)
  listItemDirectives: QueryList<OListItemDirective>;

  @ViewChild(OSearchInputComponent)
  searchInputComponent: OSearchInputComponent;

  public mdClick: EventEmitter<any> = new EventEmitter();
  public mdDblClick: EventEmitter<any> = new EventEmitter();

  public onListDataLoaded: EventEmitter<any> = new EventEmitter();
  public onPaginatedListDataLoaded: EventEmitter<any> = new EventEmitter();
  protected quickFilterColArray: string[];

  protected dataResponseArray: Array<any> = [];

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
    return ObservableWrapper.subscribe(this.mdClick, onNext);
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
      this.quickFilterColArray = Util.parseArray(this.quickFilterColumns);
    } else {
      this.quickFilterColArray = this.colArray;
    }

    this.state = this.localStorageService.getComponentStorage(this);
    let initialQueryLength = undefined;
    if (this.state.hasOwnProperty('queryRecordOffset')) {
      initialQueryLength = this.state.queryRecordOffset;
    }
    this.state.queryRecordOffset = 0;
    if (!this.state.hasOwnProperty('queryTotalRecordNumber')) {
      this.state.queryTotalRecordNumber = 0;
    }
    if (this.queryOnInit) {
      let queryArgs = {
        offset: 0,
        length: initialQueryLength || this.queryRows
      };
      this.queryData({}, queryArgs);
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
      if (this.detailMode === OServiceComponent.DETAIL_MODE_CLICK) {
        item.onClick(directiveItem => {
          self.onItemDetailClick(directiveItem);
        });
      }
      if (this.detailMode === OServiceComponent.DETAIL_MODE_DBLCLICK) {
        item.onDblClick(directiveItem => {
          self.onItemDetailDblClick(directiveItem);
        });
      }
    }
  }

  onItemDetailClick(item: OListItemDirective | OListItemComponent) {
    if (this.oenabled && this.detailMode === OServiceComponent.DETAIL_MODE_CLICK) {
      this.viewDetail(item.getItemData());
      ObservableWrapper.callEmit(this.mdClick, item);
    }
  }

  onItemDetailDblClick(item: OListItemDirective | OListItemComponent) {
    if (this.oenabled && this.detailMode === OServiceComponent.DETAIL_MODE_DBLCLICK) {
      this.viewDetail(item.getItemData());
      ObservableWrapper.callEmit(this.mdDblClick, item);
    }
  }

  queryData(filter: Object = {}, ovrrArgs?: any) {
    if (this.querySuscription) {
      this.querySuscription.unsubscribe();
      this.loaderSuscription.unsubscribe();
    }
    let queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
    if (this.dataService && (queryMethodName in this.dataService) && this.entity) {

      this.setParentKeyValues(filter);

      this.loaderSuscription = this.load();

      let queryArguments = this.getQueryArguments(filter, ovrrArgs);
      var self = this;
      this.querySuscription = this.dataService[queryMethodName].apply(this.dataService, queryArguments)
        .subscribe(res => {
          let data = undefined;
          if (Util.isArray(res)) {
            data = res;
          } else if ((res.code === 0) && Util.isArray(res.data)) {
            data = res.data;
            if (this.pageable) {
              this.updatePaginationInfo(res);
            }
          }
          // set list data
          if (Util.isArray(data)) {
            let respDataArray = data;
            if (self.pageable && !(ovrrArgs && ovrrArgs['replace'])) {
              respDataArray = (self.dataResponseArray || []).concat(data);
            }

            let selectedIndexes = self.state.selectedIndexes || [];
            for (let i = 0; i < selectedIndexes.length; i++) {
              if (selectedIndexes[i] < self.dataResponseArray.length) {
                self.selectedItems.push(self.dataResponseArray[selectedIndexes[i]]);
              }
            }
            self.dataResponseArray = respDataArray;
            self.filterData(self.state.filterValue);
          } else {
            self.setDataArray([]);
          }

          self.loaderSuscription.unsubscribe();
          if (self.pageable) {
            ObservableWrapper.callEmit(self.onPaginatedListDataLoaded, data);
          }
          ObservableWrapper.callEmit(self.onListDataLoaded, self.dataResponseArray);
        }, err => {
          console.log('[OList.queryData]: error', err);
          self.setDataArray([]);
          self.loaderSuscription.unsubscribe();
        });
    }
  }

  setParentKeyValues(filter: Object) {
    if (this._pKeysEquiv && this.parentItem) {
      for (let key in this._pKeysEquiv) {
        if (this.parentItem.hasOwnProperty(key)) {
          filter[this._pKeysEquiv[key]] = this.parentItem[key];
        }
      }
    }
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

  onScroll($event: Event): void {
    let pendingRegistries = this.dataResponseArray.length < this.state.queryTotalRecordNumber;
    if (!this.loading && pendingRegistries) {
      let element = $event.srcElement as any;
      if (element.offsetHeight + element.scrollTop + 5 >= element.scrollHeight) {
        let queryArgs = {
          offset: this.state.queryRecordOffset,
          length: this.queryRows
        };
        this.queryData({}, queryArgs);
      }
    }
  }

  remove(clearSelectedItems: boolean = false) {
    this.dialogService.confirm('CONFIRM', 'MESSAGES.CONFIRM_DELETE').then(
      res => {
        if (res === true) {
          if (this.dataService && (this.deleteMethod in this.dataService) && this.entity && (this.keysArray.length > 0)) {
            let filters = [];
            this.selectedItems.map(item => {
              let kv = {};
              for (let k = 0; k < this.keysArray.length; ++k) {
                let key = this.keysArray[k];
                kv[key] = item[key];
              }
              filters.push(kv);
            });

            let observable = (Observable as any).from(filters)
              .map(kv => this.dataService[this.deleteMethod](kv, this.entity)).mergeAll();
            observable.subscribe(
              res => {
                console.log('[OList.remove]: response', res);
              },
              error => {
                this.dialogService.alert('ERROR', 'MESSAGES.ERROR_DELETE');
                console.log('[OList.remove]: error', error);
              },
              () => {
                this.queryData(this.parentItem);
              }
            );
          } else {
            this.deleteLocalItems();
          }
        } else if (clearSelectedItems) {
          this.selectedItems = [];
        }
      });
  }

  protected add() {
    let route = this.getRouteOfSelectedRow(undefined, 'new');
    if (route.length > 0) {
      this.router.navigate(route,
        {
          relativeTo: this.actRoute,
        }
      );
    }
  }
}

@NgModule({
  declarations: [OListComponent],
  imports: [OSharedModule, CommonModule, OListItemModule, OSearchInputModule, RouterModule],
  exports: [OListComponent],
  entryComponents: [MdCheckbox]
})
export class OListModule {
}
