import { ChangeDetectorRef, HostListener, Injector, NgZone, SimpleChange } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { InputConverter } from '../decorators';
import { DialogService, ILocalStorageComponent, LocalStorageService, OntimizeService } from '../services';
import { Codes, Util } from '../utils';
import { OFormComponent } from './form/o-form.component';
import { OQueryDataArgs, ServiceUtils } from './service.utils';


export const DEFAULT_INPUTS_O_SERVICE_BASE_COMPONENT = [
  // attr [string]: list identifier. It is mandatory if data are provided through the data attribute. Default: entity (if set).
  'oattr: attr',

  // service [string]: JEE service path. Default: no value.
  'service',

  'serviceType : service-type',

  // entity [string]: entity of the service. Default: no value.
  'entity',

  // query-on-init [no|yes]: query on init. Default: yes.
  'queryOnInit: query-on-init',

  // query-on-init [no|yes]: query on bind. Default: yes.
  'queryOnBind: query-on-bind',

  'queryOnEvent: query-on-event',

  'pageable',

  // columns [string]: columns of the entity, separated by ';'. Default: no value.
  'columns',

  // keys [string]: entity keys, separated by ';'. Default: no value.
  'keys',

  // parent-keys [string]: parent keys to filter, separated by ';'. Default: no value.
  'parentKeys: parent-keys',

  // static-data [Array<any>] : way to populate with static data. Default: no value.
  'staticData: static-data',

  // query-method [string]: name of the service method to perform queries. Default: query.
  'queryMethod: query-method',

  // paginated-query-method [string]: name of the service method to perform paginated queries. Default: advancedQuery.
  'paginatedQueryMethod : paginated-query-method',

  // query-rows [number]: number of rows per page. Default: 10.
  'oQueryRows: query-rows',

  // insert-method [string]: name of the service method to perform inserts. Default: insert.
  'insertMethod: insert-method',

  // update-method [string]: name of the service method to perform updates. Default: update.
  'updateMethod: update-method',

  // delete-method [string]: name of the service method to perform deletions. Default: delete.
  'deleteMethod: delete-method',

  'storeState: store-state',

  // query-with-null-parent-keys [string][yes|no|true|false]: Indicates whether or not to trigger query method when parent-keys filter is null. Default: false
  'queryWithNullParentKeys: query-with-null-parent-keys',

  // [function]: function to execute on query error. Default: no value.
  'queryFallbackFunction: query-fallback-function'
  // ,

  // 'insertFallbackFunction: insert-fallback-function',

  // 'updateFallbackFunction: update-fallback-function',

  // 'deleteFallbackFunction: delete-fallback-function'
];

export class OServiceBaseComponent implements ILocalStorageComponent {

  public static DEFAULT_INPUTS_O_SERVICE_BASE_COMPONENT = DEFAULT_INPUTS_O_SERVICE_BASE_COMPONENT;

  protected localStorageService: LocalStorageService;
  protected dialogService: DialogService;

  /* inputs variables */
  oattr: string;
  service: string;
  serviceType: string;
  entity: string;
  @InputConverter()
  queryOnInit: boolean = true;
  @InputConverter()
  queryOnBind: boolean = true;
  queryOnEvent: any;
  @InputConverter()
  pageable: boolean = false;
  columns: string;
  keys: string;
  parentKeys: string;
  staticData: Array<any>;
  queryMethod: string = Codes.QUERY_METHOD;
  paginatedQueryMethod: string = Codes.PAGINATED_QUERY_METHOD;

  originalQueryRows: number = Codes.DEFAULT_QUERY_ROWS;
  protected _queryRows = this.originalQueryRows;

  @InputConverter()
  set oQueryRows(value: number) {
    if (Util.isDefined(value)) {
      this.originalQueryRows = value;
      this._queryRows = value;
    }
  }

  get queryRows(): number {
    return this._queryRows;
  }

  set queryRows(value: number) {
    if (Util.isDefined(value)) {
      this._queryRows = value;
    }
  }
  insertMethod: string = Codes.INSERT_METHOD;
  updateMethod: string = Codes.UPDATE_METHOD;
  deleteMethod: string = Codes.DELETE_METHOD;
  @InputConverter()
  storeState: boolean = true;
  @InputConverter()
  queryWithNullParentKeys: boolean = false;
  queryFallbackFunction: Function;
  // insertFallbackFunction: Function;
  // updateFallbackFunction: Function;
  // deleteFallbackFunction: Function;
  /* end of inputs variables */

  /* parsed inputs variables */
  protected colArray: Array<string> = [];
  protected keysArray: Array<string> = [];
  protected _pKeysEquiv = {};
  protected dataArray: Array<any> = [];
  protected oattrFromEntity: boolean = false;
  /* end of parsed inputs variables */

  protected onRouteChangeStorageSubscription: any;
  protected onFormDataSubscribe: any;

  protected loaderSubscription: Subscription;
  protected querySubscription: Subscription;
  protected dataService: any;
  protected _state: any = {};

