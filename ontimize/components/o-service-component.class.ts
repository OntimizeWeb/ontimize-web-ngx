import { Injector, ElementRef, NgZone, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Util } from '../utils';
import { InputConverter } from '../decorators';
import { OntimizeService, AuthGuardService, OTranslateService, LocalStorageService, DialogService } from '../services';
import { OFormComponent } from './form/o-form.component';
import { OFormValue } from './form/OFormValue';
import { OListInitializationOptions } from './list/o-list.component';
import { OFormLayoutManagerComponent } from '../layouts/form-layout/o-form-layout-manager.component';
// import { OTableInitializationOptions } from './table/o-table.component';

export interface ILocalStorageComponent {
  getDataToStore(): Object;
  getComponentKey(): string;
}

export const DEFAULT_INPUTS_O_SERVICE_COMPONENT = [
  // attr [string]: list identifier. It is mandatory if data are provided through the data attribute. Default: entity (if set).
  'oattr: attr',

  '_title: title',

  'cssClass: css-class',

  // visible [no|yes]: visibility. Default: yes.
  'ovisible: visible',

  // enabled [no|yes]: editability. Default: yes.
  'oenabled: enabled',

  //controls [string][yes|no|true|false]:
  'controls',

  // service [string]: JEE service path. Default: no value.
  'service',

  // entity [string]: entity of the service. Default: no value.
  'entity',

  // query-method [string]: name of the service method to perform queries. Default: query.
  'queryMethod: query-method',

  // paginated-query-method [string]: name of the service method to perform paginated queries. Default: advancedQuery.
  'paginatedQueryMethod : paginated-query-method',

  // delete-method [string]: name of the service method to perform deletions. Default: delete.
  'deleteMethod: delete-method',

  // query-on-init [no|yes]: query on init. Default: yes.
  'queryOnInit: query-on-init',

  // query-on-init [no|yes]: query on bind. Default: yes.
  'queryOnBind: query-on-bind',

  'pageable',

  // columns [string]: columns of the entity, separated by ';'. Default: no value.
  'columns',

  // keys [string]: entity keys, separated by ';'. Default: no value.
  'keys',

  // parent-keys [string]: parent keys to filter, separated by ';'. Default: no value.
  'parentKeys: parent-keys',

  //static-data [Array<any>] : way to populate with static data. Default: no value.
  'staticData: static-data',

  // detail-mode [none|click|doubleclick]: way to open the detail form of a row. Default: 'click'.
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

  // query-rows [number]: number of rows per page. Default: 10.
  'queryRows: query-rows',

  // insert-button [no|yes]: show insert button. Default: yes.
  'insertButton: insert-button',

  // row-height [small | medium | large]
  'rowHeight : row-height',

  'serviceType : service-type',

  // insert-form-route [string]: route of insert form. Default:
  'insertFormRoute: insert-form-route',

  // recursive-insert [no|yes]: do not append insert keys when navigate (overwrite current). Default: no.
  'recursiveInsert: recursive-insert'
];

export class OServiceComponent implements ILocalStorageComponent {

  public static DEFAULT_INPUTS_O_SERVICE_COMPONENT = DEFAULT_INPUTS_O_SERVICE_COMPONENT;

  public static DEFAULT_QUERY_METHOD = 'query';
  public static DEFAULT_PAGINATED_QUERY_METHOD = 'advancedQuery';
  public static DEFAULT_DELETE_METHOD = 'delete';
  public static DEFAULT_QUERY_ROWS = 10;
  public static DEFAULT_DETAIL_ICON = 'chevron_right';
  public static DEFAULT_EDIT_ICON = 'mode_edit';
  public static DEFAULT_ROW_HEIGHT = 'medium';
  public static AVAILABLE_ROW_HEIGHTS = ['small', 'medium', 'large'];

  public static DEFAULT_DETAIL_MODE = 'click';
  public static DETAIL_MODE_NONE = 'none';
  public static DETAIL_MODE_CLICK = 'click';
  public static DETAIL_MODE_DBLCLICK = 'dblclick';

