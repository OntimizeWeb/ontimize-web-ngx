import {
  Component, OnInit, Inject, Injector, AfterContentInit, ContentChildren,
  ViewChild, QueryList, Optional, forwardRef,
  NgModule, ModuleWithProviders, ViewEncapsulation, EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ObservableWrapper } from '../../util/async';
import { Observable } from 'rxjs/Observable';

import { MdCheckbox } from '@angular/material';
import { MdListModule, MdIconModule, MdToolbarModule, MdButtonModule, MdProgressCircleModule } from '@angular/material';

import { OntimizeService, AuthGuardService, OTranslateService, LocalStorageService } from '../../services';
import { dataServiceFactory } from '../../services/data-service.provider';
import { OSearchInputModule, OSearchInputComponent } from '../search-input/o-search-input.component';
import { OListItemModule } from './o-list-item.component';
import { OFormComponent } from '../form/o-form.component';
import { InputConverter } from '../../decorators';
import { Util } from '../../util/util';
import { IList } from '../../interfaces';
import { OListItemComponent } from './o-list-item.component';
import { OListItemDirective } from './o-list-item.directive';
import { OTranslateModule } from '../../pipes/o-translate.pipe';

import { Subscription } from 'rxjs/Subscription';

import { ILocalStorageComponent } from '../../interfaces';

export const DEFAULT_INPUTS_O_LIST = [
  // attr [string]: list identifier. It is mandatory if data are provided through the data attribute. Default: entity (if set).
  'oattr: attr',

  'title',

  // visible [no|yes]: visibility. Default: yes.
  'visible',

  // enabled [no|yes]: editability. Default: yes.
  'oenabled: enabled',

  // quick-filter [no|yes]: show quick filter. Default: yes.
  'quickFilter: quick-filter',

  // quick-filter-columns [string]: columns of the filter, separated by ';'. Default: no value.
  'quickFilterColumns: quick-filter-columns',

  //controls [string][yes|no|true|false]:
  'controls',

  // refresh-button [no|yes]: show refresh button. Default: yes.
  'refreshButton: refresh-button',

  // query-on-init [no|yes]: query table on init. Default: yes.
  'queryOnInit: query-on-init',

  'pageable',

  'cssClass: css-class',

  // columns [string]: columns of the entity, separated by ';'. Default: no value.
  'columns',

  // parent-keys [string]: parent keys to filter, separated by ';'. Default: no value.
  'parentKeys: parent-keys',

  // entity [string]: entity of the service. Default: no value.
  'entity',

  'service',

  // keys [string]: entity keys, separated by ';'. Default: no value.
  'keys',

  'route',

  //static-data [Array<any>] : way to populate with static data. Default: no value.
  'listData: static-data',

  // paginated-query-method [string]: name of the service method to perform paginated queries. Default: advancedQuery.
  'paginatedQueryMethod : paginated-query-method',

  // query-rows [number]: number of rows per page. Default: 10.
  'queryRows: query-rows',

  // query-method [string]: name of the service method to perform queries. Default: query.
  'queryMethod: query-method',

  // detail-mode [none|click|doubleclick]: way to open the detail form of a row. Default: 'none'.
  'detailMode: detail-mode',

  // detail-form-route [string]: route of detail form. Default: 'detail'.
  'detailFormRoute: detail-form-route',

  // recursive-detail [no|yes]: do not append detail keys when navigate (overwrite current). Default: no.
  'recursiveDetail: recursive-detail',

  // detail-button-in-row [no|yes]: adding a button in row for opening detail form. Default: yes.
  'detailButtonInRow: detail-button-in-row',

  // detail-button-in-row-icon [string]: material icon. Default: mode_edit.
  'detailButtonInRowIcon: detail-button-in-row-icon',

  // edit-form-route [string]: route of edit form. Default: 'edit'.
  'editFormRoute: edit-form-route',

  // recursive-edit [no|yes]: do not append detail keys when navigate (overwrite current). Default: no.
  'recursiveEdit: recursive-edit',

  // edit-button-in-row [no|yes]: adding a button in row for opening edition form. Default: no.
  'editButtonInRow: edit-button-in-row',

  // edit-button-in-row-icon [string]: material icon. Default: search.
  'editButtonInRowIcon: edit-button-in-row-icon',

  'selectable'
];

