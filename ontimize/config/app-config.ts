import { InjectionToken } from '@angular/core';
import { MenuRootItem } from '../services';
import { Util } from '../utils';

let DEFAULT_LOCAL_STORAGE_KEY = 'ontimize-web-uuid';
let DEFAULT_CONFIG: Config = {
  uuid: DEFAULT_LOCAL_STORAGE_KEY,
  title: 'Ontimize Web App'
};

export const APP_CONFIG = new InjectionToken<Config>('app.config');

export interface Config {
  // apiEndpoint [string]: The base path of the URL used by app services.
  apiEndpoint?: string;

  bundle?: {
    // endpoint [string]: The base path of the URL used by bundle service.
    endpoint?: string;
    // path [string]: The path of the URL to remote bundle method.
    path?: string;
  };

  // startSessionPath [string]: The path of the URL to startsession method.
  startSessionPath?: string;

  // uuid [string]: Application identifier. Is the unique package identifier of the app. It is used when storing or managing temporal data related with the app. By default is set as 'ontimize-web-uuid'./
  uuid: string;

  // title [string]: Title of the app. By default 'Ontimize Web App'.
  title: string;

  // locale [string][en|es]: Language of the application. By default 'en'
  locale?: string;

  applicationLocales?: string[];

  // serviceType [ undefined | '' | class ]: The service type used (Ontimize REST standart, Ontimize REST JEE or custom implementation) in the whole application. By default 'undefined', that is, Ontimize REST standard service.
  serviceType?: any;

  // servicesConfiguration: [Object]: Configuration parameters of application services.
  servicesConfiguration?: Object;

  // appMenuConfiguration?: MenuGroup[];
  appMenuConfiguration?: MenuRootItem[];

  // authGuard [Object]: Configuration parameters of application permissions.
  authGuard?: {
    type?: any;
    service?: string;
    entity?: string;
    keyColumn?: string;
    valueColumn?: string;
  };
}

export class AppConfig {
  private _config: any;

  constructor(config?) {
    this._config = (config && Util.isObject(config) && !Array.isArray(config)) ? config : {};
  }

  public getConfiguration(): Config {
    return Object.assign(DEFAULT_CONFIG, this._config);
  }

  public getServiceConfiguration(): Config {
    return this._config['servicesConfiguration'] || {};
  }

  public getMenuConfiguration(): MenuRootItem[] {
    return this._config['appMenuConfiguration'] || [];
  }

  public useRemoteBundle(): boolean {
    return Util.isDefined(this._config.bundle);
  }

  public getBundleEndpoint(): string {
    let result = undefined;
    let existsBundleConf = (Util.isDefined(this._config.bundle));

    if (existsBundleConf && Util.isDefined(this._config.bundle.endpoint)) {
      result = this._config.bundle.endpoint;
    } else if (existsBundleConf && Util.isDefined(this._config.bundle.path)) {
      result = this._config.apiEndpoint + '/' + this._config.bundle.path;
    }
    return result;
  }


}

