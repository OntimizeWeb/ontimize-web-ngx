import { Injector } from '@angular/core';

import { APP_CONFIG, AppConfig } from '../config/app-config';
import { Config } from '../types/config.type';

export class AppConfigFactory {
  config: Config;
  constructor(protected injector: Injector) {
    this.config = this.injector.get(APP_CONFIG);
  }

  public factory(): any {
    return new AppConfig(this.config);
  }
}

export function appConfigFactory(injector: Injector) {
  return new AppConfigFactory(injector).factory();
}
