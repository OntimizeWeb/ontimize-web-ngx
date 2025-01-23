import { EventEmitter } from '@angular/core';

import { ILocalStorageComponent } from '../interfaces/local-storage-component.interface';

export interface ILocalStorageService {

  onRouteChange: EventEmitter<any>;
  onSetLocalStorage: EventEmitter<any>;

  getComponentStorage(comp: ILocalStorageComponent, routeKey?: string): any;

  updateComponentStorage(comp: ILocalStorageComponent, routeKey?: string);

  updateAppComponentStorage(componentKey: string, componentData: object);

  getSessionUserComponentsData(): object;

  storeSessionUserComponentsData(componentsData: object);

  getStoredData(): object;

  setBackwardCompatibility();

  setLocalStorage(appData: any);

  removeStoredData();


}
