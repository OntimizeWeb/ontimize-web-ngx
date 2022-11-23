import { Injectable, Injector } from '@angular/core';

import { ILocalStorageComponent } from '../../interfaces/local-storage-component.interface';
import { Util } from '../../util';
import { LocalStorageService } from '../local-storage.service';
import { AbstractComponentStateClass, DefaultComponentStateClass, DefaultServiceComponentStateClass } from './o-component-state.class';

@Injectable()
export abstract class AbstractComponentStateService<S extends AbstractComponentStateClass, C extends ILocalStorageComponent = any>{

  protected localStorageService: LocalStorageService;

  protected component: C;
  public state: S;

  constructor(protected injector: Injector) {
    this.localStorageService = injector.get<LocalStorageService>(LocalStorageService);
  }

  public initialize(comp: C) {
    this.component = comp;
    if (Util.isDefined(this.state)) {
      this.initializeState(this.state);
    }
  }

  public initializeState(state: S) {
    if (Util.isDefined(this.state) &&
      ((Util.isDefined(this.component.storeState) && this.component.storeState
        ||
        !Util.isDefined(this.component.storeState)))
    ) {
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

@Injectable()
export class DefaultServiceComponentStateService extends AbstractComponentStateService<DefaultServiceComponentStateClass, ILocalStorageComponent> {

  initialize(comp: ILocalStorageComponent) {
    this.state = new DefaultServiceComponentStateClass();
    super.initialize(comp);
  }
}
