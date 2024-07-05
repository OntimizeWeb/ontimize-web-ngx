import { Directive, ElementRef, EventEmitter, Injector, NgZone, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { BooleanInputConverter } from '../../decorators/input-converter';
import { ServiceResponse } from '../../interfaces/service-response.interface';
import { OErrorDialogManager } from '../../services/o-error-dialog-manager.service';
import { OntimizeService } from '../../services/ontimize/ontimize.service';
import { OntimizeQueryArgumentsAdapter } from '../../services/query-arguments/ontimize-query-arguments.adapter';
import { OConfigureServiceArgs } from '../../types/configure-service-args.type';
import { FormValueOptions } from '../../types/form-value-options.type';
import { OQueryDataArgs } from '../../types/query-data-args.type';
import { OQueryParams } from '../../types/query-params.type';
import { Codes } from '../../util/codes';
import { ServiceUtils } from '../../util/service.utils';
import { Util } from '../../util/util';
import { OContextMenuComponent } from '../contextmenu/o-context-menu.component';
import { OFormComponent } from '../form/o-form.component';
import { OFormDataComponent } from '../o-form-data-component.class';

export const DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT = [
  // static-data [Array<any>] : way to populate with static data. Default: no value.
  'staticData: static-data',
  'entity',
  'service',
  'columns',
  'valueColumn: value-column',
  'valueColumnType: value-column-type',
  'parentKeys: parent-keys',
  // Visible columns into selection dialog from parameter 'columns'. With empty parameter all columns are visible.
  'visibleColumns: visible-columns',
  // Visible columns in text field. By default, it is the parameter value of visible columns.
  'descriptionColumns: description-columns',

  'separator',

  'queryOnInit: query-on-init',
  'queryOnBind: query-on-bind',
  'queryOnEvent: query-on-event',

  // query-method [string]: name of the service method to perform queries. Default: query.
  'queryMethod: query-method',

  'serviceType: service-type',

  // query-with-null-parent-keys [string][yes|no|true|false]: Indicates whether or not to trigger query method when parent-keys filter is null. Default: false
  'queryWithNullParentKeys: query-with-null-parent-keys',

  // set-value-on-value-change [string]: Form component attributes whose value will be set when the value of the current component changes due to user interaction. Separated by ';'. Accepted format: attr | columnName:attr
  'setValueOnValueChange: set-value-on-value-change',

  // [function]: function to execute on query error. Default: no value.
  'queryFallbackFunction: query-fallback-function',

  // 'insertFallbackFunction: insert-fallback-function',

  // 'updateFallbackFunction: update-fallback-function',

  // 'deleteFallbackFunction: delete-fallback-function'

  'translate',

  // sort [string]: sorting ASC or DESC. Default: no value
  'sort',
  //  configure-service-args [OConfigureServiceArgs]: Allows configure service .
  'configureServiceArgs: configure-service-args'
];

export const DEFAULT_OUTPUTS_O_FORM_SERVICE_COMPONENT = [
  'onSetValueOnValueChange',
  'onDataLoaded'
];

@Directive({
  inputs: DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT,
  outputs: DEFAULT_INPUTS_O_FORM_SERVICE_COMPONENT
})
export class OFormServiceComponent extends OFormDataComponent {

  /* Inputs */
  protected staticData: Array<any>;
  protected entity: string;
  protected service: string;
  protected columns: string;
  public valueColumn: string;
  protected valueColumnType: string = Codes.TYPE_INT;
  protected parentKeys: string;
  protected visibleColumns: string;
  protected descriptionColumns: string;
  public separator: string = Codes.SPACE_SEPARATOR;
  @BooleanInputConverter()
  protected queryOnInit: boolean = true;
  @BooleanInputConverter()
  protected queryOnBind: boolean = false;
  protected queryOnEvent: any;
  protected queryMethod: string = Codes.QUERY_METHOD;
  protected serviceType: string;
  @BooleanInputConverter()
  queryWithNullParentKeys: boolean = false;
  public setValueOnValueChange: string;
  public queryFallbackFunction: (error: any) => void;

  @BooleanInputConverter()
  public translate: boolean = false;
  public sort: 'ASC' | 'DESC';

  /* Outputs */
  public onSetValueOnValueChange: EventEmitter<object> = new EventEmitter<object>();
  public onDataLoaded: EventEmitter<object> = new EventEmitter<object>();

  /* Internal variables */
  public dataArray: any[] = [];
  protected colArray: string[] = [];
  protected visibleColArray: string[] = [];
  public descriptionColArray: string[] = [];
  protected dataService: OntimizeService;
  public loaderSubscription: Subscription;
  loading: boolean = false;

  protected querySubscription: Subscription;
  protected cacheQueried: boolean = false;
  protected _pKeysEquiv = {};
  protected _setValueOnValueChangeEquiv = {};
  protected _formDataSubcribe;
  protected _currentIndex;
  protected oErrorDialogManager: OErrorDialogManager;

  protected queryOnEventSubscription: Subscription;
  protected subscriptionDataLoad: Subscription = new Subscription();
  public delayLoad = 250;
  public loadingSubject = new BehaviorSubject<boolean>(false);
  queryArgumentAdapter: any;

  public oContextMenu: OContextMenuComponent;
  queryArguments: any;
  @ViewChild(OContextMenuComponent)
  set oContextMenuRef(value: OContextMenuComponent) {
    this.oContextMenu = value;
  }

  public configureServiceArgs: OConfigureServiceArgs;
  constructor(
    form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
    this.form = form;
    this.elRef = elRef;
    this.oErrorDialogManager = injector.get(OErrorDialogManager);
  }

  initialize() {
    super.initialize();

    this.subscriptionDataLoad.add(this.onDataLoaded.subscribe(() => this.syncDataIndex(false)));

    this.cacheQueried = false;
    this.colArray = Util.parseArray(this.columns, true);

    this.visibleColArray = Util.parseArray(this.visibleColumns, true);
    if (Util.isArrayEmpty(this.visibleColArray)) {
      // It is necessary to assing value to visibleColumns to propagate the parameter.
      this.visibleColumns = this.columns;
      this.visibleColArray = this.colArray;
    }

    this.descriptionColArray = Util.parseArray(this.descriptionColumns);
    if (Util.isArrayEmpty(this.descriptionColArray)) {
      this.descriptionColArray = this.visibleColArray;
    }

    const pkArray = Util.parseArray(this.parentKeys);
    this._pKeysEquiv = Util.parseParentKeysEquivalences(pkArray);

    const setValueSetArray = Util.parseArray(this.setValueOnValueChange);
    this._setValueOnValueChangeEquiv = Util.parseParentKeysEquivalences(setValueSetArray);

    if (this.form && this.queryOnBind) {
      this._formDataSubcribe = this.form.onDataLoaded.subscribe(() => this.queryData());
    }

    if (this.staticData) {
      this.queryOnBind = false;
      this.queryOnInit = false;
      this.setDataArray(this.staticData);
    } else {
      this.configureService();
      this.configureAdapter();
    }

    if (this.queryOnEvent !== undefined && this.queryOnEvent.subscribe !== undefined) {
      this.queryOnEventSubscription = this.queryOnEvent.subscribe((value) => {
        if (Util.isDefined(value) || this.queryWithNullParentKeys) {
          this.queryData();
        }
      });
    }

    if (typeof this.queryFallbackFunction !== 'function') {
      this.queryFallbackFunction = undefined;
    }



  }

  destroy() {
    super.destroy();
    if (this._formDataSubcribe) {
      this._formDataSubcribe.unsubscribe();
    }
    if (this.queryOnEventSubscription) {
      this.queryOnEventSubscription.unsubscribe();
    }
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
    if (this.subscriptionDataLoad) {
      this.subscriptionDataLoad.unsubscribe();
    }
  }

  protected emitOnValueChange(type, newValue, oldValue) {
    super.emitOnValueChange(type, newValue, oldValue);
    // Set value for 'set-value-on-value-change' components
    const record = this.getSelectedRecord();
    this.onSetValueOnValueChange.emit(record);
    const setValueSetKeys = Object.keys(this._setValueOnValueChangeEquiv);
    if (setValueSetKeys.length) {
      const formComponents = this.form.getComponents();
      setValueSetKeys.forEach(key => {
        const comp = formComponents[this._setValueOnValueChangeEquiv[key]];
        if (Util.isDefined(comp)) {
          comp.setValue(Util.isDefined(record) ? record[key] : undefined);
        }
      });
    }
  }

  /* Utility methods */
  configureService() {
    let configureServiceArgs: OConfigureServiceArgs = { injector: this.injector, baseService: OntimizeService, entity: this.entity, service: this.service, serviceType: this.serviceType };
    if (Util.isDefined(this.configureServiceArgs)) {
      configureServiceArgs = { ...configureServiceArgs, ...this.configureServiceArgs };
    }
    this.dataService = Util.configureService(configureServiceArgs);

  }

  public configureAdapter() {
    this.queryArgumentAdapter = this.injector.get(OntimizeQueryArgumentsAdapter);
  }

  getAttributesValuesToQuery(columns?: Array<any>) {
    const result = Util.isDefined(columns) ? columns : this.colArray;
    if (result.indexOf(this.valueColumn) === -1) {
      result.push(this.valueColumn);
    }
    return result;
  }

  queryData(filter?: any) {
    if (!this.dataService || !(this.queryMethod in this.dataService) || !this.entity) {
      console.warn('Service not properly configured! aborting query');
      return;
    }
    filter = Object.assign(filter || {}, ServiceUtils.getParentKeysFromForm(this._pKeysEquiv, this.form));
    if (!ServiceUtils.filterContainsAllParentKeys(filter, this._pKeysEquiv) && !this.queryWithNullParentKeys) {
      this.setDataArray([]);
    } else {
      if (this.querySubscription) {
        this.querySubscription.unsubscribe();
      }
      if (this.loaderSubscription) {
        this.loaderSubscription.unsubscribe();
      }

      this.loaderSubscription = this.load();

      this.queryArguments = this.queryArgumentAdapter.parseQueryParameters(this.getQueryArguments(filter));

      this.querySubscription = this.queryArgumentAdapter.request.apply(this.queryArgumentAdapter, [this.queryMethod, this.dataService, this.queryArguments])
        .subscribe((resp: ServiceResponse) => {
          if (resp.isSuccessful()) {
            this.cacheQueried = true;
            this.setDataArray(resp.data);
          }
          this.loadingSubject.next(false);
          this.loaderSubscription.unsubscribe();
        }, err => {
          console.error(err);
          this.loadingSubject.next(false);
          this.loaderSubscription.unsubscribe();
          if (Util.isDefined(this.queryFallbackFunction)) {
            this.queryFallbackFunction(err);
          } else {
            this.oErrorDialogManager.openErrorDialog(err);
            console.error(err);
          }
        });
    }
  }

  getQueryArguments(filter: object, ovrrArgs: OQueryDataArgs = {}): OQueryParams {
    const compFilter = filter;
    const queryCols = this.getAttributesValuesToQuery();
    const sqlTypes = (ovrrArgs?.hasOwnProperty('sqltypes')) ? ovrrArgs.sqltypes : this.form ? this.form.getAttributesSQLTypes() : {};

    return { filter: compFilter, columns: queryCols, entity: this.entity, sqlTypes: sqlTypes };
  }

  getDataArray(): any[] {
    return this.dataArray;
  }

  setDataArray(data: any): void {
    if (Util.isArray(data)) {
      this.dataArray = this.sortData(data);
    } else if (Util.isObject(data) && Object.keys(data).length > 0) {
      this.dataArray = [data];
    } else {
      console.warn('Component has received not supported service data. Supported data are Array or not empty Object');
      this.dataArray = [];
    }
    this.onDataLoaded.emit(this.dataArray);
  }

  syncDataIndex(queryIfNotFound: boolean = true) {
    this._currentIndex = undefined;
    if (Util.isDefined(this.value) && !this.isEmpty() && this.dataArray) {
      this.dataArray.forEach((item, index) => {
        if (this.value.value instanceof Array) {
          this._currentIndex = [];
          this.value.value.forEach((itemValue, indexValue) => {
            if (item[this.valueColumn] === itemValue) {
              this._currentIndex[this._currentIndex.length] = indexValue;
            }
          });
        } else if (item[this.valueColumn] === this.value.value) {
          this._currentIndex = index;
        }
        if (item[this.valueColumn] === this.value.value) {
          this._currentIndex = index;
        }
      });

      if (this._currentIndex === undefined) {
        if (queryIfNotFound &&
          this.queryOnBind && this.dataArray && this.dataArray.length === 0 && !this.cacheQueried) {
          this.queryData();
        } else if (!queryIfNotFound && this.dataArray && this.dataArray.length > 0) {
          console.warn('It was set the value ' + this.value.value + ' to the component ' + this.oattr + ' but this value does not exist in the data array and this value will be set to undefined');
          this.setValue(void 0);
        }
      }
    }
  }

  protected parseByValueColumnType(val: any) {
    let value = val;

    if (this.valueColumnType === Codes.TYPE_INT) {
      const parsed = parseInt(value, 10);
      if (!isNaN(parsed)) {
        value = parsed;
      }
    }
    return value;
  }

  setValue(val: any, options?: FormValueOptions) {
    const value = this.parseByValueColumnType(val);
    super.setValue(value, options);
  }

  setData(val: any) {
    const value = this.parseByValueColumnType(val);
    super.setData(value);
  }

  getSelectedRecord() {
    let result;
    const selectedValue = this.getValue();
    if (Util.isDefined(selectedValue)) {
      result = this.getDataArray().find(item => item[this.valueColumn] === selectedValue);
    }
    return result;
  }

  load(): any {
    const zone = this.injector.get(NgZone);
    const loadObservable = new Observable(observer => {
      const timer = window.setTimeout(() => {
        observer.next(true);
      }, this.delayLoad);

      return () => {
        window.clearTimeout(timer);
        zone.run(() => {
          observer.next(false);
          this.loading = false;
        });
      };

    });
    const subscription = loadObservable.subscribe(val => {
      zone.run(() => {
        this.loading = val as boolean;
        this.loadingSubject.next(val as boolean);
      });
    });
    return subscription;
  }

  onFormControlChange(value: any) {
    if (this.oldValue === value) {
      return;
    }
    super.onFormControlChange(value);
  }

  public getOptionDescriptionValue(item: any = {}): string {
    let descTxt = '';
    if (this.descriptionColArray && this.descriptionColArray.length > 0) {
      this.descriptionColArray.forEach((col, index) => {
        let txt = item[col];
        if (Util.isDefined(txt)) {
          if (this.translate && this.translateService) {
            txt = this.translateService.get(txt);
          }
          descTxt += txt;
        }
        if (index < this.descriptionColArray.length - 1) {
          descTxt += this.separator;
        }
      });
    }
    return descTxt.trim();
  }

  protected sortData(data: any[]): any[] {
    if (!Util.isDefined(this.sort)) {
      return data;
    }

    const sortDirection = this.sort.toLowerCase();
    if (sortDirection !== Codes.ASC_SORT && sortDirection !== Codes.DESC_SORT) {
      return data;
    }

    const sortedData = data.sort((a, b) => Util.compare(this.getOptionDescriptionValue(a), this.getOptionDescriptionValue(b)));
    if (sortDirection === Codes.DESC_SORT) {
      sortedData.reverse();
    }
    return sortedData;
  }

  refresh() {
    this.queryData();
  }

}
