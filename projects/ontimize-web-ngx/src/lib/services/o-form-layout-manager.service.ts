import { Injectable, Injector } from '@angular/core';

import type { OFormLayoutManagerComponent } from '../layouts/form-layout/o-form-layout-manager.component';
import { OFormLayoutManagerContext } from '../types/form-layout-manager-context.type';

@Injectable({
  providedIn: 'root'
})
export class OFormLayoutManagerService {
  protected registeredFormLayoutManagers = {};
  protected _activeFormLayoutManager: OFormLayoutManagerComponent;
  private _context: OFormLayoutManagerContext;

  constructor(protected injector: Injector) { }

  registerFormLayoutManager(comp: OFormLayoutManagerComponent) {
    this.registeredFormLayoutManagers[comp.getAttribute()] = comp;
  }

  removeFormLayoutManager(comp: OFormLayoutManagerComponent) {
    delete this.registeredFormLayoutManagers[comp.getAttribute()];
  }

  get activeFormLayoutManager(): OFormLayoutManagerComponent {
    return this._activeFormLayoutManager;
  }

  set activeFormLayoutManager(arg: OFormLayoutManagerComponent) {
    this._activeFormLayoutManager = arg;
  }

  set context(value: OFormLayoutManagerContext) {
    this._context = value;
  }

  get context(): OFormLayoutManagerContext {
    return this._context;
  }
}
