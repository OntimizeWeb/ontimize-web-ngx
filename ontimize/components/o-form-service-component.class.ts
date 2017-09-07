import { Injector, ElementRef } from '@angular/core';
import { InputConverter } from '../decorators';
import { OntimizeService } from '../services';
import { OFormComponent } from './form/o-form.component';
import { OFormDataComponent } from './o-form-data-component.class';
import { Util } from '../utils';
import { Subscription } from 'rxjs/Subscription';

export class OFormServiceComponent extends OFormDataComponent {

  /* Inputs */
  protected staticData: Array<any>;
  protected entity: string;
  protected service: string;
  protected columns: string;
  protected valueColumn: string;
  protected parentKeys: string;
  protected visibleColumns: string;
  protected descriptionColumns: string;
  @InputConverter()
  protected queryOnInit: boolean = true;
  @InputConverter()
  protected queryOnBind: boolean = false;
  protected serviceType: string;

  /* Internal variables */
  protected dataArray: any[] = [];
  protected colArray: string[] = [];
  protected visibleColArray: string[] = [];
  protected descriptionColArray: string[] = [];
  protected dataService: OntimizeService;
  protected querySuscription: Subscription;
  protected cacheQueried: boolean = false;
  protected _pKeysEquiv = {};
  protected _formDataSubcribe;
  protected _currentIndex;

  constructor(form: OFormComponent, elRef: ElementRef, injector: Injector) {
    super(form, elRef, injector);
    this.form = form;
    this.elRef = elRef;
  }

  initialize() {
    super.initialize();

    this.cacheQueried = false;
    this.colArray = Util.parseArray(this.columns);

    this.visibleColArray = Util.parseArray(this.visibleColumns);
    if (Util.isArrayEmpty(this.visibleColArray)) {
      //It is necessary to assing value to visibleColumns to propagate the parameter.
      this.visibleColumns = this.columns;
      this.visibleColArray = this.colArray;
    }

    this.descriptionColArray = Util.parseArray(this.descriptionColumns);
    if (Util.isArrayEmpty(this.descriptionColArray)) {
      this.descriptionColArray = this.visibleColArray;
    }

    let pkArray = Util.parseArray(this.parentKeys);
    this._pKeysEquiv = Util.parseParentKeysEquivalences(pkArray);

    if (this.form) {
      var self = this;
      if (self.queryOnBind) {
        this._formDataSubcribe = this.form.onFormDataLoaded.subscribe(data => {
          self.onFormDataBind(data);
        });
      }
    }

    if (this.staticData) {
      this.queryOnBind = false;
      this.queryOnInit = false;
      this.setDataArray(this.staticData);
    } else {
      this.configureService();
    }
  }

  destroy() {
    super.destroy();
    if (this._formDataSubcribe) {
      this._formDataSubcribe.unsubscribe();
    }
  }

  /* Utility methods */
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

  onFormDataBind(bindedData: Object) {
    let filter = {};
    let keys = Object.keys(this._pKeysEquiv);
    if (keys && keys.length > 0 && bindedData) {
      keys.forEach(item => {
        let value = bindedData[item];
        if (value) {
          filter[this._pKeysEquiv[item]] = value;
        }
      });
    }
    this.queryData(filter);
  }

  queryData(filter: Object = {}, columns?: Array<any>) {
    var self = this;
    if (columns === undefined || columns === null) {
      columns = this.colArray;
    }
    if (this.dataService === undefined) {
      console.warn('No service configured! aborting query');
      return;
    }
    if (this.querySuscription) {
      this.querySuscription.unsubscribe();
    }
    this.querySuscription = this.dataService.query(filter, columns, this.entity)
      .subscribe(resp => {
        if (resp.code === 0) {
          self.cacheQueried = true;
          self.setDataArray(resp.data);
        } else {
          console.log('error');
        }
      }, err => {
        console.log(err);
      });
  }

  getDataArray(): any[] {
    return this.dataArray;
  }

  setDataArray(data: any): void {
    if (Util.isArray(data)) {
      this.dataArray = data;
      this.syncDataIndex();
    } else if (Util.isObject(data)) {
      this.dataArray = [data];
    } else {
      console.warn('Component has received not supported service data. Supported data are Array or Object');
      this.dataArray = [];
    }
  }

  syncDataIndex() {
    this._currentIndex = undefined;
    if (this.value && this.value.value && this.dataArray) {
      let self = this;
      this.dataArray.forEach((item, index) => {
        if (item[self.valueColumn] === this.value.value) {
          self._currentIndex = index;
        }
      });

      if (this._currentIndex === undefined) {
        if (this.queryOnBind && this.dataArray && this.dataArray.length === 0
          && !this.cacheQueried && !this.isEmpty()) {
          this.queryData();
        }
        return;
      }
    }
  }

}