  public static COLUMNS_ALIAS_SEPARATOR = ':';

  protected authGuardService: AuthGuardService;
  protected translateService: OTranslateService;
  protected localStorageService: LocalStorageService;
  protected dialogService: DialogService;

  /* inputs variables */
  protected oattr: string;
  title: string;
  protected _title: string;
  protected cssclass: string;
  @InputConverter()
  protected ovisible: boolean = true;
  @InputConverter()
  protected oenabled: boolean = true;
  @InputConverter()
  protected controls: boolean = true;
  protected service: string;
  protected entity: string;
  protected queryMethod: string;
  protected paginatedQueryMethod: string;
  protected deleteMethod: string;
  @InputConverter()
  protected queryOnInit: boolean = true;
  @InputConverter()
  protected queryOnBind: boolean = true;
  @InputConverter()
  pageable: boolean = false;
  protected columns: string;
  protected keys: string;
  protected parentKeys: string;
  protected staticData: Array<any>;
  protected detailMode: string;
  protected detailFormRoute: string;
  @InputConverter()
  protected recursiveDetail: boolean = false;
  @InputConverter()
  detailButtonInRow: boolean = false;
  detailButtonInRowIcon: string;
  protected editFormRoute: string;
  @InputConverter()
  protected recursiveEdit: boolean = false;
  @InputConverter()
  editButtonInRow: boolean = false;
  editButtonInRowIcon: string;
  queryRows: any;
  @InputConverter()
  insertButton: boolean;
  rowHeight: string;
  protected serviceType: string;
  protected insertFormRoute: string;
  @InputConverter()
  protected recursiveInsert: boolean = false;
  /* end of inputs variables */

  /*parsed inputs variables */
  protected colArray: Array<string> = [];
  protected keysArray: Array<string> = [];
  protected _pKeysEquiv = {};
  protected dataArray: Array<any> = [];
  protected parentItem: any;
  protected oattrFromEntity: boolean = false;
  /* end of parsed inputs variables */

  protected onLanguageChangeSubscribe: any;
  protected onRouteChangeStorageSubscribe: any;
  protected onFormDataSubscribe: any;

  public loading: boolean = false;
  protected loaderSuscription: Subscription;
  protected querySuscription: Subscription;
  protected filterForm: boolean = false;
  dataService: any;
  state: any;
  protected selectedItems: Array<Object> = [];

  protected router: Router;
  protected actRoute: ActivatedRoute;
  protected injector: Injector;
  public elRef: ElementRef;
  protected form: OFormComponent;

  protected onMainTabSelectedSubscription: any;
  protected formLayoutManager: OFormLayoutManagerComponent;

  constructor(
    injector: Injector,
    elRef: ElementRef,
    form: OFormComponent
  ) {
    this.injector = injector;
    this.elRef = elRef;
    this.form = form;
    this.detailMode = OServiceComponent.DEFAULT_DETAIL_MODE;

    if (this.injector) {
      this.router = this.injector.get(Router);
      this.actRoute = this.injector.get(ActivatedRoute);
      this.authGuardService = this.injector.get(AuthGuardService);
      this.translateService = this.injector.get(OTranslateService);
      this.dialogService = this.injector.get(DialogService);
      this.localStorageService = this.injector.get(LocalStorageService);
      let self = this;
      this.onLanguageChangeSubscribe = this.translateService.onLanguageChanged.subscribe(res => {
        self.onLanguageChangeCallback(res);
      });
      this.onRouteChangeStorageSubscribe = this.localStorageService.onRouteChange.subscribe(res => {
        self.localStorageService.updateComponentStorage(self);
      });
      try {
        this.formLayoutManager = this.injector.get(OFormLayoutManagerComponent);
      } catch (e) {
        // no parent form layout manager
      }
    }
  }

  isVisible(): boolean {
    return this.ovisible;
  }

  hasControls(): boolean {
    return this.controls;
  }

  getSelectedItems(): any[] {
    return this.selectedItems;
  }

  clearSelection() {
    this.selectedItems = [];
  }

  getAttribute(): string {
    return this.oattr;
  }

