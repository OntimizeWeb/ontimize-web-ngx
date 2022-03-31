import { EventEmitter, Injector } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, UrlSegmentGroup } from '@angular/router';
import { combineLatest, Observable, Subscription } from 'rxjs';

import { OFormLayoutDialogComponent } from '../../../layouts/form-layout/dialog/o-form-layout-dialog.component';
import { OFormLayoutManagerComponent } from '../../../layouts/form-layout/o-form-layout-manager.component';
import { NavigationService, ONavigationItem } from '../../../services/navigation.service';
import {
  FormLayoutCloseDetailOptions,
  FormLayoutDetailComponentData
} from '../../../types/form-layout-detail-component-data.type';
import { Codes } from '../../../util/codes';
import { SQLTypes } from '../../../util/sqltypes';
import { Util } from '../../../util/util';
import { OFormComponent } from '../o-form.component';
import { OFormConfirmExitService } from './o-form-confirm-exit.service';

export class OFormNavigationClass {

  formLayoutManager: OFormLayoutManagerComponent;
  formLayoutDialog: OFormLayoutDialogComponent;

  protected navigationService: NavigationService;
  protected confirmExitService: OFormConfirmExitService;

  protected qParamSub: Subscription;
  protected queryParams: any;

  protected urlParamSub: Subscription;
  protected urlParams: object;

  protected urlSub: Subscription;
  protected urlSegments: any = [];

  protected combinedNavigationStream: Observable<any>;
  protected combinedNavigationStreamSubscription: Subscription;
  protected onUrlParamChangedStream: EventEmitter<boolean> = new EventEmitter<boolean>();

  public navigationStream: EventEmitter<boolean> = new EventEmitter<boolean>();

  protected onCloseTabSubscription: Subscription;
  protected cacheStateSubscription: Subscription;

  constructor(
    protected injector: Injector,
    protected form: OFormComponent,
    protected router: Router,
    protected actRoute: ActivatedRoute
  ) {
    this.navigationService = injector.get(NavigationService);
    this.confirmExitService = injector.get(OFormConfirmExitService);

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
    this.combinedNavigationStream = combineLatest([self.onUrlParamChangedStream.asObservable()]);

    this.combinedNavigationStream.subscribe(valArr => {
      if (Util.isArray(valArr) && valArr.length === 1 && valArr[0]) {
        self.navigationStream.emit(true);
      }
    });
  }

  initialize() {
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
      const cacheData: FormLayoutDetailComponentData = this.formLayoutManager.getFormCacheData();
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
    const isDetail = this.queryParams[Codes.IS_DETAIL];
    // ensuring isdetail = false when using form layout manager
    this.form.isDetailForm = this.formLayoutManager ? false : (isDetail === 'true');
  }

  subscribeToUrlParams() {
    if (this.formLayoutManager) {
      const cacheData: FormLayoutDetailComponentData = this.formLayoutManager.getFormCacheData();
      if (Util.isDefined(cacheData)) {
        this.urlParams = cacheData.params;
        this.parseUrlParams();
      }
    } else {
      const self = this;
      this.urlParamSub = this.actRoute.params.subscribe(params => {
        self.urlParams = params;
        this.parseUrlParams();
      });
    }
  }

  private parseUrlParams() {
    if (Util.isDefined(this.urlParams) && Util.isDefined(this.urlParams[Codes.PARENT_KEYS_KEY])) {
      this.form.formParentKeysValues = Util.decodeParentKeys(this.urlParams[Codes.PARENT_KEYS_KEY]);
    }
    // TODO Obtain 'datatype' of each key contained into urlParams for
    // for building correctly query filter!!!!
    if (this.urlParams) {
      this.onUrlParamChangedStream.emit(true);
    }
  }

