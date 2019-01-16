import { EventEmitter, Injector } from '@angular/core';
import { ActivatedRoute, Router, UrlSegmentGroup, NavigationExtras } from '@angular/router';
import { Observable, Subscription, combineLatest } from 'rxjs';

import { DialogService, NavigationService, ONavigationItem } from '../../../services';
import { OFormComponent } from '../o-form.component';
import { Codes, SQLTypes, Util } from '../../../utils';
import { OFormLayoutManagerComponent, IDetailComponentData } from '../../../layouts/form-layout/o-form-layout-manager.component';
import { OFormLayoutDialogComponent } from '../../../layouts/form-layout/dialog/o-form-layout-dialog.component';

export class OFormNavigationClass {

  formLayoutManager: OFormLayoutManagerComponent;
  formLayoutDialog: OFormLayoutDialogComponent;
  id: string;

  protected dialogService: DialogService;
  protected navigationService: NavigationService;

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

  protected onCloseTabSubscription: Subscription;
  protected cacheStateSubscription: Subscription;

  constructor(
    protected injector: Injector,
    protected form: OFormComponent,
    protected router: Router,
    protected actRoute: ActivatedRoute
  ) {
    this.dialogService = injector.get(DialogService);
    this.navigationService = injector.get(NavigationService);

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
    this.combinedNavigationStream = combineLatest(
      self.onUrlParamChangedStream.asObservable()
    );

    this.combinedNavigationStream.subscribe(valArr => {
      if (Util.isArray(valArr) && valArr.length === 1 && valArr[0]) {
        self.navigationStream.emit(true);
      }
    });

    if (this.formLayoutManager && this.formLayoutManager.isTabMode()) {
      this.onCloseTabSubscription = this.formLayoutManager.onCloseTab.subscribe((args: any) => {
        if (args.id === self.id) {
          const closeTabEmitter: EventEmitter<boolean> = args.onCloseTabAccepted;
          self.showConfirmDiscardChanges().then(res => {
            closeTabEmitter.emit(res);
          });
        }
      });
    }
  }

  initialize() {
    if (this.formLayoutManager && this.formLayoutManager.isTabMode()) {
      this.id = this.formLayoutManager.getLastTabId();
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
      const cacheData: IDetailComponentData = this.formLayoutManager.getFormCacheData(this.id);
      if (Util.isDefined(cacheData)) {
        this.queryParams = cacheData.queryParams || {};
        this.parseQueryParams();
      }
    } else {
      const self = this;
      this.qParamSub = this.actRoute.queryParams.subscribe(params => {
        if (params) {
          self.queryParams = params;
          self.parseQueryParams();
        }
      });
    }
  }

  private parseQueryParams() {
    let isDetail = this.queryParams[Codes.IS_DETAIL];
    // ensuring isdetail = false when using form layout manager
    this.form.isDetailForm = this.formLayoutManager ? false : (isDetail === 'true');
  }

  subscribeToUrlParams() {
    if (this.formLayoutManager) {
      const cacheData: IDetailComponentData = this.formLayoutManager.getFormCacheData(this.id);
      if (Util.isDefined(cacheData)) {
        this.urlParams = cacheData.params;
        this.parseUrlParams();
      }
    } else {
      const self = this;
      this.urlParamSub = this.actRoute.params.subscribe(params => {
        self.urlParams = params;
        self.parseUrlParams();
      });
    }
  }

  private parseUrlParams() {
    if (this.urlParams[Codes.PARENT_KEYS_KEY] !== undefined) {
      this.form.formParentKeysValues = Util.decodeParentKeys(this.urlParams[Codes.PARENT_KEYS_KEY]);
    }
    //TODO Obtain 'datatype' of each key contained into urlParams for
    // for building correctly query filter!!!!
    if (this.urlParams) {
      this.onUrlParamChangedStream.emit(true);
    }
  }

