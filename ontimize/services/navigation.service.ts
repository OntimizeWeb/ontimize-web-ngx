import { Injectable, Injector, EventEmitter } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { Codes, Util } from '../utils';
import { ObservableWrapper } from '../util/async';
import { ILocalStorageComponent, LocalStorageService } from './local-storage.service';

export type ONavigationRoutes = {
  mainFormLayoutManagerComponent?: boolean;
  detailFormRoute: string;
  editFormRoute: string;
  insertFormRoute: string;
};

export class ONavigationItem {
  url: string;
  queryParams: Object;
  text: string;
  displayText: string;
  terminal: boolean;
  activeFormMode: string;
  formRoutes: ONavigationRoutes;
  formLayoutRoutes: ONavigationRoutes;
  keysValues: any;
  queryConfiguration: any;

  constructor(value: Object) {
    this.url = value['url'] ? value['url'] : '';
    this.queryParams = value[Codes.QUERY_PARAMS] ? value[Codes.QUERY_PARAMS] : {};
    this.text = value['text'] ? value['text'] : '';
    this.displayText = value['displayText'] ? value['displayText'] : '';
    this.formRoutes = value['formRoutes'];
    this.activeFormMode = value['activeFormMode'];
    this.keysValues = value['keysValues'];
    this.queryConfiguration = value['queryConfiguration'];
  }

  getActiveModePath(): string {
    let result;
    if (Util.isDefined(this.activeFormMode)) {
      result = (this.formRoutes || {})[this.activeFormMode];
    }
    return result;
  }

  findAndMergeNavigationItem(storageData: any[] = []) {
    const storedItem: ONavigationItem = storageData.find(element => { return element.url === this.url; });
    if (storedItem) {
      this[Codes.QUERY_PARAMS] = storedItem[Codes.QUERY_PARAMS];
      this.displayText = storedItem.displayText;
      this.formRoutes = storedItem.formRoutes;
      this.formLayoutRoutes = storedItem.formLayoutRoutes;
      this.activeFormMode = storedItem.activeFormMode;
      this.keysValues = storedItem.keysValues;
      this.queryConfiguration = storedItem.queryConfiguration;
    }
  }

  isInsertFormRoute(): boolean {
    return this.activeFormMode === 'insertFormRoute';
  }

  getInsertFormRoute(): string {
    const routes = this.formRoutes;
    return routes ? (routes.insertFormRoute || Codes.DEFAULT_INSERT_ROUTE) : Codes.DEFAULT_INSERT_ROUTE;
  }

  getEditFormRoute(): string {
    const routes = this.formRoutes;
    return routes ? (routes.editFormRoute || Codes.DEFAULT_EDIT_ROUTE) : Codes.DEFAULT_EDIT_ROUTE;
  }

  getDetailFormRoute(): string {
    const routes = this.formRoutes;
    return routes ? (routes.detailFormRoute || Codes.DEFAULT_DETAIL_ROUTE) : Codes.DEFAULT_DETAIL_ROUTE;
  }

  isMainFormLayoutManagerComponent(): boolean {
    return Util.isDefined(this.formLayoutRoutes);
  }

  getFormRoutes(): ONavigationRoutes {
    return this.formRoutes;
  }

  setFormRoutes(arg: ONavigationRoutes) {
    if (arg && arg.mainFormLayoutManagerComponent) {
      this.formLayoutRoutes = arg;
    } else {
      this.formRoutes = arg;
    }
  }

  deleteActiveFormMode() {
    this.activeFormMode = undefined;
  }
}

@Injectable()
export class NavigationService implements ILocalStorageComponent {

  public static NAVIGATION_STORAGE_KEY: string = 'nav_service';

  public currentTitle: string = null;
  public visible: boolean = true;

  protected navigationItems: Array<ONavigationItem> = [];

  protected router: Router;

  protected localStorageService: LocalStorageService;

  private navigationEventsSource: ReplaySubject<Array<ONavigationItem>> = new ReplaySubject<Array<ONavigationItem>>(1);
  public navigationEvents$: Observable<Array<ONavigationItem>> = this.navigationEventsSource.asObservable();

