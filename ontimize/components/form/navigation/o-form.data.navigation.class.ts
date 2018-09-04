import { Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocalStorageService, ILocalStorageComponent } from '../../../services';

export class OFormDataNavigation implements ILocalStorageComponent {
  public static NAVIGATION_DATA_KEY = 'navigation-data';
  protected state: any = [];

  protected localStorageService: LocalStorageService;
  protected onRouteChangeStorageSubscribe: Subscription;

  constructor(
    protected injector: Injector
  ) {
    let self = this;
    this.localStorageService = injector.get(LocalStorageService);
    this.onRouteChangeStorageSubscribe = this.localStorageService.onRouteChange.subscribe(function (res) {
      self.localStorageService.updateComponentStorage(self, false);
    });
  }

  destroy(): void {
    if (this.onRouteChangeStorageSubscribe) {
      this.onRouteChangeStorageSubscribe.unsubscribe();
    }
  }

  getComponentKey(): string {
    return OFormDataNavigation.NAVIGATION_DATA_KEY;
  }

  getDataToStore(): Object {
    return this.state;
  }

  setDataToStore(state: Object) {
    this.state = state;
  }

  getComponentStorage(): any[] {
    let storageObject = this.localStorageService.getComponentStorage(this, false);
    let storageArray = [];
    Object.keys(storageObject).map(x => storageArray.push(storageObject[x]));
    return storageArray;
  }

  static storeNavigationData(injector: Injector, data: any) {
    let localStorageService = injector.get(LocalStorageService);
    localStorageService.updateAppComponentsStorage(OFormDataNavigation.NAVIGATION_DATA_KEY, data);
  }
}