export const DEFAULT_OUTPUTS_O_LIST = [
  'onChange'
];

@Component({
  selector: 'o-list',
  templateUrl: 'list/o-list.component.html',
  styleUrls: ['list/o-list.component.css'],
  providers: [
    { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] }
  ],
  inputs: [
    ...DEFAULT_INPUTS_O_LIST
  ],
  outputs: [
    ...DEFAULT_OUTPUTS_O_LIST
  ],
  encapsulation: ViewEncapsulation.None
})
export class OListComponent implements OnInit, IList, AfterContentInit, ILocalStorageComponent {

  public static DEFAULT_INPUTS_O_LIST = DEFAULT_INPUTS_O_LIST;
  public static DEFAULT_OUTPUTS_O_LIST = DEFAULT_OUTPUTS_O_LIST;
  public static DEFAULT_QUERY_ROWS = 10;
  public static DEFAULT_DETAIL_MODE = 'none';
  public static DETAIL_MODE_CLICK = 'click';
  public static DETAIL_MODE_DBLCLICK = 'dblclick';

  public static DEFAULT_DETAIL_ICON = 'chevron_right';
  public static DEFAULT_EDIT_ICON = 'mode_edit';

  public loading: boolean = false;
  protected authGuardService: AuthGuardService;
  protected translateService: OTranslateService;
  protected localStorageService: LocalStorageService;

  @InputConverter()
  controls: boolean = true;
  @InputConverter()
  quickFilter: boolean = true;
  @InputConverter()
  queryOnInit: boolean = true;
  @InputConverter()
  refreshButton: boolean = true;
  @InputConverter()
  pageable: boolean = false;
  @InputConverter()
  visible: boolean = true;
  @InputConverter()
  oenabled: boolean = true;
  @InputConverter()
  recursiveDetail: boolean = false;
  @InputConverter()
  detailButtonInRow: boolean = true;
  @InputConverter()
  recursiveEdit: boolean = false;
  @InputConverter()
  editButtonInRow: boolean = false;
  @InputConverter()
  selectable: boolean = false;

  protected oattr: string;
  protected title: string;
  protected cssclass: string;
  protected columns: string;
  protected quickFilterColumns: string;
  protected parentKeys: string;
  protected entity: string;
  protected service: string;
  protected keys: string;
  protected dataKeys: Array<string>;
  protected dataParentKeys: {};
  protected parentItem: any;
  protected route: string;
  protected onFormDataSubscribe: any;

  protected detailMode: string;
  protected detailFormRoute: string;
  protected detailButtonInRowIcon: string;
  protected editFormRoute: string;
  protected editButtonInRowIcon: string;
  protected state: any;
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

  protected dataArray: any[] = [];
  protected listData: any[] = null;
  protected dataColumns: string[] = [];
  protected quickFilterColArray: string[];

  protected dataService: any;

  protected loaderSuscription: Subscription;
  protected querySuscription: Subscription;
  protected queryMethod: string;
  protected paginatedQueryMethod: string;
  protected queryRows: any;

  protected onLanguageChangeSubscribe: any;
  protected onRouteChangeStorageSubscribe: any;

  protected dataSelected: any[] = [];

  constructor(
    protected _router: Router,
    protected _actRoute: ActivatedRoute,
    protected _injector: Injector,
    @Optional() @Inject(forwardRef(() => OFormComponent)) protected form: OFormComponent) {

    this.authGuardService = this._injector.get(AuthGuardService);
    this.translateService = this._injector.get(OTranslateService);
    this.localStorageService = this._injector.get(LocalStorageService);

    this.detailMode = OListComponent.DEFAULT_DETAIL_MODE;

    var self = this;
    this.onLanguageChangeSubscribe = this.translateService.onLanguageChanged.subscribe(
      res => {
        console.log('OListComponent TODO onLanguageChangeSubscribe');
      }
    );
    this.onRouteChangeStorageSubscribe = this.localStorageService.onRouteChange.subscribe(
      res => {
        self.localStorageService.updateComponentStorage(self);
      }
    );
  }

