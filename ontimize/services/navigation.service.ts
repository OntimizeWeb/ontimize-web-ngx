import { Location } from '@angular/common';
import { EventEmitter, Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router, UrlSegment } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { OBreadcrumb } from '../types/o-breadcrumb-item.interface';
import { ObservableWrapper } from '../util/async';
import { Codes, Util } from '../utils';
import { ILocalStorageComponent, LocalStorageService } from './local-storage.service';
import { OBreadcrumbService } from './o-breadcrumb.service';

export type ONavigationRoutes = {
  mainFormLayoutManagerComponent?: boolean;
  isMainNavigationComponent?: boolean;
  detailFormRoute: string;
  editFormRoute: string;
  insertFormRoute: string;
};

export class ONavigationItem {
  url: string;
  queryParams: Object;
  text: string;
  displayText: string;
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
    this.formLayoutRoutes = value['formLayoutRoutes'];
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

  isMainNavigationComponent(): boolean {
    return Util.isDefined(this.formRoutes) && this.formRoutes.isMainNavigationComponent;
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

  protected oBreadcrumbService: OBreadcrumbService;
  protected localStorageService: LocalStorageService;
  protected location: Location;

  public navigationEvents$: ReplaySubject<Array<ONavigationItem>> = new ReplaySubject<Array<ONavigationItem>>(1);

  private _titleEmitter: EventEmitter<any> = new EventEmitter();
  private _visibleEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  private _sidenavEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    protected injector: Injector
  ) {
    this.router = this.injector.get(Router);
    this.oBreadcrumbService = this.injector.get(OBreadcrumbService);
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
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.router.routerState.root),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary')
    ).subscribe(this.parseNavigationItems.bind(this));
  }

  protected buildBreadcrumbsForRoute(activatedRoute: ActivatedRouteSnapshot) {
    const breadcrumbs: OBreadcrumb[] = [];
    let url = '';
    let route = activatedRoute.firstChild;
    while (route.firstChild) {
      if (route.url.length) {
        const parsedRoute = this.parseRoute(url, route);
        breadcrumbs.push(parsedRoute);
        url = parsedRoute.route;
      }
      route = route.firstChild;
    }
    const parsedRoute = this.parseRoute(url, route);
    breadcrumbs.push(parsedRoute);

    this.oBreadcrumbService.breadcrumbs$.next(breadcrumbs);
  }

  protected parseRoute(route: string, activatedRoute: ActivatedRouteSnapshot): OBreadcrumb {
    let label = '';
    for (let i = 0, len = activatedRoute.url.length; i < len; i++) {
      const segment: UrlSegment = activatedRoute.url[i];
      if (label.length === 0) {
        label = label.length > 0 ? ('/' + segment.path) : segment.path;
        route += '/' + segment.path;
      }
    }
    return { route, label, queryParams: activatedRoute.queryParams };
  }

  protected parseNavigationItems() {
    let storedNavigation: ONavigationItem[] = this.getStoredData();
    let route: ActivatedRouteSnapshot = this.router.routerState.root.snapshot;
    let url = this.router.routerState.snapshot.url.split('?')[0];
    this.buildBreadcrumbsForRoute(route);
    const lastStored: any = storedNavigation[storedNavigation.length - 1];
    if (!lastStored || lastStored.url !== url) {
      const navigationItem = new ONavigationItem({ url, queryParams: route.queryParams });

      this.navigationItems.push(navigationItem);
      this.setNavigationItems(this.navigationItems);
    }
  }

  public setNavigationItems(navigationItems: ONavigationItem[]) {
    this.navigationItems = navigationItems;
    this.storeNavigation();
    this.navigationEvents$.next(navigationItems);
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

  /**
   * Return the main navigation route data that matches the most with the current route
   */
  getLastMainNavigationRouteData(): ONavigationItem {
    const routeMatches = [];
    const items = this.navigationItems.slice().reverse()
      .map((item, i) => {
        let currentLocation = this.location.path().substr(1);
        if (currentLocation.includes('?')) {
          currentLocation = currentLocation.substring(0, currentLocation.indexOf('?'));
        }

        // Compare current route with item route and count segment matches
        const arr1 = item.url.substr(1).split('/');
        const arr2 = currentLocation.split('/');
        let result = 0;
        let index = -1;
        while (++index <= arr1.length && index <= arr2.length) {
          routeMatches[i] = (arr1[index] === arr2[index]) ? result++ : result;
        }

        return item;
      });

    let maxMatches = routeMatches.reduce((a, b) => Math.max(a, b));
    const lastNavItem = this.navigationItems[this.navigationItems.length - 1];
    if (!lastNavItem.isMainNavigationComponent() && !lastNavItem.isMainFormLayoutManagerComponent()) {
      maxMatches--;
    }
    let item = void 0;
    while (!item && maxMatches >= 0) {
      item = items.find((item, i) => (item.isMainNavigationComponent() || item.isMainFormLayoutManagerComponent()) && routeMatches[i] === maxMatches);
      maxMatches--;
    }
    return item;
  }

  removeLastItem() {
    this.navigationItems.pop();
    this.storeNavigation();
  }

  removeLastItemsUntilMain() {
    const lastMain = this.getLastMainNavigationRouteData();
    if (!Util.isDefined(lastMain)) {
      return false;
    }
    const index = this.navigationItems.indexOf(lastMain);
    this.navigationItems = this.navigationItems.slice(0, index + 1);
    this.storeNavigation();
    return true;
  }

  isCurrentRoute(route: string): boolean {
    let currentRoute = this.router.routerState.snapshot.url;
    currentRoute = currentRoute.split('?')[0];
    return route === currentRoute;
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
