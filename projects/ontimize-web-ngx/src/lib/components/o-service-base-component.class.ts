import { ChangeDetectorRef, HostListener, Injector, isDevMode, OnChanges, SimpleChange, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { InputConverter } from '../decorators/input-converter';
import { ILocalStorageComponent } from '../interfaces/local-storage-component.interface';
import { ServiceResponse } from '../interfaces/service-response.interface';
import { DialogService } from '../services/dialog.service';
import { LocalStorageService } from '../services/local-storage.service';
import { OErrorDialogManager } from '../services/o-error-dialog-manager.service';
import { OntimizeService } from '../services/ontimize/ontimize.service';
import { AbstractServiceComponentStateClass } from '../services/state/o-component-state.class';
import { AbstractComponentStateService, DefaultServiceComponentStateService } from '../services/state/o-component-state.service';
import { OQueryDataArgs } from '../types/query-data-args.type';
import { OConfigureServiceArgs } from '../types/configure-service-args.type';
import { Codes } from '../util/codes';
import { ServiceUtils } from '../util/service.utils';
import { Util } from '../util/util';
import { OExpandableContainerComponent } from './expandable-container/o-expandable-container.component';
import { OFormComponent } from './form/o-form.component';
import { O_GLOBAL_CONFIG } from '../types/o-global-config.type';

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

export abstract class AbstractOServiceBaseComponent<T extends AbstractComponentStateService<AbstractServiceComponentStateClass>> implements ILocalStorageComponent, OnChanges {

  protected localStorageService: LocalStorageService;
  componentStateService: T;
  protected dialogService: DialogService;
  protected oErrorDialogManager: OErrorDialogManager;

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

  set oQueryRows(value: number) {
    if (Util.isDefined(value)) {
      value = typeof value !== 'number' ? parseInt(value, 10) : value;
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
  queryFallbackFunction: (err: any) => void;
  // insertFallbackFunction: (err: any) => void;
  // updateFallbackFunction: (err: any) => void;
  // deleteFallbackFunction: (err: any) => void;
  /* end of inputs variables */

  /* parsed inputs variables */
  protected colArray: Array<string> = [];
  protected keysArray: Array<string> = [];
  protected _pKeysEquiv = {};
  dataArray: Array<any> = [];
  protected oattrFromEntity: boolean = false;
  /* end of parsed inputs variables */

  protected onRouteChangeStorageSubscription: any;
  protected onFormDataSubscribe: any;

  protected querySubscription: Subscription;
  protected dataService: any;

  protected loadingSubject = new BehaviorSubject<boolean>(false);
  public loading: Observable<boolean> = this.loadingSubject.asObservable();

  protected form: OFormComponent;
  public expandableContainer: OExpandableContainerComponent;
  protected alreadyStored: boolean = false;

  protected queryOnEventSubscription: Subscription;
  public cd: ChangeDetectorRef; // borrar
  protected queryArguments: any[];

  protected router: Router;
  protected actRoute: ActivatedRoute;

  protected sqlTypes = undefined;

  public abortQuery: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    protected injector: Injector
  ) {
    this.dialogService = this.injector.get<DialogService>(DialogService as Type<DialogService>);
    this.oErrorDialogManager = this.injector.get<OErrorDialogManager>(OErrorDialogManager as Type<OErrorDialogManager>);
    this.localStorageService = this.injector.get<LocalStorageService>(LocalStorageService as Type<LocalStorageService>);
    this.componentStateService = this.injector.get<T>(AbstractComponentStateService as Type<T>);
    this.router = this.injector.get<Router>(Router as Type<Router>);
    this.actRoute = this.injector.get<ActivatedRoute>(ActivatedRoute as Type<ActivatedRoute>);
    try {
      this.cd = this.injector.get<ChangeDetectorRef>(ChangeDetectorRef as Type<ChangeDetectorRef>);
      this.form = this.injector.get<OFormComponent>(OFormComponent as Type<OFormComponent>);
    } catch (e) {
      // no parent form
    }
    try {
      this.expandableContainer = this.injector.get<OExpandableContainerComponent>(OExpandableContainerComponent as Type<OExpandableContainerComponent>);
    } catch (e) {
      // No parent OExpandableContainerComponent
    }
    this.getGlobalInjectionTokenConfig();
  }

  private getGlobalInjectionTokenConfig() {

    try {
      const oGlobalConfig = this.injector.get(O_GLOBAL_CONFIG);
      if (Util.isDefined(oGlobalConfig.storeState)) {
        this.storeState = oGlobalConfig.storeState;
      };

    } catch (error) {
      // Do nothing because is optional
    }
  }


  get state(): AbstractServiceComponentStateClass {
    return this.componentStateService.state;
  }

  initialize(): void {
    if (!Util.isDefined(this.oattr) && Util.isDefined(this.entity)) {
      this.oattr = this.entity.replace('.', '_');
      this.oattrFromEntity = true;
    }
    this.keysArray = Util.parseArray(this.keys);
    this.checkColumns();
    const pkArray = Util.parseArray(this.parentKeys);
    this._pKeysEquiv = Util.parseParentKeysEquivalences(pkArray, Codes.COLUMNS_ALIAS_SEPARATOR);

    this.componentStateService.initialize(this);

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
  }

  checkColumns() {
    this.colArray = Util.parseArray(this.columns, true);
    if (isDevMode()) {
      this.keysArray.forEach(key => {
        if (this.columns.indexOf(key) === -1) {
          console.warn(`In the component '${this.oattr}', the key '${key}' is not included in the columns definition and some functionalities may not work correctly`);
        }
      })
    }
  }

  afterViewInit() {
    this.registerLocalStorageServiceRouteChange();

    this.abortQuery.subscribe(value => {
      if (value) {
        if (this.querySubscription) {
          this.querySubscription.unsubscribe();
        }
        this.setData([]);
      }
    });
  }

  destroy() {
    if (this.onFormDataSubscribe) {
      this.onFormDataSubscribe.unsubscribe();
    }
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
    if (this.onRouteChangeStorageSubscription) {
      this.onRouteChangeStorageSubscription.unsubscribe();
    }
    if (this.queryOnEventSubscription) {
      this.queryOnEventSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (Util.isDefined(changes.staticData)) {
      this.setData(changes.staticData.currentValue);
    }
  }

  @HostListener('window:beforeunload', [])
  beforeunloadHandler() {
    this.updateStateStorage();
  }

  getAttribute(): string {
    return this.oattr;
  }

  getComponentKey(): string {
    return this.getAttribute();
  }

  getDataToStore(): any {
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

  getKeys(): string[] {
    return this.keysArray;
  }

  configureService() {
    const configureServiceArgs: OConfigureServiceArgs = { injector: this.injector, baseService: OntimizeService, entity: this.entity, service: this.service, serviceType: this.serviceType }
    this.dataService = Util.configureService(configureServiceArgs);
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

  public getParentKeysFromContext(parentKeys: object, context: any) {
    let result = {};
    const checkRouteParamsRecursive = this.router.paramsInheritanceStrategy !== 'always';
    if (context instanceof OExpandableContainerComponent) {
      result = ServiceUtils.getParentKeysFromExpandableContainer(parentKeys, context, this.actRoute, checkRouteParamsRecursive);
    } else {
      result = ServiceUtils.getParentKeysFromForm(parentKeys, context, this.actRoute, checkRouteParamsRecursive);
    }
    return result;

  }

  public queryData(filter?: any, ovrrArgs?: OQueryDataArgs): void {
    const queryMethodName = this.pageable ? this.paginatedQueryMethod : this.queryMethod;
    if (!this.dataService || !(queryMethodName in this.dataService) || !this.entity) {
      return;
    }
    const filterParentKeys = this.getParentKeysValues();
    if (!ServiceUtils.filterContainsAllParentKeys(filterParentKeys, this._pKeysEquiv) && !this.queryWithNullParentKeys) {
      this.setData([], []);
    } else {
      if (this.querySubscription) {
        this.querySubscription.unsubscribe();
      }
      this.loadingSubject.next(true);

      // ensuring false value
      this.abortQuery.next(false);

      this.queryArguments = this.getQueryArguments(filter, ovrrArgs);

      if (this.abortQuery.value) {
        this.state.queryRecordOffset = 0;
        this.state.totalQueryRecordsNumber = 0;
        this.setData([], []);
        /**  this.cd.detectChanges() is used to update loadingSubject value (this.loadingSubject.next(true); in line 377)
         *  before using the next line and so update the oTableExpandedFooter directive and display the message
         * that there are no results when the query is aborted*/
        this.cd.detectChanges();
        this.loadingSubject.next(false);
        return;
      }

      this.querySubscription = (this.dataService[queryMethodName].apply(this.dataService, this.queryArguments) as Observable<ServiceResponse>)
        .subscribe((res: ServiceResponse) => {
          let data;
          this.sqlTypes = undefined;
          if (Util.isArray(res)) {
            data = res;
            this.sqlTypes = {};
          } else if (res.isSuccessful()) {
            const arrData = (res.data !== undefined) ? res.data : [];
            data = Util.isArray(arrData) ? arrData : [];
            this.sqlTypes = res.sqlTypes;
            if (this.pageable) {
              this.updatePaginationInfo(res);
            }
          }

          this.setData(data, this.sqlTypes, (ovrrArgs && ovrrArgs.replace));
          this.loadingSubject.next(false);
        }, err => {
          this.setData([], []);
          this.loadingSubject.next(false);
          if (Util.isDefined(this.queryFallbackFunction)) {
            this.queryFallbackFunction(err);
          } else {
            this.oErrorDialogManager.openErrorDialog(err);
            console.error(err);
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

  /**
   * Extracting the given record keys
   * @param item record object
   * @returns object containing item object properties contained in keysArray
   */
  extractKeysFromRecord(item: any): object {
    const result = {};
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
    const result = this.colArray;
    this.keysArray.forEach(key => {
      if (result.indexOf(key) === -1) {
        result.push(key);
      }
    });
    return result;
  }

  getQueryArguments(filter: object, ovrrArgs?: OQueryDataArgs): Array<any> {
    const compFilter = this.getComponentFilter(filter);
    const queryCols = this.getAttributesValuesToQuery();
    const sqlTypes = (ovrrArgs && ovrrArgs.hasOwnProperty('sqltypes')) ? ovrrArgs.sqltypes : this.form ? this.form.getAttributesSQLTypes() : {};

    let queryArguments = [compFilter, queryCols, this.entity, sqlTypes];
    if (this.pageable) {
      const queryOffset = (ovrrArgs && ovrrArgs.hasOwnProperty('offset')) ? ovrrArgs.offset : this.state.queryRecordOffset;
      const queryRowsN = (ovrrArgs && ovrrArgs.hasOwnProperty('length')) ? ovrrArgs.length : this.queryRows;
      queryArguments = queryArguments.concat([queryOffset, queryRowsN, undefined]);
    }
    return queryArguments;
  }

  updatePaginationInfo(queryRes: ServiceResponse) {
    const resultEndIndex = queryRes.startRecordIndex + (queryRes.data ? queryRes.data.length : 0);
    if (queryRes.startRecordIndex !== undefined) {
      this.state.queryRecordOffset = resultEndIndex;
    }
    if (queryRes.totalQueryRecordsNumber !== undefined) {
      this.state.totalQueryRecordsNumber = queryRes.totalQueryRecordsNumber;
    }
  }

  getTotalRecordsNumber(): number {
    return Util.isDefined(this.state.totalQueryRecordsNumber) ? this.state.totalQueryRecordsNumber : undefined;
  }

  getContextComponent() {
    return this.expandableContainer || this.form;
  }

  getComponentFilter(existingFilter: any = {}): any {
    const filterParentKeys = this.getParentKeysFromContext(this._pKeysEquiv, this.getContextComponent());
    existingFilter = Object.assign(existingFilter || {}, filterParentKeys);
    return existingFilter;
  }

  getSqlTypes() {
    return Util.isDefined(this.sqlTypes) ? this.sqlTypes : {};
  }

  getParentKeysValues() {
    const context = this.getContextComponent();
    return this.getParentKeysFromContext(this._pKeysEquiv, context);
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


  protected registerLocalStorageServiceRouteChange() {
    if (this.storeState) {
      this.onRouteChangeStorageSubscription = this.localStorageService.onRouteChange.subscribe(res => {
        this.updateStateStorage();
      });
    }
  }

}

export class DefaultOServiceBaseComponent extends AbstractOServiceBaseComponent<DefaultServiceComponentStateService> {

}

/* This class is being defined to mantain the backwards compatibility with previous versions, use DefaultOServiceBaseComponent*/
export class OServiceBaseComponent extends AbstractOServiceBaseComponent<DefaultServiceComponentStateService> {

}
