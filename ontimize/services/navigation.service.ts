import { Injectable, Injector, EventEmitter } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';

import { Codes } from '../utils';
import { ObservableWrapper } from '../util/async';
import { LocalStorageService, ILocalStorageComponent } from '../../index';

export class ONavigationItem {
  constructor(value: Object) {
    this.url = value['url'] ? value['url'] : '';
    this.queryParams = value[Codes.QUERY_PARAMS] ? value[Codes.QUERY_PARAMS] : {};
    this.text = value['text'] ? value['text'] : '';
    this.displayText = value['displayText'] ? value['displayText'] : '';
  }
  url: string;
  queryParams: Object;
  text: string;
  displayText: string;
  terminal: boolean;
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
  private _visibleEmitter: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  private _sidenavEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    protected injector: Injector
  ) {
    this.router = this.injector.get(Router);
    this.localStorageService = this.injector.get(LocalStorageService);
  }

  initialize(): void {
    var self = this;
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.router.routerState.root)
      .map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .subscribe((event: ActivatedRoute) => {
        let route = self.router.routerState.root.snapshot;
        let displayText = '';
        let url = '';
        let navigationItems: Array<ONavigationItem> = [];
        while (route.firstChild !== null) {
          route = route.firstChild;
          if (route.routeConfig === null) { continue; }
          if (!route.routeConfig.path) { continue; }
          url += `/${route.url.map((s, i) => {
            return i === 0 ? displayText = s.path : null;
          }).filter(s => s !== null).join('/')}`;
          navigationItems.push(new ONavigationItem({
            url: url,
            text: displayText
          }));
        }
        navigationItems[navigationItems.length - 1].queryParams = route.queryParams;

        self.setNavigationItems(navigationItems);
      });
  }

  public setNavigationItems(navigationItems: Array<ONavigationItem>): void {
    this.navigationItems = navigationItems;
    this.storeNavigation();
    this.navigationEventsSource.next(this.navigationItems);
  }

  public getDataToStore(): Object {
    let localData = this.localStorageService.getComponentStorage(this, false);
    if (localData) {
      this.navigationItems.forEach((element, index) => {
        let storedElem = localData[Object.keys(localData).find(index => element.url === localData[index]['url'])];
        if (void 0 !== storedElem) {
          element.queryParams = element.queryParams && !Object.keys(storedElem[Codes.QUERY_PARAMS]).length ? element.queryParams : storedElem[Codes.QUERY_PARAMS] && Object.keys(storedElem[Codes.QUERY_PARAMS]).length ? storedElem[Codes.QUERY_PARAMS] : {};
          element.displayText = element.displayText ? element.displayText : storedElem['displayText'] ? storedElem['displayText'] : null;
        }
        element.terminal = index === this.navigationItems.length - 1;
      });
    }
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
  //     if (resp.code === 0) {
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