  getComponentKey(): string {
    return 'OListComponent_' + this.oattr;
  }

  getDataToStore(): Object {
    return this.state;
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

  getKeys() {
    return this.dataKeys;
  }

  ngOnInit(): void {
    if (typeof (this.oattr) === 'undefined') {
      if (typeof (this.entity) !== 'undefined') {
        this.oattr = this.entity.replace('.', '_');
      }
    }

    if (typeof (this.title) !== 'undefined') {
      this.title = this.translateService.get(this.title);
    }

    this.authGuardService.getPermissions(this._router.url, this.oattr)
      .then(
      permissions => {
        if (typeof (permissions) !== 'undefined') {
          if (this.visible && permissions.visible === false) {
            this.visible = false;
          }
          if (this.oenabled && permissions.enabled === false) {
            this.oenabled = false;
          }
        }
      }
      );

    this.dataColumns = Util.parseArray(this.columns);

    if (this.quickFilterColumns) {
      this.quickFilterColArray = Util.parseArray(this.quickFilterColumns);
    } else {
      this.quickFilterColArray = this.dataColumns;
    }

    let pkArray = Util.parseArray(this.parentKeys);
    this.dataParentKeys = Util.parseParentKeysEquivalences(pkArray);

    if (this.keys) {
      this.dataKeys = Util.parseArray(this.keys);
    } else {
      this.dataKeys = [];
    }

    if (this.listData) {
      this.setData(this.listData);
    } else {
      this.configureService();
    }

    if (this.form) {
      this.setFormComponent(this.form);
    }

    if (!this.queryMethod) {
      this.queryMethod = 'query';
    }
    if (!this.paginatedQueryMethod) {
      this.paginatedQueryMethod = 'advancedQuery';
    }
    if (this.queryRows) {
      this.queryRows = parseInt(this.queryRows);
    } else {
      this.queryRows = OListComponent.DEFAULT_QUERY_ROWS;
    }

    if (!this.detailButtonInRowIcon) {
      this.detailButtonInRowIcon = OListComponent.DEFAULT_DETAIL_ICON;
    }

    if (!this.editButtonInRowIcon) {
      this.editButtonInRowIcon = OListComponent.DEFAULT_EDIT_ICON;
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

  public ngOnDestroy() {
    this.onLanguageChangeSubscribe.unsubscribe();
    this.onRouteChangeStorageSubscribe.unsubscribe();
  }

  configureService() {
    this.dataService = this._injector.get(OntimizeService);

    if (Util.isDataService(this.dataService)) {
      let serviceCfg = this.dataService.getDefaultServiceConfiguration(this.service);
      if (this.entity) {
        serviceCfg['entity'] = this.entity;
      }
      this.dataService.configureService(serviceCfg);
    }
  }

  ngAfterViewInit() {
    if (this.searchInputComponent) {
      this.registerSearchInput(this.searchInputComponent);
    }
  }

  ngAfterContentInit() {
    var self = this;
    this.listItemComponents.changes.subscribe(() => {
      self.listItemComponents.forEach(function (element: OListItemComponent, index, array) {
        element.setItemData(self.dataArray[index]);
      });
    });

    this.listItemDirectives.changes.subscribe(() => {
      self.listItemDirectives.forEach(function (element: OListItemDirective, index, array) {
        element.setItemData(self.dataArray[index]);
        element.setListComponent(self);
        self.registerListItemDirective(element);
      });
    });
  }

  registerListItemDirective(item: OListItemDirective) {
    if (item) {
      var self = this;
      if (this.detailMode === OListComponent.DETAIL_MODE_CLICK) {
        item.onClick(directiveItem => {
          self.onItemDetailClick(directiveItem);
        });
      }
      if (this.detailMode === OListComponent.DETAIL_MODE_DBLCLICK) {
        item.onDblClick(directiveItem => {
          self.onItemDetailDblClick(directiveItem);
        });
      }
    }
  }

  onItemDetailClick(item: OListItemDirective | OListItemComponent) {
    if (this.oenabled && this.detailMode === OListComponent.DETAIL_MODE_CLICK) {
      this.viewDetail(item.getItemData());
      ObservableWrapper.callEmit(this.mdClick, item);
    }
  }

  onItemDetailDblClick(item: OListItemDirective | OListItemComponent) {
    if (this.oenabled && this.detailMode === OListComponent.DETAIL_MODE_DBLCLICK) {
      this.viewDetail(item.getItemData());
      ObservableWrapper.callEmit(this.mdDblClick, item);
    }
  }

  setData(data: any) {
    this.dataArray = data;
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
      let queryArguments = [filter, this.dataColumns, this.entity];
      if (this.pageable) {
        let queryOffset = (ovrrArgs && ovrrArgs.hasOwnProperty('offset')) ? ovrrArgs.offset : this.state.queryRecordOffset;
        let queryRowsN = (ovrrArgs && ovrrArgs.hasOwnProperty('length')) ? ovrrArgs.length : this.queryRows;
        queryArguments = queryArguments.concat([undefined, queryOffset, queryRowsN, undefined]);
      }
      var self = this;
      this.querySuscription = this.dataService[queryMethodName].apply(this.dataService, queryArguments)
        .subscribe(res => {
          let data = undefined;
          if (($ as any).isArray(res)) {
            data = res;
          } else if ((res.code === 0) && ($ as any).isArray(res.data)) {
            data = res.data;
            if (this.pageable) {
              this.updatePaginationInfo(res);
            }
          }
          // set list data
          if (($ as any).isArray(data)) {
            let dataArray = data;
            if (self.pageable && !(ovrrArgs && ovrrArgs['replace'])) {
              dataArray = (self.listData || []).concat(data);
            }

            let selectedIndexes = self.state.selectedIndexes || [];
            for (let i = 0; i < selectedIndexes.length; i++) {
              if (selectedIndexes[i] < self.listData.length) {
                self.dataSelected.push(self.listData[selectedIndexes[i]]);
              }
            }

            self.listData = dataArray;
            self.filterData(self.state.filterValue);
          }
          self.loaderSuscription.unsubscribe();
          if (self.pageable) {
            ObservableWrapper.callEmit(self.onPaginatedListDataLoaded, data);
          }
          ObservableWrapper.callEmit(self.onListDataLoaded, self.listData);
        }, err => {
          console.log('[OList.queryData]: error', err);
          self.loaderSuscription.unsubscribe();
        });
    }
  }

  updatePaginationInfo(queryRes: any) {
    let resultEndIndex = queryRes.startRecordIndex + queryRes.data.length;
    if (queryRes.startRecordIndex !== undefined) {
      this.state.queryRecordOffset = resultEndIndex;
    }
    if (queryRes.totalQueryRecordsNumber !== undefined) {
      this.state.queryTotalRecordNumber = queryRes.totalQueryRecordsNumber;
    }
  }

  setParentKeyValues(filter: Object) {
    if (this.dataParentKeys && this.parentItem) {
      for (let key in this.dataParentKeys) {
        if (this.parentItem.hasOwnProperty(key)) {
          filter[this.dataParentKeys[key]] = this.parentItem[key];
        }
      }
    }
  }

  onReload() {
    let queryArgs = {};
    if (this.pageable) {
      this.state.queryRecordOffset = 0;
      queryArgs = {
        length: this.listData.length,
        replace: true
      };
    }
    if (this.selectable) {
      this.dataSelected = [];
      this.state.selectedIndexes = [];
    }
    this.queryData({}, queryArgs);
  }

  protected getRouteOfSelectedRow(item: any, modeRoute: any) {
    let route = [];
    // TODO: multiple keys
    let filter = undefined;
    if (typeof (item) === 'object') {
      for (let k = 0; k < this.dataKeys.length; ++k) {
        let key = this.dataKeys[k];
        filter = item[key];
      }
    }
    if (typeof (filter) !== 'undefined') {
      if (modeRoute) {
        route.push(modeRoute);
      }
      route.push(filter);
    }
    return route;
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
    this.state.filterValue = value;
    if (value && value.length > 0 && this.listData && this.listData.length > 0) {
      var _val = this.configureFilterValue(value);

      var self = this;
      //var filteredData: any[] = [];
      var filteredData = this.listData.filter(item => {
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
      this.setData(filteredData);
    } else {
      this.setData(this.listData);
    }
  }

  public load(): any {
    var self = this;
    var loadObservable = new Observable(observer => {
      var timer = window.setTimeout(() => {
        observer.next(true);
      }, 250);

      return () => {
        window.clearTimeout(timer);
        self.loading = false;
      };

    });
    var subscription = loadObservable.subscribe(val => {
      self.loading = val as boolean;
    });
    return subscription;
  }

  public setFormComponent(form: OFormComponent) {
    var self = this;
    this.onFormDataSubscribe = this.form.onFormDataLoaded.subscribe(data => {
      self.parentItem = data;
      self.queryData();
    }
    );

    let dataValues = this.form.getDataValues();
    if (dataValues && Object.keys(dataValues).length > 0) {
      self.parentItem = dataValues;
      self.queryData();
    } else {
      //this.filterForm = true;
    }
  }

  getSelectedItems(): any[] {
    return this.dataSelected;
  }

  isItemSelected(item) {
    let result = this.dataSelected.find(current => {
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
      let idx = this.dataSelected.indexOf(item);
      let wasSelected = idx > -1;
      if (wasSelected) {
        this.dataSelected.splice(idx, 1);
      } else {
        this.dataSelected.push(item);
      }
      this.updateSelectedState(item, !wasSelected);
      return !wasSelected;
    }
  }

  updateSelectedState(item: Object, isSelected: boolean) {
    let selectedIndexes = this.state.selectedIndexes || [];
    let itemIndex = this.listData.indexOf(item);
    if (isSelected && selectedIndexes.indexOf(itemIndex) === -1) {
      selectedIndexes.push(itemIndex);
    } else if (!isSelected) {
      selectedIndexes.splice(selectedIndexes.indexOf(itemIndex), 1);
    }
    this.state.selectedIndexes = selectedIndexes;
  }

  onScroll($event: Event): void {
    let pendingRegistries = this.listData.length < this.state.queryTotalRecordNumber;
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

  viewDetail(item: any): void {
    let route = this.getRouteOfSelectedRow(item, this.detailFormRoute);
    if (route.length > 0) {
      this._router.navigate(route,
        {
          relativeTo: this.recursiveDetail ? this._actRoute.parent : this._actRoute,
          queryParams: {
            'isdetail': 'true'
          }
        }
      );
    }
  }

  public editDetail(item: any) {
    let route = this.getRouteOfSelectedRow(item, this.editFormRoute);
    if (route.length > 0) {
      route.push('edit');
      this._router.navigate(
        route,
        {
          relativeTo: this.recursiveEdit ? this._actRoute.parent : this._actRoute,
          queryParams: {
            'isdetail': 'true'
          }
        }
      );
    }
  }
}

@NgModule({
  declarations: [OListComponent],
  imports: [CommonModule, MdListModule, MdToolbarModule, MdIconModule, MdButtonModule, OListItemModule, OSearchInputModule, MdProgressCircleModule, OTranslateModule],
  exports: [OListComponent],
  entryComponents: [MdCheckbox]
})
export class OListModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OListModule,
      providers: []
    };
  }
}
