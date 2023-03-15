import { Component, forwardRef, Inject, Injector, OnDestroy, Type, ViewEncapsulation } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { OFormLayoutManagerComponent } from '../../../layouts/form-layout/o-form-layout-manager.component';
import { OntimizeServiceProvider } from '../../../services/factories';
import { NavigationService, ONavigationItem } from '../../../services/navigation.service';
import { OntimizeService } from '../../../services/ontimize/ontimize.service';
import { Codes } from '../../../util/codes';
import { Util } from '../../../util/util';
import { OFormComponent } from '../o-form.component';
import { OFormNavigationClass } from './o-form.navigation.class';

export type QueryConfiguration = {
  serviceType: string;
  queryArguments: any[];
  entity: string;
  service: string;
  queryMethod: string;
  totalRecordsNumber: number;
  queryRows: number;
  queryRecordOffset: number;
};

@Component({
  selector: 'o-form-navigation',
  templateUrl: './o-form-navigation.component.html',
  styleUrls: ['./o-form-navigation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-form-navigation]': 'true'
  },
  providers: [
    OntimizeServiceProvider
  ]
})
export class OFormNavigationComponent implements OnDestroy {

  public navigationData: Array<any> = [];
  private _currentIndex = 0;

  protected formNavigation: OFormNavigationClass;
  protected navigationService: NavigationService;
  protected formLayoutManager: OFormLayoutManagerComponent;