  getComponentKey(): string {
    return this.oattr;
  }

  getDataToStore(): Object {
    return this.state;
  }

  onLanguageChangeCallback(res: any) {
    if (typeof (this.title) !== 'undefined') {
      this.title = this.translateService.get(this._title);
    }
  }

  getKeys() {
    return this.keysArray;
  }

  initialize(): void {
    if (typeof (this.oattr) === 'undefined') {
      if (typeof (this.entity) !== 'undefined') {
        this.oattr = this.entity.replace('.', '_');
        this.oattrFromEntity = true;
      }
    }

    if (typeof (this.title) !== 'undefined') {
      this.title = this.translateService.get(this._title);
    }

    this.authGuardService.getPermissions(this.router.url, this.oattr).then(permissions => {
      if (typeof (permissions) !== 'undefined') {
        if (this.ovisible && permissions.visible === false) {
          this.ovisible = false;
        }
        if (this.oenabled && permissions.enabled === false) {
          this.oenabled = false;
        }
      }
    });

    this.keysArray = Util.parseArray(this.keys);
    this.colArray = Util.parseArray(this.columns, true);
    let pkArray = Util.parseArray(this.parentKeys);
    this._pKeysEquiv = Util.parseParentKeysEquivalences(pkArray, OServiceComponent.COLUMNS_ALIAS_SEPARATOR);

    //TODO: get default values from ICrudConstants
    if (!this.queryMethod) {
      this.queryMethod = OServiceComponent.DEFAULT_QUERY_METHOD;
    }

    if (!this.paginatedQueryMethod) {
      this.paginatedQueryMethod = OServiceComponent.DEFAULT_PAGINATED_QUERY_METHOD;
    }

    if (!this.deleteMethod) {
      this.deleteMethod = OServiceComponent.DEFAULT_DELETE_METHOD;
    }

    if (this.queryRows) {
      this.queryRows = parseInt(this.queryRows);
    } else {
      this.queryRows = OServiceComponent.DEFAULT_QUERY_ROWS;
    }

    if (!this.detailButtonInRowIcon) {
      this.detailButtonInRowIcon = OServiceComponent.DEFAULT_DETAIL_ICON;
    }

    if (!this.editButtonInRowIcon) {
      this.editButtonInRowIcon = OServiceComponent.DEFAULT_EDIT_ICON;
    }

    if (this.detailButtonInRow || this.editButtonInRow) {
      this.detailMode = OServiceComponent.DETAIL_MODE_NONE;
    }

    if (this.staticData) {
      this.queryOnBind = false;
      this.queryOnInit = false;
      this.setDataArray(this.staticData);
    } else {
      this.configureService();
    }

    if (this.form) {
      this.setFormComponent(this.form);
    }

    this.rowHeight = this.rowHeight ? this.rowHeight.toLowerCase() : this.rowHeight;
    if (!this.rowHeight || (OServiceComponent.AVAILABLE_ROW_HEIGHTS.indexOf(this.rowHeight) === -1)) {
      this.rowHeight = OServiceComponent.DEFAULT_ROW_HEIGHT;
    }
  }

  afterViewInit() {
    if (this.formLayoutManager && this.formLayoutManager.isTabMode()) {
      this.onMainTabSelectedSubscription = this.formLayoutManager.onMainTabSelected.subscribe(() => {
        this.reloadData();
      });
    }
  }

  destroy() {
    this.onLanguageChangeSubscribe.unsubscribe();
    if (this.onFormDataSubscribe) {
      this.onFormDataSubscribe.unsubscribe();
    }
    if (this.querySuscription) {
      this.querySuscription.unsubscribe();
      this.loaderSuscription.unsubscribe();
    }
    if (this.onMainTabSelectedSubscription) {
      this.onMainTabSelectedSubscription.unsubscribe();
    }
    this.localStorageService.updateComponentStorage(this);
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  /**
   * call when close browser and save storage
   * @param event
   */
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    if (this.localStorageService) {
      this.localStorageService.updateComponentStorage(this);
    }
  }


