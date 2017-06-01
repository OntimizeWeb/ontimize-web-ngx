import { Injector } from '@angular/core';

import {
  Config,
  AppConfig,
  APP_CONFIG
} from '../config/app-config';

export class ServiceConfigFactory {
  serviceConf: any;
  config: Config;
  constructor(protected injector: Injector) {
    this.config = this.injector.get(APP_CONFIG);
  }

  public factory(): any {
    const appConfig = new AppConfig(this.config);
    const config = appConfig.getConfiguration();
    let servicesConf = {};
    if (config.hasOwnProperty('servicesConfiguration')) {
      servicesConf = config['servicesConfiguration'];
    }
    return servicesConf;
  }
}

export function serviceConfigFactory(injector: Injector) {
  return new ServiceConfigFactory(injector).factory();
}
