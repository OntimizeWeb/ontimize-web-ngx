import { Injectable, Injector, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ILocalStorageComponent } from '../../interfaces/local-storage-component.interface';
import { Util } from '../../util';
import { LocalStorageService } from '../local-storage.service';
import { AbstractComponentStateClass, DefaultComponentStateClass, DefaultServiceComponentStateClass } from './o-component-state.class';

@Injectable()
export abstract class AbstractComponentStateService<S extends AbstractComponentStateClass, C extends ILocalStorageComponent = any>{

  protected localStorageService: LocalStorageService;

  protected component: C;
  public state: S;
  protected router: Router;
  protected actRoute: ActivatedRoute;

  constructor(protected injector: Injector) {
    this.localStorageService = injector.get<LocalStorageService>(LocalStorageService);
    this.router = this.injector.get<Router>(Router as Type<Router>);
    this.actRoute = this.injector.get<ActivatedRoute>(ActivatedRoute as Type<ActivatedRoute>);
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

  public getRouteKey(): string {
    let route = this.router.url;
    this.actRoute.params.subscribe(params => {
      Object.keys(params).forEach(key => {
        route = route.replace(params[key], key);
      });
    });
    return route;
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
