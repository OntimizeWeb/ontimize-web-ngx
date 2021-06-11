import { Injectable, Injector } from '@angular/core';

import { ILocalStorageComponent } from '../../interfaces/local-storage-component.interface';
import { Util } from '../../util';
import { LocalStorageService } from '../local-storage.service';
import { AbstractComponentStateClass, DefaultComponentStateClass } from './o-component-state.class';

@Injectable()
export abstract class AbstractComponentStateService<S extends AbstractComponentStateClass, C extends ILocalStorageComponent = any>{

  protected localStorageService: LocalStorageService;

  protected component: C;
  public state: S;

  constructor(protected injector: Injector) {
    this.localStorageService = injector.get(LocalStorageService);
  }

  initialize(comp: C) {
    this.component = comp;
    if (Util.isDefined(this.state)) {
      this.initializeState(this.state);
    }
  }

  initializeState(state: S) {
    if (Util.isDefined(this.state)) {
      state.setData(this.localStorageService.getComponentStorage(this.component, this.component.getRouteKey()));
    }
  }
}

@Injectable()
export class DefaultComponentStateService extends AbstractComponentStateService<DefaultComponentStateClass, ILocalStorageComponent> {

  initialize(comp: ILocalStorageComponent) {
    this.state = new DefaultComponentStateClass();
    super.initialize(comp);
  }
}