  protected querySubscription: Subscription;
  protected dataService: any;
  protected queryConf: QueryConfiguration;

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OFormComponent)) private _form: OFormComponent,
    private router: Router
  ) {
    this.formNavigation = this._form.getFormNavigation();
    this.navigationService = this.injector.get<NavigationService>(NavigationService as Type<NavigationService>);

    this.formLayoutManager = this._form.getFormManager();

    let navData;
    if (this.formLayoutManager && this.formLayoutManager.allowNavigation()) {
      navData = this.navigationService.getLastItem();
    } else {
      navData = this.navigationService.getPreviousRouteData();
    }
    if (Util.isDefined(navData)) {
      this.navigationData = navData.keysValues || [];
      this.queryConf = navData.queryConfiguration;
    }
    this.currentIndex = this.getCurrentIndex();
    this.configureService();
  }

  configureService() {
    if (!this.queryConf) {
      return;
    }
    let loadingService: any = OntimizeService;
    if (this.queryConf.serviceType) {
      loadingService = this.queryConf.serviceType;
    }
    try {
      this.dataService = this.injector.get(loadingService);
      if (Util.isDataService(this.dataService)) {
        const serviceCfg = this.dataService.getDefaultServiceConfiguration(this.queryConf.service);
        if (this.queryConf.entity) {
          serviceCfg.entity = this.queryConf.entity;
        }
        this.dataService.configureService(serviceCfg);
      }
    } catch (e) {
      console.error(e);
    }
  }

  protected queryNavigationData(offset: number, length?: number): Promise<any> {
    const self = this;
    return new Promise<any>((resolve: any, reject: any) => {
      const conf = self.queryConf;
      const queryArgs = conf.queryArguments;

      queryArgs[1] = self.getKeysArray();
      queryArgs[4] = offset;
      queryArgs[5] = length ? length : conf.queryRows;

      self.querySubscription = self.dataService[conf.queryMethod].apply(self.dataService, queryArgs).subscribe(res => {
        if (res.isSuccessful()) {
          self.navigationData = res.data;
          self.queryConf.queryRecordOffset = offset;
        }
        resolve();
      }, () => {
        reject();
      });
    });
  }

  ngOnDestroy(): void {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

  protected getKeysArray(): string[] {
    // getting available navigationData keys
    const navData = this.navigationData ? (this.navigationData[0] || {}) : {};
    const keysArray = [];
    this._form.keysArray.forEach(key => {
      if (navData.hasOwnProperty(key)) {
        keysArray.push(key);
      }
    });
    return keysArray;
  }

  getCurrentIndex(): number {
    const keysArray = this.getKeysArray();
    // current url keys object
    const currentKeys = {};
    const currentItem = this.formNavigation.getUrlParams();
    keysArray.forEach(key => {
      currentKeys[key] = currentItem[key];
    });
    const index: number = (this.navigationData || []).findIndex((item: any) => {
      const itemKeys = {};
      keysArray.forEach(key => {
        itemKeys[key] = item[key];
      });
      return Util.isEquivalent(itemKeys, currentKeys);
    });
    return index >= 0 ? index : 0;
  }

  next() {
    const total = this.navigationData.length;
    const index = this.currentIndex + 1;
    if (total > index) {
      this.move(index);
    } else if (this.queryConf) {
      const offset: number = (this.queryConf.queryRecordOffset || 0) + this.queryConf.queryRows;
      this.queryNavigationData(offset).then(() => {
        this.move(0);
      });
    } else {
      console.error('form-toolbar->next(): total > index');
    }
  }

  previous() {
    const index = this.currentIndex - 1;
    if (index >= 0) {
      this.move(index);
    } else if (this.queryConf) {
      const offset: number = this.queryConf.queryRecordOffset - this.queryConf.queryRows;
      this.queryNavigationData(offset).then(() => {
        this.move(this.navigationData.length - 1);
      });
    } else {
      console.error('form-toolbar->next(): index < 0');
    }
  }

  first() {
    if (!this.queryConf || this.queryConf.queryRecordOffset === 0) {
      this.move(0);
    } else {
      this.queryNavigationData(0).then(() => {
        this.move(0);
      });
    }
  }

  last() {
    if (!this.queryConf || this.isLast()) {
      const index = this.navigationData.length - 1;
      this.move(index);
    } else {
      const offset = this.queryConf.totalRecordsNumber - this.queryConf.queryRows;
      this.queryNavigationData(offset, this.queryConf.queryRows).then(() => {
        this.move(this.navigationData.length - 1);
      });
    }
  }

  isFirst() {
    let result: boolean = this.currentIndex === 0;
    if (result && this.queryConf) {
      result = this.queryConf.queryRecordOffset === 0;
    }
    return result;
  }

  isLast() {
    let result: boolean = this.currentIndex === (this.navigationData.length - 1);
    if (result && this.queryConf) {
      result = (this.queryConf.queryRecordOffset + this.queryConf.queryRows)
        >= this.queryConf.totalRecordsNumber;
    }
    return result;
  }

  move(index: number) {
    this._form.showConfirmDiscardChanges().then(res => {
      if (res === true) {
        this.currentIndex = index;
        if (this.formLayoutManager && this.formLayoutManager.allowNavigation()) {
          this.moveInFormLayoutManager(index);
        } else {
          this.moveWithoutManager(index);
        }
      }
    });
  }

  private moveWithoutManager(index: number) {
    const route = this.getRouteOfSelectedRow(this.navigationData[index]);
    if (route.length > 0) {
      const navData: ONavigationItem = this.navigationService.getLastItem();
      if (navData) {
        this._form.canDiscardChanges = true;

        const extras: NavigationExtras = {};
        extras[Codes.QUERY_PARAMS] = Codes.getIsDetailObject();

        const urlArray = navData.url.split(Codes.ROUTE_SEPARATOR);
        const url = urlArray.splice(0, urlArray.length - route.length).join(Codes.ROUTE_SEPARATOR);
        route.unshift(url);

        this.router.navigate(route, extras).then((navigationDone: boolean) => {
          if (navigationDone) {
            this.currentIndex = index;
            const url = this.router.routerState.snapshot.url.split('?')[0];
            if (url !== navData.url) {
              this.navigationService.removeLastItem();
            }
          }
        });
      }
    }
  }

  private moveInFormLayoutManager(index: number) {
    this._form.setUrlParamsAndReload(this.navigationData[index]);
  }

  getRouteOfSelectedRow(item: any) {
    const route = [];
    if (Util.isObject(item)) {
      this._form.keysArray.forEach(key => {
        if (Util.isDefined(item[key])) {
          route.push(item[key]);
        }
      });
    }
    return route;
  }

  showNavigation() {
    return (this.navigationData || []).length > 1;
  }

  set currentIndex(arg: number) {
    this._currentIndex = arg;
  }

  get currentIndex(): number {
    return this._currentIndex;
  }

  getRecordIndex(): number {
    let index = this.currentIndex + 1;
    if (this.queryConf) {
      index += this.queryConf.queryRecordOffset;
    }
    return index;
  }

  getTotalRecordsNumber(): number {
    if (this.queryConf && this.queryConf.totalRecordsNumber) {
      return this.queryConf.totalRecordsNumber;
    }
    return this.navigationData.length;
  }
}
