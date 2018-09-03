import { Injectable, Injector, EventEmitter } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';

import { Codes, Util } from '../utils';
import { ObservableWrapper } from '../util/async';
import { ILocalStorageComponent, LocalStorageService } from './local-storage.service';

export class ONavigationItem {

  url: string;
  queryParams: Object;
  text: string;
  displayText: string;
  terminal: boolean;
  formRoutes: any;
  activeFormMode: string;

  constructor(value: Object) {
    this.url = value['url'] ? value['url'] : '';
    this.queryParams = value[Codes.QUERY_PARAMS] ? value[Codes.QUERY_PARAMS] : {};
    this.text = value['text'] ? value['text'] : '';
    this.displayText = value['displayText'] ? value['displayText'] : '';
    this.formRoutes = value['formRoutes'];
    this.activeFormMode = value['activeFormMode'];
  }

  getActiveModePath(): string {
    let result;
    if (Util.isDefined(this.activeFormMode)) {
      result = (this.formRoutes || {})[this.activeFormMode] || '';
    }
    return result;
  }

  findAndMergeNavigationItem(storageData: any[] = []) {
    const storedItem: ONavigationItem = storageData.find(element => { return element.url === this.url; });
    if (storedItem) {
      this[Codes.QUERY_PARAMS] = storedItem[Codes.QUERY_PARAMS];
      this.displayText = storedItem.displayText;
      this.formRoutes = storedItem.formRoutes;
      this.activeFormMode = storedItem.activeFormMode;
    }
  }

  getInsertFormRoute(): string {
    return this.formRoutes ? (this.formRoutes.insertFormRoute || Codes.DEFAULT_INSERT_ROUTE) : Codes.DEFAULT_INSERT_ROUTE;
  }

  getEditFormRoute(): string {
    return this.formRoutes ? (this.formRoutes.editFormRoute || Codes.DEFAULT_EDIT_ROUTE) : Codes.DEFAULT_INSERT_ROUTE;
  }

  getDetailFormRoute(): string {
    return this.formRoutes ? this.formRoutes.detailFormRoute : undefined;
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
    const navEndEvents = this.router.events.filter(event => event instanceof NavigationEnd);
    navEndEvents.map(() => this.router.routerState.root).map(route => {
      while (route.firstChild) {
        route = route.firstChild;
      }
      return route;
    }).filter(route => route.outlet === 'primary').subscribe(self.parseNavigationItems.bind(self));
  }

  protected parseNavigationItems(event: ActivatedRoute) {
    let storageData: any = this.getStoredData();
    let route: ActivatedRouteSnapshot = this.router.routerState.root.snapshot;

    let url = '';
    let navigationItems: Array<ONavigationItem> = [];
    while (route.firstChild !== null) {
      let text = '';
      route = route.firstChild;
      if (!route || !route.url || route.routeConfig === null || !route.routeConfig.path) {
        continue;
      }
      const navData: ONavigationItem = navigationItems[navigationItems.length - 1];
      let modePath = navData ? navData.getActiveModePath() : undefined;
      let modePathArr = [];
      if (modePath && modePath.length > 0) {
        url += url.length > 0 ? ('/' + modePath) : modePath;
        modePathArr = modePath.split('/');
      }
      for (let i = 0, len = route.url.length; i < len; i++) {
        const s: UrlSegment = route.url[i];
        if (modePathArr.indexOf(s.path) === -1) {
          text += text.length > 0 ? ('/' + s.path) : s.path;
          url += url.length > 0 ? ('/' + s.path) : s.path;
          break;
        }
      }
      const navigationItem = new ONavigationItem({
        url: url,
        queryParams: route.queryParams,
        text: text
      });
      navigationItem.findAndMergeNavigationItem(storageData);
      navigationItems.push(navigationItem);
    }
    if (navigationItems.length > 1) {
      navigationItems[navigationItems.length - 1].terminal = true;
    }
    this.setNavigationItems(navigationItems);
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

  storeFormRoutes(routes: any, activeMode: string) {
    if (this.navigationItems.length > 0) {
      this.navigationItems[this.navigationItems.length - 1].formRoutes = routes;
      this.navigationItems[this.navigationItems.length - 1].activeFormMode = activeMode;
      this.storeNavigation();
    }
  }

  protected getStoredData(): any[] {
    let storageData: any = this.localStorageService.getComponentStorage(this, false);
    let result = [];
    Object.keys(storageData).forEach(key => result.push(storageData[key]));
    return result.length ? result : undefined;
  }

  getPreviousRouteData(): ONavigationItem {
    let result;
    const lastItem: any = (this.navigationItems[this.navigationItems.length - 1] || {});
    if (lastItem.activeFormMode === 'editFormRoute') {
      lastItem.activeFormMode = undefined;
      return lastItem;
    }
    if (this.navigationItems.length >= 2) {
      result = {};
      const navData = this.navigationItems[this.navigationItems.length - 2];
      result = navData;
    }
    return result;
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
