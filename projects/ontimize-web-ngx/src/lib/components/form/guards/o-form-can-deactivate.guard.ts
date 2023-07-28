import { isPromise } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { combineLatest, from, isObservable, Observable, of } from 'rxjs';

import { BooleanConverter } from '../../../decorators/input-converter';
import { Codes } from '../../../util/codes';
import { Util } from '../../../util/util';
import { OFormConfirmExitService } from '../navigation/o-form-confirm-exit.service';
import { OFormComponent } from '../o-form.component';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateFormGuard implements CanDeactivate<CanComponentDeactivate> {
  public static CLASSNAME = 'CanDeactivateFormGuard';

  protected oForms: { [key: string]: OFormComponent } = {};

  constructor(protected oFormConfirmExitService: OFormConfirmExitService) { }

  canDeactivate(component: CanComponentDeactivate, curr: ActivatedRouteSnapshot, state: RouterStateSnapshot, future: RouterStateSnapshot)
    : Observable<boolean> | Promise<boolean> | boolean {
    if (BooleanConverter(future.root.queryParams[Codes.IGNORE_CAN_DEACTIVATE])) {
      return true;
    }
    if (Object.keys(this.oForms).length) {
      return new Promise((resolve) => {
        const arr: Observable<boolean>[] = Object.keys(this.oForms).map((key) => Util.wrapIntoObservable(this.oForms[key].canDeactivate()));
        combineLatest(arr).subscribe(res => {
          resolve(res.every(value => value));
        });
      });
    }
    return true;
  }

  addForm(form: OFormComponent) {
    form.deactivateGuardId = this.getFormKey(form)
    this.oForms[form.deactivateGuardId] = form;
  }

  removeForm(form: OFormComponent) {
    delete this.oForms[form.deactivateGuardId];
    delete form.deactivateGuardId;
  }

  isFormsCacheEmpty(): boolean {
    return Object.keys(this.oForms).length === 0;
  }

  private getFormKey(form: OFormComponent): string {
    const formLayoutManager = form.getFormManager();
    return formLayoutManager ? `${formLayoutManager.getIdOfActiveItem()}${form.oattr}` : form.oattr;
  }
}

