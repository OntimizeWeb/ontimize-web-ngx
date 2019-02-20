
import { Injector, EventEmitter } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { ObservableWrapper } from '../util/async';
import { AppConfig, Config } from '../config/app-config';
import { SessionInfo } from '../services';
import { LoginService } from './login.service';

export interface ILocalStorageComponent {
  storeState?: boolean;
  getDataToStore(): Object;
  getComponentKey(): string;
}

export class LocalStorageService {
  static COMPONENTS_STORAGE_KEY: string = 'components';
  static USERS_STORAGE_KEY: string = 'users';
  static SESSION_STORAGE_KEY: string = 'session';

  public onRouteChange: EventEmitter<any> = new EventEmitter();

  private _config: Config;
  private _router: Router;
  private loginService: LoginService;

  constructor(protected injector: Injector) {
    this._config = this.injector.get(AppConfig).getConfiguration();
    this._router = this.injector.get(Router);
    this.loginService = this.injector.get(LoginService);

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
    let storedComponents: Object = this.getComponentsByUserSession() || {};
    if (storedComponents[key]) {
      let decoded = atob(storedComponents[key]);
      try {
        componentData = JSON.parse(decoded);
      } catch (e) {
        componentData = undefined;
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
    //if (componentDataB64) {
      this.setComponentsByUserSession(componentKey, componentDataB64);

    //}
  }


  private getComponentsByUserSession(): Object {
    let storedComponentsByUser = {};
    let appData = this.getStoredData();
    let session: SessionInfo = appData[LocalStorageService.SESSION_STORAGE_KEY] || {};
    let users = appData[LocalStorageService.USERS_STORAGE_KEY] || {};

    storedComponentsByUser = users[session.user][LocalStorageService.COMPONENTS_STORAGE_KEY] || {};

    return storedComponentsByUser;
  }

  private setComponentsByUserSession(componentKey, componentDataB64) {
    let appData = this.getStoredData();
    let session = appData[LocalStorageService.SESSION_STORAGE_KEY] || {};//uuid -> session
    let users = appData[LocalStorageService.USERS_STORAGE_KEY] || {};//uuid -> users

    const idUser = session.user || this.loginService.getSessionInfo().user;
    let user = users[idUser] || {};//uuid -> users-> user

    let componentData = {};
    if (users[idUser]) {
      componentData = users[idUser][LocalStorageService.COMPONENTS_STORAGE_KEY];
    }
    componentData[componentKey] = componentDataB64;

    user[LocalStorageService.COMPONENTS_STORAGE_KEY] = componentData;
    users[idUser] = user;
    appData[LocalStorageService.USERS_STORAGE_KEY] = users;

    localStorage.setItem(this._config['uuid'], JSON.stringify(appData));

  }

  public getStoredData(): Object {
    let appData = {};
    let appStoredData = localStorage.getItem(this._config['uuid']);
    if (appStoredData) {
      try {
        appData = JSON.parse(appStoredData);
      } catch (e) {
        appData = {};
      }

    }
    return appData;
  }
}

