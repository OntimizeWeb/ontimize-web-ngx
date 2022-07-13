import { InjectionToken } from '@angular/core';

import { Config } from '../types/config.type';
import { MenuRootItem } from '../types/menu-root-item.type';
import { OInputsOptions } from '../types/o-inputs-options.type';
import { ORemoteConfiguration } from '../types/remote-configuration.type';
import { Util } from '../util/util';

const DEFAULT_LOCAL_STORAGE_KEY = undefined;
const DEFAULT_CONFIG: Config = {
  uuid: DEFAULT_LOCAL_STORAGE_KEY,
  title: 'Ontimize Web App'
};

export const O_INPUTS_OPTIONS = new InjectionToken<OInputsOptions>('o-inputs-options');

export const APP_CONFIG = new InjectionToken<Config>('app.config');

export class AppConfig {
  private _config: Config;

  constructor(config?) {
    this._config = (config && Util.isObject(config) && !Array.isArray(config)) ? config : {};
  }

  public getConfiguration(): Config {
    return Object.assign(DEFAULT_CONFIG, this._config);
  }

  public getServiceConfiguration(): any {
    return this._config.servicesConfiguration || {};
  }

  public getMenuConfiguration(): MenuRootItem[] {
    return this._config.appMenuConfiguration || [];
  }

  public useRemoteBundle(): boolean {
    return Util.isDefined(this._config.bundle);
  }

  public getBundleEndpoint(): string {
    let result: string;
    const existsBundleConf = this.useRemoteBundle();
    if (existsBundleConf && Util.isDefined(this._config.bundle.endpoint)) {
      result = this._config.bundle.endpoint;
    } else if (existsBundleConf && Util.isDefined(this._config.bundle.path)) {
      result = this._config.apiEndpoint + '/' + this._config.bundle.path;
    }
    return result;
  }

  public getI18nAssetsConfiguration(): any {
    if (Util.isDefined(this._config.assets) && Util.isDefined(this._config.assets.i18n)) {
      return this._config.assets.i18n;
    }
    return undefined;
  }

  public getCssAssetsConfiguration(): any {
    if (Util.isDefined(this._config.assets) && Util.isDefined(this._config.assets.css)) {
      return this._config.assets.css;
    }
    return undefined;
  }

  public getImagesAssetsConfiguration(): any {
    if (Util.isDefined(this._config.assets) && Util.isDefined(this._config.assets.images)) {
      return this._config.assets.images;
    }
    return undefined;
  }

  public getJsAssetsConfiguration(): any {
    if (Util.isDefined(this._config.assets) && Util.isDefined(this._config.assets.js)) {
      return this._config.assets.js;
    }
    return undefined;
  }

  public getRemoteConfigurationConfig(): ORemoteConfiguration {
    return this._config.remoteConfig;
  }

  public useRemoteConfiguration(): boolean {
    return Util.isDefined(this._config.remoteConfig);
  }

  public getRemoteConfigurationEndpoint(): string {
    let result: string;
    const existsRemoteConf = this.useRemoteConfiguration();
    if (existsRemoteConf && Util.isDefined(this._config.remoteConfig.endpoint)) {
      result = this._config.remoteConfig.endpoint;
    } else if (existsRemoteConf && Util.isDefined(this._config.remoteConfig.path)) {
      result = this._config.apiEndpoint + '/' + this._config.remoteConfig.path;
    }
    return result;
  }

  public useExportConfiguration(): boolean {
    return Util.isDefined(this._config.exportConfiguration);
  }

  public getExportPath() {
    let result: string;
    const existsRemoteConf = this.useExportConfiguration();
    if (existsRemoteConf && Util.isDefined(this._config.exportConfiguration.path)) {
      result = this._config.exportConfiguration.path;
    } else {
      result = this._config.apiEndpoint + '/export';
    }
    return result;
  }

}