  subscribeToUrl() {
    if (this.formLayoutManager) {
      const cacheData: IDetailComponentData = this.formLayoutManager.getFormCacheData(this.id);
      if (Util.isDefined(cacheData)) {
        this.urlSegments = cacheData.urlSegments;
      }
    } else {
      const self = this;
      this.urlSub = this.actRoute.url.subscribe(urlSegments => {
        self.urlSegments = urlSegments;
      });
    }
  }

  subscribeToCacheChanges(onCacheEmptyStateChanges: EventEmitter<boolean>) {
    this.cacheStateSubscription = onCacheEmptyStateChanges.asObservable().subscribe(res => {
      this.setModifiedState(!res);
    });
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
    let filter = Object.assign({}, this.getUrlParams() || {});
    const urlParamsKeys = Object.keys(filter || {});
    if (urlParamsKeys.length > 0) {
      urlParamsKeys.forEach(key => {
        if (key === Codes.PARENT_KEYS_KEY) {
          delete filter[key];
          Object.assign(filter, this.form.formParentKeysValues);
        }
      });
    }
    return filter;
  }

  getUrlSegments() {
    return this.urlSegments;
  }

  getQueryParams() {
    return this.queryParams;
  }

  setUrlParams(val: Object) {
    this.urlParams = val;
  }

  getUrlParams() {
    return this.urlParams;
  }

  setModifiedState(modified: boolean) {
    if (this.formLayoutManager) {
      this.formLayoutManager.setModifiedState(modified, this.id);
    }
  }

  updateNavigation() {
    if (this.formLayoutManager && this.formLayoutManager.allowToUpdateNavigation(this.form.oattr)) {
      let formData = undefined;
      if (!this.form.isInInsertMode()) {
        formData = {};
        const self = this;
        Object.keys(this.form.formData).forEach(key => {
          formData[key] = self.form.formData[key].value;
        });
      }
      this.formLayoutManager.updateNavigation(formData, this.id);
    }
  }

  navigateBack() {
    if (!this.formLayoutManager && this.navigationService) {
      const navData: ONavigationItem = this.navigationService.getPreviousRouteData();
      if (navData) {
        let extras = {};
        extras[Codes.QUERY_PARAMS] = navData.queryParams;
        this.router.navigate([navData.url], extras);
      }
    }
  }

  closeDetailAction(options?: any) {
    if (this.formLayoutManager) {
      this.formLayoutManager.closeDetail(this.id);
    } else if (this.navigationService) {
      this.form.beforeCloseDetail.emit();
      const navData: ONavigationItem = this.navigationService.getPreviousRouteData();
      if (navData) {
        let extras: NavigationExtras = {};
        extras[Codes.QUERY_PARAMS] = navData.queryParams;
        this.router.navigate([navData.url], extras).then(val => {
          if (val && options && options.changeToolbarMode) {
            this.form.getFormToolbar().setInitialMode();
          }
        });
      }
    }
  }

  stayInRecordAfterInsert(insertedKeys: Object) {
    if (this.formLayoutManager) {
      this.form.setInitialMode();
    } else if (this.navigationService && this.form.keysArray && insertedKeys) {
      let params: any[] = [];
      this.form.keysArray.forEach((current, index) => {
        if (insertedKeys[current]) {
          params.push(insertedKeys[current]);
        }
      });
      let extras: NavigationExtras = {};
      let qParams: any = Object.assign({}, this.getQueryParams(), Codes.getIsDetailObject());
      extras[Codes.QUERY_PARAMS] = qParams;
      let route = [];
      const navData: ONavigationItem = this.navigationService.getPreviousRouteData();
      if (navData) {
        route.push(navData.url);
        const detailRoute = navData.getDetailFormRoute();
        if (Util.isDefined(detailRoute)) {
          route.push(detailRoute);
        }
        route.push(...params);
        // deleting insertFormRoute as active mode (because stayInRecordAfterInsert changes it)
        this.navigationService.deleteActiveFormMode(navData);
      } else {
        extras.relativeTo = this.actRoute;
        route = ['../', ...params];
      }
      this.router.navigate(route, extras);
    }
  }

