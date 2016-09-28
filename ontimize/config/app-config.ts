import {OpaqueToken} from '@angular/core';

const isObject = val => typeof val === 'object';
const isArray = Array.isArray;


let DEFAULT_LOCAL_STORAGE_KEY = 'ontimize-web-uuid';
let DEFAULT_CONFIG: Config = {
  uuid: DEFAULT_LOCAL_STORAGE_KEY,
  title: 'Ontimize Web App'
};

export const APP_CONFIG = new OpaqueToken('app.config');

export interface Config {
  // apiEndpoint [string]: The base path of the URL used by app services.
  apiEndpoint?: string;

  // uuid [string]: Application identifier. Is the unique package identifier of the app. It is used when storing or managing temporal data related with the app. By default is set as 'ontimize-web-uuid'./
  uuid: string;

  // title [string]: Title of the app. By default 'Ontimize Web App'.
  title: string;

  // locale [string][en|es]: Language of the application. By default 'en'
  locale?: string;

  // serviceType [ undefined | '' | class ]: The service type used (Ontimize REST standart, Ontimize REST JEE or custom implementation) in the whole application. By default 'undefined', that is, Ontimize REST standard service.
  serviceType?: any;

  // servicesConfiguration: [Object]: Configuration parameters of application services.
  servicesConfiguration?: Object;

  // authGuard [Object]: Configuration parameters of application permissions.
  authGuard?: {
    type?: any;
    entity?: string;
    keyColumn?: string;
    valueColumn?: string;
  };
}

export class AppConfig {
  private _config: any;

 constructor(config?) {
    this._config = config && isObject(config) && !isArray(config) ? config : {};
  }

 public getConfiguration() : Config {
   return Object.assign(DEFAULT_CONFIG, this._config);
  }
}

