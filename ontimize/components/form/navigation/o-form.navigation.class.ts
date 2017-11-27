
// import { IFormControlComponent } from '../../o-form-data-component.class';
import { Injector, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Util, SQLTypes } from '../../../utils';
import { OFormComponent } from '../o-form.component';
import { OFormLayoutManagerComponent } from '../../../layouts/form-layout/o-form-layout-manager.component';
import { OFormLayoutDialogComponent } from '../../../layouts/form-layout/dialog/o-form-layout-dialog.component';


export class OFormNavigationClass {

  formLayoutManager: OFormLayoutManagerComponent;
  formLayoutDialog: OFormLayoutDialogComponent;
  index: number;

  protected qParamSub: Subscription;
  protected queryParams: any;

  protected urlParamSub: Subscription;
  protected urlParams: Object;

  protected urlSub: Subscription;
  protected urlSegments: any = [];

  protected combinedNavigationStream: Observable<any>;
  protected combinedNavigationStreamSubscription: Subscription;
  protected onUrlParamChangedStream: EventEmitter<Object> = new EventEmitter<Object>();

  public navigationStream: EventEmitter<Object> = new EventEmitter<Object>();

  constructor(
    protected injector: Injector,
    protected form: OFormComponent
  ) {
    try {
      this.formLayoutManager = this.injector.get(OFormLayoutManagerComponent);
    } catch (e) {
      // No parent formLayoutManager
    }

    try {
      this.formLayoutDialog = this.injector.get(OFormLayoutDialogComponent);
    } catch (e) {
      // No parent form layout dialog
    }

    if (this.formLayoutDialog && !this.formLayoutManager) {
      this.formLayoutManager = this.formLayoutDialog.formLayoutManager;
    }

    const self = this;
    this.combinedNavigationStream = Observable.combineLatest(
      self.onUrlParamChangedStream.asObservable()
    );

    this.combinedNavigationStream.subscribe(valArr => {
      if (Util.isArray(valArr) && valArr.length === 1 && valArr[0]) {
        self.navigationStream.emit(true);
      }
    });
  }

  initialize() {
    if (this.formLayoutManager) {
      this.index = this.formLayoutManager.getLastTabIndex();
    }
  }
  destroy() {
    if (this.qParamSub) {
      this.qParamSub.unsubscribe();
    }
    if (this.urlParamSub) {
      this.urlParamSub.unsubscribe();
    }
    if (this.urlSub) {
      this.urlSub.unsubscribe();
    }
    if (this.combinedNavigationStreamSubscription) {
      this.combinedNavigationStreamSubscription.unsubscribe();
    }
  }

  subscribeToQueryParams() {
    if (this.formLayoutManager) {
      const cacheData = this.formLayoutManager.getFormCacheData(this.index);
      this.queryParams = cacheData.queryParams || {};
      this.parseQueryParams();
    } else {
      const self = this;
      this.qParamSub = this.form.getActRoute().queryParams.subscribe(params => {
        if (params) {
          self.queryParams = params;
          self.parseQueryParams();
        }
      });
    }
  }

  private parseQueryParams() {
    let isDetail = this.queryParams['isdetail'];
    this.form.isDetailForm = (isDetail === 'true');
  }

  subscribeToUrlParams() {
    if (this.formLayoutManager) {
      const cacheData = this.formLayoutManager.getFormCacheData(this.index);
      this.urlParams = cacheData.urlParams;
      this.parseUrlParams();
    } else {
      const self = this;
      this.urlParamSub = this.form.getActRoute().params.subscribe(params => {
        self.urlParams = params;
        self.parseUrlParams();
      });
    }
  }

  private parseUrlParams() {
    if (this.urlParams[OFormComponent.PARENT_KEYS_KEY] !== undefined) {
      this.form.formParentKeysValues = Util.decodeParentKeys(this.urlParams[OFormComponent.PARENT_KEYS_KEY]);
    }
    //TODO Obtain 'datatype' of each key contained into urlParams for
    // for building correctly query filter!!!!
    if (this.urlParams && Object.keys(this.urlParams).length > 0) {
      this.onUrlParamChangedStream.emit(true);
    }
  }

  subscribeToUrl() {
    if (this.formLayoutManager) {
      // TODO
    } else {
      const self = this;
      this.urlSub = this.form.getActRoute().url.subscribe(urlSegments => {
        self.urlSegments = urlSegments;
      });
    }
  }

  getCurrentKeysValues(): Object {
    let filter = {};
    if (this.urlParams) {
      filter = this.getFilterFromObject(this.urlParams);
    }
    return filter;
  }

  private getFilterFromObject(objectParam: any) {
    let filter = {};
    if (!objectParam || Object.keys(objectParam).length === 0) {
      return filter;
    }
    if (this.form.keysArray) {
      this.form.keysArray.map((key, index) => {
        if (objectParam[key]) {
          filter[key] = SQLTypes.parseUsingSQLType(objectParam[key], this.form.keysSqlTypesArray[index]);
        }
      });
    }
    Object.keys(this.form._pKeysEquiv).forEach(item => {
      let urlVal = objectParam[this.form._pKeysEquiv[item]];
      if (urlVal) {
        filter[item] = urlVal;
      }
    });
    return filter;
  }

  getFilterFromUrlParams() {
    let filter = {};
    const urlParams = this.getUrlParams();
    if (urlParams) {
      for (let key in urlParams) {
        if (urlParams.hasOwnProperty(key)) {
          filter[key] = urlParams[key];
        }
      }
    }
    return filter;
  }

  getUrlSegments() {
    return this.urlSegments;
  }

  getQueryParams() {
    return this.queryParams;
  }

  getUrlParams() {
    return this.urlParams;
  }

  updateNavigation() {
    if (this.formLayoutManager) {
      this.formLayoutManager.updateNavigation(this.index);
    }
  }
}