  protected loadingSubject = new BehaviorSubject<boolean>(false);
  public loading: Observable<boolean> = this.loadingSubject.asObservable();

  protected form: OFormComponent;
  protected alreadyStored: boolean = false;

  protected queryOnEventSubscription: Subscription;
  public cd: ChangeDetectorRef;//borrar
  protected queryArguments: any[];

  protected router: Router;
  protected actRoute: ActivatedRoute;

  protected sqlTypes = undefined;

  constructor(
    protected injector: Injector
  ) {
    this.dialogService = this.injector.get(DialogService);
    this.localStorageService = this.injector.get(LocalStorageService);
    this.router = this.injector.get(Router);
    this.actRoute = this.injector.get(ActivatedRoute);
    try {
      this.cd = this.injector.get(ChangeDetectorRef);
      this.form = this.injector.get(OFormComponent);
    } catch (e) {
      // no parent form
    }
  }

  initialize(): void {
    if (!Util.isDefined(this.oattr) && Util.isDefined(this.entity)) {
      this.oattr = this.entity.replace('.', '_');
      this.oattrFromEntity = true;
    }
    this.keysArray = Util.parseArray(this.keys);
    this.colArray = Util.parseArray(this.columns, true);
    let pkArray = Util.parseArray(this.parentKeys);
    this._pKeysEquiv = Util.parseParentKeysEquivalences(pkArray, Codes.COLUMNS_ALIAS_SEPARATOR);

    if (this.storeState) {
      this.onRouteChangeStorageSubscription = this.localStorageService.onRouteChange.subscribe(res => {
        this.updateStateStorage();
        // when the storage is updated because a route change
        // the alreadyStored control variable is changed to its initial value
        this.alreadyStored = false;
      });

      this.initializeState();

      // if query-rows in initial configuration is equals to original query-rows input
      // query_rows will be the value in local storage
      if (this.state.hasOwnProperty('query-rows')) {
        if (this.state.hasOwnProperty('initial-configuration') && this.state['initial-configuration'].hasOwnProperty['query-rows']
          && this.state['initial-configuration']['query-rows'] === this.originalQueryRows) {
          this.queryRows = this.state['query-rows'];
        }
      }
    }

    if (this.staticData) {
      this.queryOnBind = false;
      this.queryOnInit = false;
      this.setDataArray(this.staticData);
    } else {
      this.configureService();
    }

    if (this.form && Util.isDefined(this.dataService)) {
      this.setFormComponent(this.form);
    }

    if (Util.isDefined(this.queryOnEvent) && Util.isDefined(this.queryOnEvent.subscribe)) {
      const self = this;
      this.queryOnEventSubscription = this.queryOnEvent.subscribe((value) => {
        if (Util.isDefined(value) || this.queryWithNullParentKeys) {
          self.queryData();
        }
      });
    }

    if (typeof this.queryFallbackFunction !== 'function') {
      this.queryFallbackFunction = undefined;
    }
    // if (typeof this.insertFallbackFunction !== 'function') {
    //   this.insertFallbackFunction = undefined;
    // }
    // if (typeof this.updateFallbackFunction !== 'function') {
    //   this.updateFallbackFunction = undefined;
    // }
    // if (typeof this.deleteFallbackFunction !== 'function') {
    //   this.deleteFallbackFunction = undefined;
    // }
  }

  afterViewInit() {
    //
  }

