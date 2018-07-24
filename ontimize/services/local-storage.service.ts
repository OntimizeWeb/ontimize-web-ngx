
import { Injector, EventEmitter } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { ObservableWrapper } from '../util/async';
import { AppConfig, Config } from '../config/app-config';

export interface ILocalStorageComponent {
  storeState?: boolean;
  getDataToStore(): Object;
  getComponentKey(): string;
}

export class LocalStorageService {
  static COMPONENTS_STORAGE_KEY: string = 'components';

  public onRouteChange: EventEmitter<any> = new EventEmitter();

  private _config: Config;
  private _router: Router;

  constructor(protected injector: Injector) {
    this._config = this.injector.get(AppConfig).getConfiguration();
    this._router = this.injector.get(Router);

    var self = this;
    this._router.events.subscribe(
      event => {
        if (event instanceof NavigationStart) {
          ObservableWrapper.callEmit(self.onRouteChange, {});
        }
      }
    );
  }

  getComponentStorage(comp: ILocalStorageComponent, useRouteOnKey: boolean = true): Object {
    var componentKey = comp.getComponentKey();
    var completeKey = componentKey;
    if (useRouteOnKey) {
      completeKey += '_' + this._router.url;
    }
    return this.getAppComponentData(completeKey) || {};
  }

  updateComponentStorage(comp: ILocalStorageComponent, useRouteOnKey: boolean = true) {
    var dataToStore = comp.getDataToStore();
    var componentKey = comp.getComponentKey();
    var completeKey = componentKey;
    if (useRouteOnKey) {
      completeKey += '_' + this._router.url;
    }

    //let storedObject = this.getAppComponentData(completeKey) || {};
    let storedObject = {};

    for (var prop in dataToStore) {
      if (dataToStore.hasOwnProperty(prop)) {
        storedObject[prop] = dataToStore[prop];
      }
    }

    this.updateAppComponentsStorage(completeKey, storedObject);
  }


  private getAppComponentData(key: string): Object {
    let componentData = undefined;
    let appData = {};
    let appStoredData = localStorage.getItem(this._config['uuid']);
    if (appStoredData) {
      try {
        appData = JSON.parse(appStoredData);
      } catch (e) {
        appData = {};
      }
      let storedComponents: Object = appData[LocalStorageService.COMPONENTS_STORAGE_KEY] || {};
      if (storedComponents[key]) {
        let decoded = atob(storedComponents[key]);
        try {
          componentData = JSON.parse(decoded);
        } catch (e) {
          componentData = undefined;
        }
      }
    }
    return componentData;
  }

  updateAppComponentsStorage(componentKey: string, componentData: Object) {
    let componentDataB64: Object = undefined;
    try {
      componentDataB64 = btoa(JSON.stringify(componentData));
    } catch (e) {
      componentDataB64 = undefined;
    }
    if (componentDataB64) {
      let appStoredData = localStorage.getItem(this._config['uuid']);
      if (!appStoredData) {
        let newAppData: Object = {};
        let componentData = {};
        componentData[componentKey] = componentDataB64;
        newAppData[LocalStorageService.COMPONENTS_STORAGE_KEY] = componentData;
        localStorage.setItem(this._config['uuid'], JSON.stringify(newAppData));
      } else {
        let appData = {};
        try {
          appData = JSON.parse(appStoredData);
        } catch (e) {
          appData = {};
        }
        let componentsData: Object = appData[LocalStorageService.COMPONENTS_STORAGE_KEY] || {};
        componentsData[componentKey] = componentDataB64;
        appData[LocalStorageService.COMPONENTS_STORAGE_KEY] = componentsData;
        localStorage.setItem(this._config['uuid'], JSON.stringify(appData));
      }
    }
  }

  // b64EncodeUnicode(str) {
  //   return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
  //     // return String.fromCharCode('0x' + p1);
  //     return String.fromCharCode(p1);
  //   }));
  // }

  // b64DecodeUnicode(str) {
  //   return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
  //     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  //   }).join(''));
  // }
}
