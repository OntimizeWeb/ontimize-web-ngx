import {
  Component,
  forwardRef,
  Inject,
  Injector,
  ViewEncapsulation
} from '@angular/core';

import { OFormComponent } from '../o-form.component';
import { OFormDataNavigation } from './o-form.data.navigation.class';
import { Router, ActivatedRoute } from '@angular/router';
import { OFormNavigationClass } from './o-form.navigation.class';
import { Util } from '../../../util/util';
import { OFormLayoutManagerComponent } from '../../../layouts';

@Component({
  selector: 'o-form-navigation',
  templateUrl: './o-form-navigation.component.html',
  styleUrls: ['./o-form-navigation.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class OFormNavigationComponent {

  public navigationData: Array<any> = [];
  public currentIndex = 0;

  protected formNavigation: OFormNavigationClass;

  constructor(protected injector: Injector,
    @Inject(forwardRef(() => OFormComponent)) private _form: OFormComponent,
    private router: Router,
    private actRoute: ActivatedRoute,
  ) {

    this.formNavigation = this._form.getFormNavigation();
    this.navigationData = new OFormDataNavigation(this.injector).getComponentStorage();
    this.currentIndex = this.getCurrentIndex();
  }


  getCurrentIndex(): number {
    let index: number = 0;
    const currentItem = this.formNavigation.getUrlParams();
    for (let item of this.navigationData) {
      if (Util.isEquivalent(item, currentItem)) {
        return index;
      }
      index++;
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

  numberOfRecords() {
    let total = this.navigationData.length;
    let index = this.currentIndex + 1;
    if (total === 0 || total === 1) {
      return '';
    }
    return index + ' / ' + total;
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
      let extras;
      this.currentIndex = index;
      const queryParams = {
        'isdetail': 'true'
      };
      extras = {
        relativeTo: this.actRoute.parent,
        queryParams: queryParams
      };
      this.router.navigate(route, extras);
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

}
