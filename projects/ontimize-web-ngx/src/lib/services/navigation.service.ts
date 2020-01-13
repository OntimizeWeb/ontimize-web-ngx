import { Injectable, Injector, EventEmitter } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { Location } from '@angular/common';
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

  findAndMergeNavigationItem(storageData: ONavigationItem[] = []) {
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

const MAXIMIUM_NAVIGATION_HEAP_SIZE = 15;

@Injectable()
export class NavigationService implements ILocalStorageComponent {

  public static NAVIGATION_STORAGE_KEY: string = 'nav_service';

  public currentTitle: string = null;
  public visible: boolean = true;

  protected navigationItems: Array<ONavigationItem> = [];
  protected allNavigationItems: ONavigationItem[] = [];

  protected router: Router;

  protected localStorageService: LocalStorageService;
  protected location: Location;

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
    this.location = this.injector.get(Location);
    this.location.subscribe(val => {
      const previousRoute = this.getPreviousRouteData();
      const qParams = Object.keys(previousRoute.queryParams);
      let arr = [];
      qParams.forEach(function (p) {
        arr.push(`${p}=${previousRoute.queryParams[p]}`);
      });
      let fullUrl = `/${previousRoute.url}`;
      if (arr.length > 0) {
        fullUrl = `/${previousRoute.url}?${arr.join('&')}`;
      }
      if (fullUrl === val.url) {
        this.navigationItems.pop();
      }
    });
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
    let storedNavigation: ONavigationItem[] = this.getStoredData();
    let route: ActivatedRouteSnapshot = this.router.routerState.root.snapshot;
    let url = '';
    let navigationItems: Array<ONavigationItem> = [];
    while (Util.isDefined(route.firstChild)) {
      route = route.firstChild;
      if (!route || !route.url || route.routeConfig === null || !route.routeConfig.path) {
        continue;
      }
      const lastNavData: ONavigationItem = navigationItems[navigationItems.length - 1];
      const parsedRoute: any = this.parseRoute(url, route.url, lastNavData);
      url = parsedRoute.url;
      if (storedNavigation.length > 1 && parsedRoute.routeArr.length > 0) {
        const lastStored: any = storedNavigation[storedNavigation.length - 1];
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
      if (lastNavData && lastNavData.formLayoutRoutes) {
        formRoutes = Object.assign({}, lastNavData.formLayoutRoutes);
      }
      const navigationItem = new ONavigationItem({
        url: url,
        queryParams: route.queryParams,
        text: parsedRoute.text,
        formRoutes: formRoutes,
        activeFormMode: formRoutes ? (lastNavData && lastNavData.activeFormMode) : undefined
      });
      navigationItem.findAndMergeNavigationItem(storedNavigation);
      navigationItems.push(navigationItem);
    }
    if (navigationItems.length > 1) {
      navigationItems[navigationItems.length - 1].terminal = true;
    }
    const mergedNavigation = this.mergeNavigationItems(navigationItems, storedNavigation);
    this.setNavigationItems(navigationItems, mergedNavigation);
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
      const notModePath: boolean = modePathArr.indexOf(s.path) === -1;
      if (notModePath && text.length === 0) {
        text = text.length > 0 ? ('/' + s.path) : s.path;
        url += url.length > 0 ? ('/' + s.path) : s.path;
      } else if (notModePath) {
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

  public setNavigationItems(navigationItems: ONavigationItem[], mergedNavigationItems: ONavigationItem[]) {
    this.navigationItems = mergedNavigationItems;
    this.storeNavigation();
    this.navigationEventsSource.next(navigationItems);
  }

  public getDataToStore(): Object {
    return this.navigationItems;
  }

  public getComponentKey(): string {
    return NavigationService.NAVIGATION_STORAGE_KEY;
  }

  protected storeNavigation(): void {
    if (this.localStorageService) {
      this.localStorageService.updateComponentStorage(this);
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
    let storageData: any = this.localStorageService.getComponentStorage(this);
    let result = [];
    Object.keys(storageData).forEach(key => result.push(new ONavigationItem(storageData[key])));
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

  protected mergeNavigationItems(navigationItems: ONavigationItem[], storedNavigation: ONavigationItem[]): ONavigationItem[] {
    if (storedNavigation.length === 0 || storedNavigation.length > MAXIMIUM_NAVIGATION_HEAP_SIZE) {
      return navigationItems;
    }
    let result: ONavigationItem[] = [];

    let lastCommonIndex;
    for (let i = navigationItems.length - 1; i >= 0; i--) {
      for (let j = storedNavigation.length - 1; j >= 0; j--) {
        if (storedNavigation[j].url === navigationItems[i].url && i !== navigationItems.length - 1) {
          lastCommonIndex = i;
          break;
        }
      }
      if (lastCommonIndex !== undefined) {
        break;
      }
    }

    storedNavigation.forEach(s => result.push(s));

    if (lastCommonIndex !== undefined) {
      for (let j = lastCommonIndex + 1, len = navigationItems.length; j < len; j++) {
        if (storedNavigation[storedNavigation.length - 1].url !== navigationItems[j].url) {
          result.push(navigationItems[j]);
        }
      }
    }
    return result;
  }

}