  private _titleEmitter: EventEmitter<any> = new EventEmitter();
  private _visibleEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  private _sidenavEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    protected injector: Injector
  ) {
    this.router = this.injector.get(Router);
    this.localStorageService = this.injector.get(LocalStorageService);
  }

  initialize(): void {
    const self = this;
    const navEndEvents = this.router.events.pipe(filter(event => event instanceof NavigationEnd));
    navEndEvents
      .pipe(map(() => this.router.routerState.root))
      .pipe(map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }))
      .pipe(filter(route => route.outlet === 'primary'))
      .subscribe(self.parseNavigationItems.bind(self));
  }

  protected parseNavigationItems(activatedRoute: ActivatedRoute) {
    let storageData: any = this.getStoredData();
    let route: ActivatedRouteSnapshot = this.router.routerState.root.snapshot;

    let url = '';
    let navigationItems: Array<ONavigationItem> = [];
    while (Util.isDefined(route.firstChild)) {
      route = route.firstChild;
      if (!route || !route.url || route.routeConfig === null || !route.routeConfig.path) {
        continue;
      }
      const navData: ONavigationItem = navigationItems[navigationItems.length - 1];
      const parsedRoute: any = this.parseRoute(url, route.url, navData);
      url = parsedRoute.url;

      if (storageData.length > 1 && parsedRoute.routeArr.length > 0) {
        const lastStored: any = storageData[storageData.length - 1];
        if (lastStored.url === url) {
          const newItem = new ONavigationItem(lastStored);
          const newItemActivePath = newItem.getActiveModePath();
          if (!newItemActivePath || parsedRoute.routeArr.length > newItemActivePath.split('/').length) {
            navigationItems.push(newItem);
            const parsed: any = this.parseRoute(url, parsedRoute.routeArr, newItem);
            url = parsed.url;
            parsedRoute.text = parsed.text;
          }
        }
      }

      let formRoutes = undefined;
      if (navData && navData.formLayoutRoutes) {
        formRoutes = Object.assign({}, navData.formLayoutRoutes);
      }
      const navigationItem = new ONavigationItem({
        url: url,
        queryParams: route.queryParams,
        text: parsedRoute.text,
        formRoutes: formRoutes,
        activeFormMode: formRoutes ? (navData && navData.activeFormMode) : undefined
      });
      navigationItem.findAndMergeNavigationItem(storageData);
      navigationItems.push(navigationItem);
    }
    if (navigationItems.length > 1) {
      navigationItems[navigationItems.length - 1].terminal = true;
    }
    this.setNavigationItems(navigationItems);
  }


  protected parseRoute(url: string, routeSegments: UrlSegment[], navData: ONavigationItem): any {
    let text = '';
    let modePathArr = [];
    let modePath = navData ? navData.getActiveModePath() : undefined;
    if (modePath && modePath.length > 0) {
      modePathArr = modePath.split('/');
      const detailRoute = navData.getDetailFormRoute();
      if (Util.isDefined(detailRoute)) {
        url += url.length > 0 ? ('/' + detailRoute) : detailRoute;
      }
    }
    let routeArr = [];
    for (let i = 0, len = routeSegments.length; i < len; i++) {
      const s: UrlSegment = routeSegments[i];
      if (modePathArr.indexOf(s.path) === -1 && text.length === 0) {
        text = text.length > 0 ? ('/' + s.path) : s.path;
        url += url.length > 0 ? ('/' + s.path) : s.path;
      } else {
        routeArr.push(s);
      }
    }
    let activeMode = navData ? navData.activeFormMode : undefined;
    if (modePath && modePath.length > 0 && (activeMode === 'editFormRoute') || (activeMode === 'insertFormRoute')) {
      url += url.length > 0 ? ('/' + modePath) : modePath;
    }
    return {
      url: url,
      text: text,
      routeArr: routeArr
    };
  }

  public setNavigationItems(navigationItems: Array<ONavigationItem>) {
    this.navigationItems = navigationItems;
    this.storeNavigation();
    this.navigationEventsSource.next(this.navigationItems);
  }

  public getDataToStore(): Object {
    return this.navigationItems;
  }

  public getComponentKey(): string {
    return NavigationService.NAVIGATION_STORAGE_KEY;
  }

  protected storeNavigation(): void {
    if (this.localStorageService) {
      this.localStorageService.updateComponentStorage(this, false);
    }
  }

  public setTitle(title: string): void {
    this.currentTitle = title;
    this._emitTitleChanged(this.currentTitle);
  }

  public setVisible(visible: boolean): void {
    this.visible = visible;
    this._emitVisibleChanged(this.visible);
  }

  public openSidenav() {
    this._emitOpenSidenav();
  }

  public closeSidenav() {
    this._emitCloseSidenav();
  }

  /**
 * Subscribe to title updates
 */
  public onTitleChange(onNext: (value: any) => void): Object {
    return ObservableWrapper.subscribe(this._titleEmitter, onNext);
  }

  public onVisibleChange(onNext: (value: boolean) => void): Object {
    return ObservableWrapper.subscribe(this._visibleEmitter, onNext);
  }

  public onSidenavChange(onNext: (value: any) => void): Object {
    return ObservableWrapper.subscribe(this._sidenavEmitter, onNext);
  }

  private _emitTitleChanged(title): void {
    ObservableWrapper.callEmit(this._titleEmitter, title);
  }

  private _emitVisibleChanged(visible): void {
    ObservableWrapper.callEmit(this._visibleEmitter, visible);
  }

  private _emitOpenSidenav() {
    ObservableWrapper.callEmit(this._sidenavEmitter, 'open');
  }

  private _emitCloseSidenav() {
    ObservableWrapper.callEmit(this._sidenavEmitter, 'close');
  }

  storeFormRoutes(routes: ONavigationRoutes, activeMode: string, queryConf: any = undefined) {
    if (this.navigationItems.length > 0) {
      this.navigationItems[this.navigationItems.length - 1].setFormRoutes(routes);
      this.navigationItems[this.navigationItems.length - 1].activeFormMode = activeMode;
      if (queryConf) {
        this.navigationItems[this.navigationItems.length - 1].keysValues = queryConf.keysValues;
        delete queryConf.keysValues;
        if (Object.keys(queryConf).length > 0) {
          this.navigationItems[this.navigationItems.length - 1].queryConfiguration = queryConf;
        }
      }
      this.storeNavigation();
    }
  }

  protected getStoredData(): any[] {
    let storageData: any = this.localStorageService.getComponentStorage(this, false);
    let result = [];
    Object.keys(storageData).forEach(key => result.push(storageData[key]));
    return result;
  }

  getPreviousRouteData(): ONavigationItem {
    let result: ONavigationItem;
    const len = this.navigationItems.length;
    if (len >= 2) {
      result = this.navigationItems[len - 2];
      if (result && result.formRoutes && result.formRoutes.mainFormLayoutManagerComponent && this.navigationItems[len - 3]) {
        const parent = this.navigationItems[len - 3];
        if (parent.isMainFormLayoutManagerComponent()) {
          result = parent;
        }
      }
    }
    return result;
  }

  removeLastItem() {
    this.navigationItems.pop();
    this.storeNavigation();
  }

  getLastItem(): ONavigationItem {
    let result;
    if (this.navigationItems.length > 0) {
      result = this.navigationItems[this.navigationItems.length - 1];
    }
    return result;
  }

  deleteActiveFormMode(arg: ONavigationItem) {
    arg.deleteActiveFormMode();
    this.storeNavigation();
  }

  //* Provisional
  // protected move(index) {
  //   this.queryByIndex(index);
  // }

  // protected _setData(data) {
  //   if (Util.isArray(data) && data.length === 1) {
  //     this.navigationData = <Array<Object>>this.toFormValueData(data);
  //     this.syncCurrentIndex();
  //   } else {
  //     console.warn('Form has received not supported service data. Supported data are Array');
  //     this._updateFormData({});
  //   }
  // }

  // protected queryByIndex(index: number) {
  //   var self = this;
  //   this._query(index).subscribe(resp => {
  //     if (resp.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) {
  //       let currentData = resp.data[0];
  //       self._updateFormData(self.toFormValueData(currentData));
  //       self._emitData(currentData);
  //     } else {
  //       console.log('error ');
  //     }
  //   }, err => {
  //     console.log(err);
  //   });
  // }

  //  _query(index): Observable<any> {
  //   var self = this;
  //   var loader = self.load();
  //   let filter = this.getKeysValues(index);
  //   let observable = this.dataService.query(filter, this.getAttributesToQuery(), this.entity);
  //   observable.subscribe(resp => {
  //     loader.unsubscribe();
  //   }, err => {
  //     console.log(err);
  //     loader.unsubscribe();
  //   });
  //   return observable;
  // }

  // protected syncCurrentIndex() {
  //   if (this.navigationData) {
  //     var self = this;
  //     let currKV = this.getCurrentKeysValues();
  //     if (currKV && Object.keys(currKV).length > 0) {
  //       let current = this.objectToFormValueData(currKV);
  //       this.navigationData.forEach((value: any, index: number) => {
  //         // check whether current === value
  //         let equals = false;
  //         Object.keys(current).forEach(function (key) {
  //           let pair = value[key];
  //           if (pair && pair.value) {
  //             if (current[key].value === pair.value.toString()) {
  //               equals = true;
  //             } else {
  //               equals = false;
  //             }
  //           }
  //         });
  //         if (equals) {
  //           self.currentIndex = index;
  //         }
  //       });
  //     }
  //   }
  // }

  // protected addNavigationItem(breadcrumb: ONavigationItem): void {
  //   if (!this.breadcrumbs.length) {
  //     this.breadcrumbs.push(breadcrumb);
  //   } else {
  //     let index = this.breadcrumbs.indexOf(this.breadcrumbs.find(item => breadcrumb.url === item.url));
  //     if (index !== -1) {
  //       this.breadcrumbs.splice(index);
  //     } else {
  //       this.breadcrumbs.push(breadcrumb);
  //     }
  //   }
  //   console.log(this.breadcrumbs);
  // }

}