  destroy() {
    if (this.onFormDataSubscribe) {
      this.onFormDataSubscribe.unsubscribe();
    }
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
    if (this.onRouteChangeStorageSubscription) {
      this.onRouteChangeStorageSubscription.unsubscribe();
    }
    if (this.queryOnEventSubscription) {
      this.queryOnEventSubscription.unsubscribe();
    }
    this.updateStateStorage();
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (Util.isDefined(changes['staticData'])) {
      this.setDataArray(changes['staticData'].currentValue);
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event) {
    this.updateStateStorage();
  }

  getAttribute(): string {
    return this.oattr;
  }

  getComponentKey(): string {
    return this.getAttribute();
  }

  getDataToStore(): Object {
    return this.state;
  }

  getRouteKey(): string {
    let route = this.router.url;
    this.actRoute.params.subscribe(params => {
      Object.keys(params).forEach(key => {
        route = route.replace(params[key], key);
      });
    });
    return route;
  }

  getKeys() {
    return this.keysArray;
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

  public setFormComponent(form: OFormComponent): void {
    if (!Util.isDefined(this.form)) {
      this.form = form;
    }

    if (this.queryOnBind) {
      this.onFormDataSubscribe = this.form.onDataLoaded.subscribe(() => this.pageable ? this.reloadPaginatedDataFromStart() : this.reloadData());
    }
  }

  public queryData(filter?: any, ovrrArgs?: OQueryDataArgs): void {
    let queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
    if (!this.dataService || !(queryMethodName in this.dataService) || !this.entity) {
      return;
    }
    let filterParentKeys = ServiceUtils.getParentKeysFromForm(this._pKeysEquiv, this.form);
    if (!ServiceUtils.filterContainsAllParentKeys(filterParentKeys, this._pKeysEquiv) && !this.queryWithNullParentKeys) {
      this.setData([], []);
    } else {
      filter = Object.assign(filter || {}, filterParentKeys);
      let queryArguments = this.getQueryArguments(filter, ovrrArgs);
      if (this.querySubscription) {
        this.querySubscription.unsubscribe();
      }
      if (this.loaderSubscription) {
        this.loaderSubscription.unsubscribe();
      }
      this.loaderSubscription = this.load();
      const self = this;
      this.queryArguments = queryArguments;
      this.querySubscription = this.dataService[queryMethodName].apply(this.dataService, queryArguments).subscribe(res => {
        let data = undefined;
        this.sqlTypes = undefined;
        if (Util.isArray(res)) {
          data = res;
          this.sqlTypes = {};
        } else if ((res.code === Codes.ONTIMIZE_SUCCESSFUL_CODE)) {
          const arrData = (res.data !== undefined) ? res.data : [];
          data = Util.isArray(arrData) ? arrData : [];
          this.sqlTypes = res.sqlTypes;
          if (this.pageable) {
            this.updatePaginationInfo(res);
          }
        }
        self.setData(data, this.sqlTypes, (ovrrArgs && ovrrArgs.replace));
        self.loaderSubscription.unsubscribe();
      }, err => {
        self.setData([], []);
        self.loaderSubscription.unsubscribe();
        if (Util.isDefined(self.queryFallbackFunction)) {
          self.queryFallbackFunction(err);
        } else if (err && typeof err !== 'object') {
          self.dialogService.alert('ERROR', err);
        } else {
          self.dialogService.alert('ERROR', 'MESSAGES.ERROR_QUERY');
        }
      });
    }
  }

  public reloadData(): void {
    this.queryData();
  }

  /**
   * Reloads the component data and restarts the pagination.
   */
  reloadPaginatedDataFromStart(): void {
    this.reloadData();
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
          self.loadingSubject.next(false);
        });
      };

    });
    var subscription = loadObservable.subscribe(val => {
      zone.run(() => {
        self.loadingSubject.next(val as boolean);
      });
    });
    return subscription;
  }

  /**
   * Extracting the given record keys
   * @param item record object
   * @returns object containing item object properties contained in keysArray
   */
  extractKeysFromRecord(item: any): Object {
    let result = {};
    if (Util.isObject(item)) {
      this.keysArray.forEach(key => {
        if (Util.isDefined(item[key])) {
          result[key] = item[key];
        }
      });
    }
    return result;
  }

  getAttributesValuesToQuery(): Array<string> {
    let result = this.colArray;
    this.keysArray.forEach(key => {
      if (result.indexOf(key) === -1) {
        result.push(key);
      }
    });
    return result;
  }

  getQueryArguments(filter: Object, ovrrArgs?: OQueryDataArgs): Array<any> {
    const compFilter = this.getComponentFilter(filter);
    const queryCols = this.getAttributesValuesToQuery();
    let sqlTypes = (ovrrArgs && ovrrArgs.hasOwnProperty('sqltypes')) ? ovrrArgs.sqltypes : this.form ? this.form.getAttributesSQLTypes() : {};

    let queryArguments = [compFilter, queryCols, this.entity, sqlTypes];
    if (this.pageable) {
      let queryOffset = (ovrrArgs && ovrrArgs.hasOwnProperty('offset')) ? ovrrArgs.offset : this.state.queryRecordOffset;
      let queryRowsN = (ovrrArgs && ovrrArgs.hasOwnProperty('length')) ? ovrrArgs.length : this.queryRows;
      queryArguments = queryArguments.concat([queryOffset, queryRowsN, undefined]);
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

  getTotalRecordsNumber(): number {
    return (this.state && this.state.totalQueryRecordsNumber !== undefined) ? this.state.totalQueryRecordsNumber : undefined;
  }

  getComponentFilter(existingFilter: any = {}): any {
    return existingFilter;
  }

  getSqlTypes() {
    return Util.isDefined(this.sqlTypes) ? this.sqlTypes : {};
  }

  get state(): any {
    return this._state;
  }

  set state(arg: any) {
    this._state = arg;
  }

  getParentKeysValues() {
    return ServiceUtils.getParentKeysFromForm(this._pKeysEquiv, this.form);
  }

  protected updateStateStorage(): void {
    if (this.localStorageService && this.storeState && !this.alreadyStored) {
      this.alreadyStored = true;
      this.localStorageService.updateComponentStorage(this, this.getRouteKey());
    }
  }

  protected setData(data: any, sqlTypes?: any, replace?: boolean): void {
    //
  }

  initializeState() {
    // Get previous status
    this.state = this.localStorageService.getComponentStorage(this, this.getRouteKey());
  }
}