  configureService() {
    let loadingService: any = OntimizeService;
    if (this.serviceType) {
      loadingService = this.serviceType;
    }
    try {
      this.dataService = this.injector.get(loadingService);
      if (Util.isDataService(this.dataService)) {
        let serviceCfg = this.dataService.getDefaultServiceConfiguration(this.service);
        if (this.entity) {
          serviceCfg['entity'] = this.entity;
        }
        this.dataService.configureService(serviceCfg);
      }
    } catch (e) {
      console.error(e);
    }
  }

  getDataArray() {
    return this.dataArray;
  }

  setDataArray(data: any): void {
    if (Util.isArray(data)) {
      this.dataArray = data;
    } else if (Util.isObject(data)) {
      this.dataArray = [data];
    } else {
      console.warn('Component has received not supported service data. Supported data are Array or Object');
      this.dataArray = [];
    }
  }

  setFormComponent(form: OFormComponent) {
    var self = this;
    this.onFormDataSubscribe = this.form.onFormDataLoaded.subscribe(data => {
      self.parentItem = data;
      if (self.queryOnBind) {
        self.queryData(data);
      }
    });

    let dataValues = this.form.getDataValues();
    if (dataValues && Object.keys(dataValues).length > 0) {
      self.parentItem = dataValues;
      self.queryData(dataValues);
    } else {
      this.filterForm = true;
    }
    // TODO PENDING QUERY ON BIND
    // var self = this;
    // this.form.onFormDataLoaded.subscribe(data => {
    // //  if (self.queryOnBind) {
    //     self.parentItem = data;
    //      self.update(data);
    //       // self.onFormDataBind(data);
    //     // }
    // });
  }

  queryData(parentItem: any = undefined, ovrrArgs?: any) {
    console.log('queryData');
  }

  reloadData() {
    console.log('reloadData');
  }

  load(): any {
    var self = this;
    var zone = this.injector.get(NgZone);
    var loadObservable = new Observable(observer => {
      var timer = window.setTimeout(() => {
        observer.next(true);
      }, 250);

      return () => {
        window.clearTimeout(timer);
        zone.run(() => {
          self.loading = false;
        });
      };

    });
    var subscription = loadObservable.subscribe(val => {
      zone.run(() => {
        self.loading = val as boolean;
      });
    });
    return subscription;
  }

  viewDetail(item: any): void {
    let route = this.getRouteOfSelectedRow(item, this.detailFormRoute);
    if (route.length > 0) {
      const queryParams = {
        'isdetail': 'true'
      };
      if (this.formLayoutManager) {
        queryParams['ignore_can_deactivate'] = true;
      }
      const extras = {
        relativeTo: this.recursiveDetail ? this.actRoute.parent : this.actRoute,
        queryParams: queryParams
      };
      this.router.navigate(route, extras);
    }
  }

  editDetail(item: any) {
    let route = this.getRouteOfSelectedRow(item, this.editFormRoute);
    if (route.length > 0) {
      route.push('edit');
      this.router.navigate(
        route,
        {
          relativeTo: this.recursiveEdit ? this.actRoute.parent : this.actRoute,
          queryParams: {
            'isdetail': 'true'
          }
        }
      );
    }
  }

  insertDetail() {
    let route = [];
    let insertRoute = this.insertFormRoute !== undefined ? this.insertFormRoute : 'new';
    route.push(insertRoute);
    // adding parent-keys info...
    const encodedParentKeys = this.getEncodedParentKeys();
    if (encodedParentKeys !== undefined) {
      route.push({ 'pk': encodedParentKeys });
    }
    let extras = {
      relativeTo: this.recursiveInsert ? this.actRoute.parent : this.actRoute,
    };
    if (this.formLayoutManager) {
      extras['queryParams'] = {
        'ignore_can_deactivate': true
      };
    }
    this.router.navigate(route, extras).catch(err => {
      console.error(err.message);
    });
  }

