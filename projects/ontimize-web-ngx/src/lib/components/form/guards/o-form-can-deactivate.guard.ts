import { isPromise } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { combineLatest, from, isObservable, Observable, of } from 'rxjs';

import { BooleanConverter } from '../../../decorators/input-converter';
import { Codes } from '../../../util/codes';
import { OFormConfirmExitService } from '../navigation/o-form-confirm-exit.service';
import { OFormComponent } from '../o-form.component';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export function wrapIntoObservable<T>(value: T | Promise<T> | Observable<T>): Observable<T> {
  if (isObservable(value)) {
    return value;
  }

  if (isPromise(value)) {
    // Use `Promise.resolve()` to wrap promise-like instances.
    return from(Promise.resolve(value));
  }

  return of(value);
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
        const arr: Observable<boolean>[] = Object.keys(this.oForms).map((key) => wrapIntoObservable(this.oForms[key].canDeactivate()));
        combineLatest(arr).subscribe(res => {
          resolve(res.every(value => value));
        });
      });
    }
    return true;
  }

  addForm(form: OFormComponent) {
    this.oForms[form.oattr] = form;
  }

  removeForm(form: OFormComponent) {
    delete this.oForms[form.oattr];
  }
}

