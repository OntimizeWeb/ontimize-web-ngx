import { Component, forwardRef, Inject, Injector, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import { OFormLayoutManagerComponent } from '../../../layouts';
import { NavigationService, ONavigationItem } from '../../../services/navigation.service';
import { Codes, Util } from '../../../utils';
import { OFormComponent } from '../o-form.component';
import { OFormNavigationClass } from './o-form.navigation.class';

@Component({
  moduleId: module.id,
  selector: 'o-form-navigation',
  templateUrl: './o-form-navigation.component.html',
  styleUrls: ['./o-form-navigation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-form-navigation]': 'true'
  }
})
export class OFormNavigationComponent implements OnDestroy {

  public navigationData: Array<any> = [];
  private _currentIndex = 0;

  protected formNavigation: OFormNavigationClass;
  protected navigationService: NavigationService;

  constructor(
    protected injector: Injector,
    @Inject(forwardRef(() => OFormComponent)) private _form: OFormComponent,
    private router: Router
  ) {
    this.formNavigation = this._form.getFormNavigation();
    this.navigationService = this.injector.get(NavigationService);
    const navData = this.navigationService.getPreviousRouteData();
    if (Util.isDefined(navData) && navData.keysValues) {
      this.navigationData = navData.keysValues;
    }
    this.currentIndex = this.getCurrentIndex();
  }

  ngOnDestroy(): void {
    //
  }

  getCurrentIndex(): number {
    // getting available navigationData keys
    let keysArray = [];
    this._form.keysArray.forEach(key => {
      if ((this.navigationData[0] || {}).hasOwnProperty(key)) {
        keysArray.push(key);
      }
    });
    // current url keys object
    let currentKeys = {};
    const currentItem = this.formNavigation.getUrlParams();
    keysArray.forEach(key => {
      currentKeys[key] = currentItem[key];
    });
    let index: number = this.navigationData.findIndex((item: any) => {
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
    } else {
      console.log('form-toolbar->next(): total > index');
    }
  }

  previous() {
    let index = this.currentIndex - 1;
    if (index >= 0) {
      this.move(index);
    } else {
      console.log('form-toolbar->next(): index < 0');
    }
  }

  first() {
    this.move(0);
  }

  last() {
    let index = this.navigationData.length - 1;
    this.move(index);
  }

  isFirst() {
    return this.currentIndex === 0;
  }

  isLast() {
    return this.currentIndex === (this.navigationData.length - 1);
  }

  move(index: number) {
    this._form.showConfirmDiscardChanges().then(res => {
      if (res === true) {
        const formLayoutManager: OFormLayoutManagerComponent = this._form.getFormManager();
        this.currentIndex = index;
        if (formLayoutManager && formLayoutManager.isDialogMode()) {
          this.moveInDialogManager(formLayoutManager, index);
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
        const self = this;
        this._form.canDiscardChanges = true;
        this.router.navigate(route, extras).then((navigationDone: boolean) => {
          if (navigationDone) {
            self.currentIndex = index;
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
    return this.navigationData.length > 1;
  }

  set currentIndex(arg: number) {
    this._currentIndex = arg;
  }

  get currentIndex(): number {
    return this._currentIndex;
  }

}