  subscribeToUrl() {
    if (this.formLayoutManager) {
      const cacheData: FormLayoutDetailComponentData = this.formLayoutManager.getFormCacheData();
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

  subscribeToCacheChanges() {
    const formCache = this.form.getFormCache();
    if (!Util.isDefined(formCache)) {
      return;
    }
    this.cacheStateSubscription = formCache.onCacheStateChanges.subscribe(() => {
      const initialStateChanged = this.form.isInitialStateChanged();
      const triggerExitConfirm = this.form.confirmExit && this.form.isInitialStateChanged(this.form.ignoreOnExit);
      this.setModifiedState(initialStateChanged, triggerExitConfirm);
    });
  }

  getCurrentKeysValues(): object {
    let filter = {};
    if (this.urlParams) {
      filter = this.getFilterFromObject(this.urlParams);
    }
    return filter;
  }

  private getFilterFromObject(objectParam: any) {
    const filter = {};
    if (!objectParam || Object.keys(objectParam).length === 0) {
      return filter;
    }
    if (this.form.keysArray) {
      this.form.keysArray.forEach((key, index) => {
        if (objectParam[key]) {
          filter[key] = SQLTypes.parseUsingSQLType(objectParam[key], this.form.keysSqlTypesArray[index]);
        }
      });
    }
    Object.keys(this.form._pKeysEquiv).forEach((item, index) => {
      const urlVal = objectParam[this.form._pKeysEquiv[item]];
      if (urlVal) {
        filter[item] = SQLTypes.parseUsingSQLType(urlVal, this.form.keysSqlTypesArray[index]);
      }
    });
    return filter;
  }

  getFilterFromUrlParams() {
    const filter = Object.assign({}, this.getUrlParams() || {});
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

  setUrlParams(val: object) {
    this.urlParams = val;
  }

  getUrlParams() {
    return this.urlParams;
  }

  protected setModifiedState(modified: boolean, confirmExit: boolean) {
    if (this.formLayoutManager) {
      this.formLayoutManager.setModifiedState(this.form.oattr, modified, confirmExit);
    }
  }

  updateNavigation() {
    if (this.formLayoutManager) {
      const isInInsertMode = this.form.isInInsertMode();
      let formData;
      if (isInInsertMode) {
        formData = {};
        formData.new_tab_title = 'LAYOUT_MANANGER.INSERTION_MODE_TITLE';
      } else if (this.formLayoutManager.allowToUpdateNavigation(this.form.oattr)) {
        formData = {};
        Object.keys(this.form.formData).forEach(key => {
          formData[key] = this.form.formData[key].value;
        });
      }
      if (formData) {
        this.formLayoutManager.updateNavigation(formData, this.form.getKeysValues(), isInInsertMode);
      }
    }
  }

  navigateBack(options?: any) {
    if (this.formLayoutManager) {
      this.formLayoutManager.closeDetail();
    } else if (this.navigationService) {
      this.navigationService.removeLastItem();
      if (options && options.ignoreNavigation) {
        return;
      }
      const navData: ONavigationItem = this.navigationService.getLastItem();
      if (navData) {
        const extras = {};
        extras[Codes.QUERY_PARAMS] = navData.queryParams;
        this.router.navigate([navData.url], extras);
      }
    }
  }

  closeDetailAction(options?: any) {
    if (this.formLayoutManager) {
      this.formLayoutManager.closeDetail(options);
    } else if (this.navigationService) {
      this.form.beforeCloseDetail.emit();
      // `removeLastItemsUntilMain` may not remove all necessary items so current route will be checked below
      if (!this.navigationService.removeLastItemsUntilMain()) {
        // `removeLastItemsUntilMain` didn't find the main navigation item
        this.navigationService.removeLastItem();
      }
      if (options && options.ignoreNavigation) {
        return;
      }
      let navData: ONavigationItem = this.navigationService.getLastItem();
      if (navData) {
        // if navData route is the same as the current route, remove last item
        if (this.navigationService.isCurrentRoute(navData.url)) {
          this.navigationService.removeLastItem();
          navData = this.navigationService.getLastItem();
        }
        const extras: NavigationExtras = {};
        extras[Codes.QUERY_PARAMS] = navData.queryParams;
        this.router.navigate([navData.url], extras).then(val => {
          if (val && options && options.changeToolbarMode) {
            this.form.getFormToolbar().setInitialMode();
          }
        });
      }
    }
  }

  stayInRecordAfterInsert(insertedKeys: object) {
    if (this.navigationService && this.form.keysArray && insertedKeys) {
      if (this.formLayoutManager) {
        const closeOpts: FormLayoutCloseDetailOptions = { exitWithoutConfirmation: true };
        this.formLayoutManager.closeDetail(closeOpts);
        this.formLayoutManager.setAsActiveFormLayoutManager();
      } else {
        // Remove 'new' navigation item from history
        this.navigationService.removeLastItem();
      }
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
      const navData: ONavigationItem = this.navigationService.getLastMainNavigationRouteData();
      if (navData) {
        let url = navData.url;
        const detailRoute = navData.getDetailFormRoute();
        if (Util.isDefined(detailRoute)) {
          route.push(detailRoute);
          const detailIndex = url.lastIndexOf('/' + detailRoute);
          if (detailIndex !== -1) {
            url = url.substring(0, detailIndex);
          }
        }
        route.unshift(url);
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
    if (this.formLayoutManager && this.formLayoutManager.allowNavigation()) {
      this.form.setInsertMode();
    } else if (this.navigationService) {
      if (this.formLayoutManager) {
        this.formLayoutManager.setAsActiveFormLayoutManager();
      }

      let route = [];
      const extras: NavigationExtras = {};
      const navData: ONavigationItem = this.navigationService.getLastMainNavigationRouteData();
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
        if (this.formLayoutManager && this.formLayoutManager.isTabMode()) {
          extras.queryParams = {};
          extras.queryParams[Codes.INSERTION_MODE] = 'true';
        }
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
    if (this.formLayoutManager && this.formLayoutManager.allowNavigation()) {
      this.form.setUpdateMode();
    } else if (this.navigationService) {
      let route = [];
      const extras: NavigationExtras = {};
      if (this.form.isDetailForm) {
        extras[Codes.QUERY_PARAMS] = Codes.getIsDetailObject();
      }
      extras[Codes.QUERY_PARAMS] = Object.assign({}, this.getQueryParams(), extras[Codes.QUERY_PARAMS] || {});

      const params: any[] = [];
      const urlParams = this.getUrlParams();
      this.form.keysArray.forEach(key => {
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
      this.form.beforeUpdateMode.emit();
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
      actRoute.url.subscribe((x) => {
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

  showConfirmDiscardChanges(ignoreAttrs: string[] = []): Promise<boolean> {
    return this.confirmExitService.subscribeToDiscardChanges(this.form, ignoreAttrs);
  }

  protected storeNavigationFormRoutes(activeMode: string) {
    const prevRouteData = this.navigationService.getPreviousRouteData();
    if (!Util.isDefined(prevRouteData)) {
      return;
    }
    const formRoutes = prevRouteData.formRoutes;
    this.navigationService.storeFormRoutes({
      detailFormRoute: formRoutes ? formRoutes.detailFormRoute : Codes.DEFAULT_DETAIL_ROUTE,
      editFormRoute: formRoutes ? formRoutes.editFormRoute : Codes.DEFAULT_EDIT_ROUTE,
      insertFormRoute: formRoutes ? formRoutes.insertFormRoute : Codes.DEFAULT_INSERT_ROUTE
    }, activeMode);
  }

}
