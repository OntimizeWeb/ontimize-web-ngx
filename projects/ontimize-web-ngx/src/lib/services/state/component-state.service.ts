import { Injectable, Injector } from '@angular/core';

import { ILocalStorageComponent } from '../../interfaces/local-storage-component.interface';
import { LocalStorageService } from '../local-storage.service';

@Injectable()
export class ComponentStateService {
  protected localStorageService: LocalStorageService;
  protected component: ILocalStorageComponent;
  public state: any;

  constructor(protected injector: Injector) {
    this.localStorageService = injector.get(LocalStorageService);
  }

  initialize(comp: ILocalStorageComponent) {
    this.component = comp;
    this.state = this.localStorageService.getComponentStorage(comp, comp.getRouteKey());
  }
}