  protected getEncodedParentKeys() {
    const parentKeys = Object.keys(this._pKeysEquiv);
    let encoded = undefined;
    if ((parentKeys.length > 0) && (typeof (this.parentItem) !== 'undefined')) {
      let pKeys = {};
      parentKeys.forEach(parentKey => {
        if (this.parentItem.hasOwnProperty(parentKey)) {
          let currentData = this.parentItem[parentKey];
          if (currentData instanceof OFormValue) {
            currentData = currentData.value;
          }
          pKeys[this._pKeysEquiv[parentKey]] = currentData;
        }
      });
      if (Object.keys(pKeys).length > 0) {
        encoded = Util.encodeParentKeys(pKeys);
      }
    }
    return encoded;
  }

  getRouteOfSelectedRow(item: any, modeRoute: any) {
    let route = [];

    // if (this.formLayoutManager) {
    //   route = this.formLayoutManager.getRouteOfActiveItem();
    // }

    // TODO: multiple keys
    let filter = undefined;
    if (typeof (item) === 'object') {
      for (let k = 0; k < this.keysArray.length; ++k) {
        let key = this.keysArray[k];
        filter = item[key];
      }
    }
    if (typeof (filter) !== 'undefined') {
      if (modeRoute !== undefined) {
        route.push(modeRoute);
      }
      route.push(filter);
    }
    return route;
  }

  getQueryArguments(filter: Object, ovrrArgs?: any): Array<any> {
    let queryArguments = [filter, this.colArray, this.entity];
    if (this.pageable) {
      let queryOffset = (ovrrArgs && ovrrArgs.hasOwnProperty('offset')) ? ovrrArgs.offset : this.state.queryRecordOffset;
      let queryRowsN = (ovrrArgs && ovrrArgs.hasOwnProperty('length')) ? ovrrArgs.length : this.queryRows;
      queryArguments = queryArguments.concat([undefined, queryOffset, queryRowsN, undefined]);
    }
    return queryArguments;
  }

  updatePaginationInfo(queryRes: any) {
    let resultEndIndex = queryRes.startRecordIndex + (queryRes.data ? queryRes.data.length : 0);
    if (queryRes.startRecordIndex !== undefined) {
      this.state.queryRecordOffset = resultEndIndex;
    }
    if (queryRes.totalQueryRecordsNumber !== undefined) {
      this.state.totalQueryRecordsNumber = queryRes.totalQueryRecordsNumber;
    }
  }

  getTotalRecordsNumber() {
    return (this.state && this.state.totalQueryRecordsNumber !== undefined) ? this.state.totalQueryRecordsNumber : undefined;
  }

  protected deleteLocalItems() {
    let selectedItems = this.getSelectedItems();
    for (let i = 0; i < selectedItems.length; ++i) {
      let selectedItem = selectedItems[i];
      let selectedItemKv = {};
      for (let k = 0; k < this.keysArray.length; ++k) {
        let key = this.keysArray[k];
        selectedItemKv[key] = selectedItem[key];
      }
      for (let j = this.dataArray.length - 1; j >= 0; --j) {
        let item = this.dataArray[j];
        let itemKv = {};
        for (let k = 0; k < this.keysArray.length; ++k) {
          let key = this.keysArray[k];
          itemKv[key] = item[key];
        }
        let found = false;
        for (let k in selectedItemKv) {
          if (selectedItemKv.hasOwnProperty(k)) {
            found = itemKv.hasOwnProperty(k) && (selectedItemKv[k] === itemKv[k]);
          }
        }
        if (found) {
          this.dataArray.splice(j, 1);
          break;
        }
      }
    }
    this.clearSelection();
  }

  reinitialize(options: OListInitializationOptions /*| OTableInitializationOptions*/) {
    if (options && Object.keys(options).length) {
      let clonedOpts = Object.assign({}, options);
      if (clonedOpts.hasOwnProperty('entity')) {
        this.entity = clonedOpts.entity;
        if (this.oattrFromEntity) {
          this.oattr = undefined;
        }
        delete clonedOpts.entity;
      }
      for (var prop in clonedOpts) {
        if (clonedOpts.hasOwnProperty(prop)) {
          this[prop] = clonedOpts[prop];
        }
      }
      this.destroy();
      this.initialize();
    }
  }
}
