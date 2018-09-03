import { Component, forwardRef, Inject, Injector, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { OFormLayoutManagerComponent } from '../../../layouts';
import { Util, Codes } from '../../../utils';
import { OFormComponent } from '../o-form.component';
import { OFormDataNavigation } from './o-form.data.navigation.class';
import { OFormNavigationClass } from './o-form.navigation.class';

@Component({
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

  protected formDataNavigation: OFormDataNavigation;
  protected formNavigation: OFormNavigationClass;

  constructor(protected injector: Injector,
    @Inject(forwardRef(() => OFormComponent)) private _form: OFormComponent,
    private router: Router,
    private actRoute: ActivatedRoute,
  ) {
    this.formNavigation = this._form.getFormNavigation();
    this.formDataNavigation = new OFormDataNavigation(this.injector);
    this.navigationData = this.formDataNavigation.getComponentStorage();
    this.currentIndex = this.getCurrentIndex();
  }

  ngOnDestroy(): void {
    this.formDataNavigation.destroy();
  }

  getCurrentIndex(): number {
    let index: number = 0;
    const currentItem = this.formNavigation.getUrlParams();
    for (let i = 0, len = this.navigationData.length; i < len; i++) {
      const item = this.navigationData[i];
      if (Util.isEquivalent(item, currentItem)) {
        index = i;
        break;
      }
    }
    return index;
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
    if (this._form.hasDeactivateGuard()) {
      // when form already has its own deactivate guard, it will control the changes discard
      this.moveWithoutManager(index);
    } else {
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
  }

  private moveWithoutManager(index: number) {
    let route = this.getRouteOfSelectedRow(this.navigationData[index]);
    if (route.length > 0) {
      const qParams = Codes.getIsDetailObject();
      let extras = {
        relativeTo: this.actRoute.parent
      };
      extras[Codes.QUERY_PARAMS] = qParams;
      const self = this;
      this.router.navigate(route, extras).then((navigationDone: boolean) => {
        if (navigationDone) {
          self.currentIndex = index;
        }
      });
    }
  }

  private moveInDialogManager(formLayoutManager: any, index: number) {
    formLayoutManager.dialogRef.componentInstance.urlParams = this.navigationData[index];
    this._form.setUrlParamsAndReload(this.navigationData[index]);
  }

  getRouteOfSelectedRow(item: any) {
    let route = [];
    let filter = undefined;
    if (typeof (item) === 'object') {
      for (let k = 0; k < this._form.keysArray.length; ++k) {
        let key = this._form.keysArray[k];
        filter = item[key];
      }
    }
    if (typeof (filter) !== 'undefined') {

      route.push(filter);
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
