import { Injectable, Injector } from '@angular/core';

import { OFormLayoutManagerComponent } from '../layouts/form-layout/o-form-layout-manager.component';

@Injectable({
  providedIn: 'root'
})
export class OFormLayoutManagerService {
  protected registeredFormLayoutManagers = {};
  protected _activeFormLayoutManager: OFormLayoutManagerComponent;

  constructor(protected injector: Injector) {
  }

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
}