  /**
  * Navigates to 'insert' mode
  */
  goInsertMode(options?: any) {
    if (this.formLayoutManager && this.formLayoutManager.isDialogMode()) {
      this.form.setInsertMode();
    } else if (this.navigationService) {
      let route = [];
      let extras: NavigationExtras = {};
      const navData: ONavigationItem = this.navigationService.getPreviousRouteData();
      if (!this.formLayoutManager && navData) {
        route.push(navData.url);
        const detailRoute = navData.getDetailFormRoute();
        if (Util.isDefined(detailRoute)) {
          route.push(detailRoute);
        }
        route.push(navData.getInsertFormRoute());
      } else {
        extras.relativeTo = this.actRoute;
        route = ['../' + Codes.DEFAULT_INSERT_ROUTE];
      }
      this.storeNavigationFormRoutes('insertFormRoute');
      this.router.navigate(route, extras).then((val) => {
        if (val && options && options.changeToolbarMode) {
          this.form.getFormToolbar().setInsertMode();
        }
      });
    }
  }

  /**
   * Navigates to 'edit' mode
   */
  goEditMode(options?: any) {
    if (this.formLayoutManager && this.formLayoutManager.isDialogMode()) {
      this.form.setUpdateMode();
    } else if (this.navigationService) {
      let route = [];
      let extras: NavigationExtras = {};
      if (this.form.isDetailForm) {
        extras[Codes.QUERY_PARAMS] = Codes.getIsDetailObject();
      }
      extras[Codes.QUERY_PARAMS] = Object.assign({}, this.getQueryParams(), extras[Codes.QUERY_PARAMS] || {});

      let params: any[] = [];
      const urlParams = this.getUrlParams();
      this.form.keysArray.map(key => {
        if (urlParams[key]) {
          params.push(urlParams[key]);
        }
      });
      const navData: ONavigationItem = this.navigationService.getPreviousRouteData();
      if (Util.isDefined(navData)) {
        route.push(navData.url);
        const detailRoute = navData.getDetailFormRoute();
        if (Util.isDefined(detailRoute)) {
          route.push(detailRoute);
        }
        route.push(...params);
        route.push(navData.getEditFormRoute());
      } else {
        extras.relativeTo = this.actRoute;
        route = ['../', ...params, Codes.DEFAULT_EDIT_ROUTE];
      }
      this.storeNavigationFormRoutes('editFormRoute');
      this.form.beforeGoEditMode.emit();
      this.router.navigate(route, extras).then((val) => {
        if (val && options && options.changeToolbarMode) {
          this.form.getFormToolbar().setEditMode();
        }
      });
    }
  }

  /**
  * @deprecated
  */
  getNestedLevelsNumber() {
    let actRoute = this.actRoute;
    let i = 0;
    while (actRoute.parent) {
      actRoute = actRoute.parent;
      actRoute.url.subscribe(function (x) {
        if (x && x.length) {
          i++;
        }
      });
    }
    return i;
  }

  /**
  * @deprecated
  */
  getFullUrlSegments() {
    let fullUrlSegments = [];
    const router = this.router;
    if (router && router.url && router.url.length) {
      const root: UrlSegmentGroup = router.parseUrl(router.url).root;
      if (root && root.hasChildren() && root.children.primary) {
        fullUrlSegments = root.children.primary.segments;
      }
    }
    return fullUrlSegments;
  }

  showConfirmDiscardChanges(): Promise<boolean> {
    let subscription: Promise<boolean> = undefined;
    if (this.form.isInitialStateChanged() && !this.form.isInInsertMode()) {
      subscription = this.dialogService.confirm('CONFIRM', 'MESSAGES.FORM_CHANGES_WILL_BE_LOST');
    }
    if (subscription === undefined) {
      const observable = Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
      subscription = observable.toPromise();
    }
    return subscription;
  }

  protected storeNavigationFormRoutes(activeMode: string) {
    this.navigationService.storeFormRoutes({
      detailFormRoute: Codes.DEFAULT_DETAIL_ROUTE,
      editFormRoute: Codes.DEFAULT_EDIT_ROUTE,
      insertFormRoute: Codes.DEFAULT_INSERT_ROUTE
    }, activeMode);
  }

}
