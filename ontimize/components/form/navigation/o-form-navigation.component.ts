import { Component, forwardRef, Inject, Injector, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { OFormLayoutManagerComponent } from '../../../layouts';
import { NavigationService, ONavigationItem } from '../../../services/navigation.service';
import { OntimizeService } from '../../../services/ontimize.service';
import { dataServiceFactory } from '../../../services/data-service.provider';
import { Codes, Util } from '../../../utils';
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
  moduleId: module.id,
  selector: 'o-form-navigation',
  templateUrl: './o-form-navigation.component.html',
  styleUrls: ['./o-form-navigation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-form-navigation]': 'true'
  },
  providers: [
    { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] }
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
    this.navigationService = this.injector.get(NavigationService);

    this.formLayoutManager = this._form.getFormManager();

    let navData;
    if (this.formLayoutManager && this.formLayoutManager.isDialogMode()) {
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
        let serviceCfg = this.dataService.getDefaultServiceConfiguration(this.queryConf.service);
        if (this.queryConf.entity) {
          serviceCfg['entity'] = this.queryConf.entity;
        }
        this.dataService.configureService(serviceCfg);
      }
    } catch (e) {
      console.error(e);
    }
  }

  protected queryNavigationData(offset: number, length: number = undefined): Promise<any> {
    const self = this;
    return new Promise<any>((resolve: any, reject: any) => {
      const conf = self.queryConf;
      let queryArgs = conf.queryArguments;

      queryArgs[1] = self.getKeysArray();
      queryArgs[4] = offset;
      queryArgs[5] = length ? length : conf.queryRows;

      self.querySubscription = self.dataService[conf.queryMethod].apply(self.dataService, queryArgs).subscribe(res => {
        if (res.code === Codes.ONTIMIZE_SUCCESSFUL_CODE) {
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
    let keysArray = [];
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
    let currentKeys = {};
    const currentItem = this.formNavigation.getUrlParams();
    keysArray.forEach(key => {
      currentKeys[key] = currentItem[key];
    });
    let index: number = (this.navigationData || []).findIndex((item: any) => {
      let itemKeys = {};
      keysArray.forEach(key => {
        itemKeys[key] = item[key];
      });
      return Util.isEquivalent(itemKeys, currentKeys);
    });
    return index >= 0 ? index : 0;
  }

  next() {
    let total = this.navigationData.length;
    let index = this.currentIndex + 1;
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
    let index = this.currentIndex - 1;
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
      let index = this.navigationData.length - 1;
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
        if (this.formLayoutManager && this.formLayoutManager.isDialogMode()) {
          this.moveInDialogManager(this.formLayoutManager, index);
        } else {
          this.moveWithoutManager(index);
        }
      }
    });
  }

  private moveWithoutManager(index: number) {
    let route = this.getRouteOfSelectedRow(this.navigationData[index]);
    if (route.length > 0) {
      this.navigationService.removeLastItem();
      const navData: ONavigationItem = this.navigationService.getLastItem();
      if (navData) {
        let extras: NavigationExtras = {};
        extras[Codes.QUERY_PARAMS] = Codes.getIsDetailObject();
        const detailRoute = navData.getDetailFormRoute();
        if (Util.isDefined(detailRoute)) {
          route.unshift(detailRoute);
        }
        route.unshift(navData.url);
        this._form.canDiscardChanges = true;
        this.router.navigate(route, extras).then((navigationDone: boolean) => {
          if (navigationDone) {
            this.currentIndex = index;
          }
        });
      }
    }
  }

  private moveInDialogManager(formLayoutManager: any, index: number) {
    formLayoutManager.dialogRef.componentInstance.urlParams = this.navigationData[index];
    this._form.setUrlParamsAndReload(this.navigationData[index]);
  }

  getRouteOfSelectedRow(item: any) {
    let route = [];
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
