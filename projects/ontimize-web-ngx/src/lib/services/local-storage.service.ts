import { EventEmitter, Injectable, Injector, Type } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

import { AppConfig } from '../config/app-config';
import { ILocalStorageComponent } from '../interfaces/local-storage-component.interface';
import { Config } from '../types/config.type';
import { SessionInfo } from '../types/session-info.type';
import { ObservableWrapper } from '../util/async';
import { Util } from '../util/util';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  static COMPONENTS_STORAGE_KEY: string = 'components';
  static USERS_STORAGE_KEY: string = 'users';
  static SESSION_STORAGE_KEY: string = 'session';

  public onRouteChange: EventEmitter<any> = new EventEmitter();
  public onSetLocalStorage: EventEmitter<any> = new EventEmitter();

  private _config: Config;
  private _router: Router;
  private authService: AuthService;


  constructor(protected injector: Injector) {
    this._config = this.injector.get<AppConfig>(AppConfig as Type<AppConfig>).getConfiguration();
    this._router = this.injector.get<Router>(Router as Type<Router>);
    this.authService = this.injector.get<AuthService>(AuthService as Type<AuthService>);
    const self = this;
    this._router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        ObservableWrapper.callEmit(self.onRouteChange, {});
      }
    });
  }

  getComponentStorage(comp: ILocalStorageComponent, routeKey?: string): any {
    const componentKey = comp.getComponentKey();
    let completeKey = componentKey;
    if (routeKey) {
      completeKey += '_' + routeKey;
    }
    return this.getAppComponentData(completeKey) || {};
  }

  updateComponentStorage(comp: ILocalStorageComponent, routeKey?: string) {
    const dataToStore = comp.getDataToStore();
    const componentKey = comp.getComponentKey();
    if (!Util.isDefined(componentKey)) {
      return;
    }
    let completeKey = componentKey;
    if (routeKey) {
      completeKey += '_' + routeKey;
    }
    const storedObject = {};
    for (const prop in dataToStore) {
      if (dataToStore.hasOwnProperty(prop)) {
        storedObject[prop] = dataToStore[prop];
      }
    }
    this.updateAppComponentStorage(completeKey, storedObject);
  }

  private getAppComponentData(key: string): object {
    let componentData;
    const storedComponents: object = this.getSessionUserComponentsData() || {};
    if (storedComponents[key]) {
      if (Object.keys(storedComponents[key]).length !== 0) {
        const decoded = atob((storedComponents[key]));
        try {
          componentData = JSON.parse(decoded);
        } catch (e) {
          componentData = undefined;
        }
      }


    }
    return componentData;
  }

  updateAppComponentStorage(componentKey: string, componentData: object) {
    let componentDataB64;
    try {
      componentDataB64 = btoa(Util.stringify(componentData));
    } catch (e) {
      componentDataB64 = undefined;
    }
    this.storeComponentInSessionUser(componentKey, componentDataB64);
  }

  public getSessionUserComponentsData(): object {
    let storedComponentsByUser = {};
    const appData = this.getStoredData();
    const session: SessionInfo = appData[LocalStorageService.SESSION_STORAGE_KEY] || {};
    const users = appData[LocalStorageService.USERS_STORAGE_KEY] || {};
    storedComponentsByUser = (users[session.user] || {})[LocalStorageService.COMPONENTS_STORAGE_KEY] || {};
    return storedComponentsByUser;
  }

  public storeSessionUserComponentsData(componentsData: object) {
    const appData = this.getStoredData();
    const session: SessionInfo = appData[LocalStorageService.SESSION_STORAGE_KEY] || {};
    if (!Util.isDefined(appData[LocalStorageService.USERS_STORAGE_KEY])) {
      appData[LocalStorageService.USERS_STORAGE_KEY] = {};
    }
    const userData = appData[LocalStorageService.USERS_STORAGE_KEY][session.user] || {};
    userData[LocalStorageService.COMPONENTS_STORAGE_KEY] = componentsData;
    appData[LocalStorageService.USERS_STORAGE_KEY][session.user] = userData;
    this.setLocalStorage(appData);
  }

  private storeComponentInSessionUser(componentKey, componentDataB64) {
    const appData = this.getStoredData();
    const session = appData[LocalStorageService.SESSION_STORAGE_KEY] || {}; // uuid -> session
    if (!Util.isDefined(this.authService)) {
      this.authService = this.injector.get<AuthService>(AuthService as Type<AuthService>);
    }
    const users = appData[LocalStorageService.USERS_STORAGE_KEY] || {}; // uuid -> users
    const idUser = session.user || this.authService.getSessionInfo().user;
    const user = users[idUser] || {}; // uuid -> users-> user

    let componentsData = {};
    if (users[idUser]) {
      componentsData = users[idUser][LocalStorageService.COMPONENTS_STORAGE_KEY] || {};
    }
    componentsData[componentKey] = componentDataB64 || {};

    user[LocalStorageService.COMPONENTS_STORAGE_KEY] = componentsData;
    users[idUser] = user;
    appData[LocalStorageService.USERS_STORAGE_KEY] = users;

    this.setLocalStorage(appData);
  }

  public getStoredData(): object {
    let appData = {};
    const appStoredData = localStorage.getItem(this._config.uuid);
    if (appStoredData) {
      try {
        appData = JSON.parse(appStoredData);
      } catch (e) {
        appData = {};
      }
    }
    return appData;
  }

  public setBackwardCompatibility() {
    const appData = this.getStoredData();
    const session = appData[LocalStorageService.SESSION_STORAGE_KEY];
    if (!Util.isDefined(session) || !Util.isDefined(session.user)) {
      return;
    }
    const componentsInfo = appData[LocalStorageService.COMPONENTS_STORAGE_KEY] || {};
    let usersObject = {};
    const existsUsersTag = Util.isDefined(appData[LocalStorageService.USERS_STORAGE_KEY]);
    let createUserInfo = existsUsersTag;
    if (existsUsersTag) {
      usersObject = appData[LocalStorageService.USERS_STORAGE_KEY];
      createUserInfo = !Util.isDefined(appData[LocalStorageService.USERS_STORAGE_KEY][session.user]);
    }
    if (createUserInfo) {
      usersObject[session.user] = {};
      usersObject[session.user][LocalStorageService.COMPONENTS_STORAGE_KEY] = componentsInfo;

      appData[LocalStorageService.USERS_STORAGE_KEY] = usersObject;
      try {
        localStorage.setItem(this._config.uuid, Util.stringify(appData));
      } catch (e) {
        console.error("Cannot set new item in localStorage. Error: " + e);
      }
    }
  }

  protected setLocalStorage(appData: any) {
    this.onSetLocalStorage.emit();
    try {
      localStorage.setItem(this._config.uuid, Util.stringify(appData));
    } catch (e) {
      console.error("Cannot set new item in localStorage. Error: " + e);
    }
  }

}
