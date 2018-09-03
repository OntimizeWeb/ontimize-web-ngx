import { EventEmitter, Injector } from '@angular/core';
import { ActivatedRoute, Router, UrlSegmentGroup } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/operator/combineLatest';

import { DialogService, NavigationService, ONavigationItem } from '../../../services';
import { OFormComponent } from '../o-form.component';
import { Codes, SQLTypes, Util } from '../../../utils';
import { OFormLayoutManagerComponent } from '../../../layouts/form-layout/o-form-layout-manager.component';
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
    this.combinedNavigationStream = Observable.combineLatest(
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
    if (this.formLayoutManager) {
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
      const cacheData = this.formLayoutManager.getFormCacheData(this.id);
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
      const cacheData = this.formLayoutManager.getFormCacheData(this.id);
      if (Util.isDefined(cacheData)) {
        this.urlParams = cacheData.urlParams;
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
    if (this.urlParams && Object.keys(this.urlParams).length > 0) {
      this.onUrlParamChangedStream.emit(true);
    }
  }

  subscribeToUrl() {
    if (this.formLayoutManager) {
      const cacheData = this.formLayoutManager.getFormCacheData(this.id);
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

  updateNavigation(formData: any) {
    if (this.formLayoutManager) {
      this.formLayoutManager.updateNavigation(formData, this.id);
    }
  }

  navigateBack() {
    if (!this.formLayoutManager && this.navigationService) {
      const previosRouteData: ONavigationItem = this.navigationService.getPreviousRouteData();
      if (previosRouteData) {
        let extras = {};
        extras[Codes.QUERY_PARAMS] = previosRouteData.queryParams;
        this.router.navigate([previosRouteData.url], extras);
      }
    }
  }

  closeDetailAction(options?: any) {
    if (this.formLayoutManager) {
      this.formLayoutManager.closeDetail(this.id);
    } else if (this.navigationService) {
      this.form.beforeCloseDetail.emit();
      const previosRouteData: ONavigationItem = this.navigationService.getPreviousRouteData();
      if (previosRouteData) {
        let extras = {};
        extras[Codes.QUERY_PARAMS] = previosRouteData.queryParams;
        this.router.navigate([previosRouteData.url], extras).then(val => {
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
    } else if (this.navigationService) {
      const previosRouteData: ONavigationItem = this.navigationService.getPreviousRouteData();
      if (previosRouteData) {
        let urlText = previosRouteData.url;
        if (this.form.keysArray && insertedKeys) {
          const detailRoute = previosRouteData.getDetailFormRoute();
          if (Util.isDefined(detailRoute)) {
            urlText += '/' + detailRoute;
          }
          urlText += '/';
          this.form.keysArray.forEach((current, index) => {
            if (insertedKeys[current]) {
              urlText += insertedKeys[current];
              if (index < this.form.keysArray.length - 1) {
                urlText += '/';
              }
            }
          });
        }
        let extras = Object.assign({}, this.getQueryParams(), Codes.getIsDetailObject());
        this.router.navigate([urlText], extras);
      }
    }
  }

  /**
  * Navigates to 'insert' mode
  */
  goInsertMode(options?: any) {
    if (this.navigationService) {
      const previosRouteData: ONavigationItem = this.navigationService.getPreviousRouteData();
      if (previosRouteData) {
        let extras = { relativeTo: this.actRoute };

        const insertRoute = previosRouteData.getInsertFormRoute();
        const urlText = '../' + insertRoute;

        this.storeNavigationFormRoutes('insertFormRoute');
        this.router.navigate([urlText], extras).then((val) => {
          if (val && options && options.changeToolbarMode) {
            this.form.getFormToolbar().setInsertMode();
          }
        });
      }
    }
  }

  /**
   * Navigates to 'edit' mode
   */
  goEditMode(options?: any) {
    if (this.navigationService) {
      const previosRouteData: ONavigationItem = this.navigationService.getPreviousRouteData();
      if (previosRouteData) {
        this.form.beforeGoEditMode.emit();

        // const urlTextArr = [];
        // const editRoute = previosRouteData.getInsertFormRoute();

        let url = '';
        const urlParams = this.getUrlParams();
        this.form.keysArray.map(key => {
          if (urlParams[key]) {
            url += urlParams[key];
          }
        });

        let extras = { relativeTo: this.actRoute };
        if (this.form.isDetailForm) {
          extras[Codes.QUERY_PARAMS] = Codes.getIsDetailObject();
        }
        extras[Codes.QUERY_PARAMS] = Object.assign({}, this.getQueryParams(), extras[Codes.QUERY_PARAMS] || {});

        this.storeNavigationFormRoutes('editFormRoute');
        this.router.navigate(['../', url, Codes.DEFAULT_EDIT_ROUTE], extras).then((val) => {
          if (val && options && options.changeToolbarMode) {
            this.form.getFormToolbar().setEditMode();
          }
        });
      }
    }
  }

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
    if (this.form.isInitialStateChanged()) {
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

  protected storeNavigationFormRoutes(activeFormMode: string) {
    this.navigationService.storeFormRoutes({
      detailFormRoute: Codes.DEFAULT_DETAIL_ROUTE,
      editFormRoute: Codes.DEFAULT_EDIT_ROUTE,
      insertFormRoute: Codes.DEFAULT_INSERT_ROUTE
    }, activeFormMode);
  }

}
