import { Injector } from '@angular/core';

import { AppConfig, Config } from '../config/app-config';
import { OntimizeEEService } from './ontimize-ee.service';
import { OntimizeService } from './ontimize.service';

class DataServiceFactory {

  protected config: Config;

  constructor(protected injector: Injector) {
    this.config = this.injector.get(AppConfig).getConfiguration();
  }

  public factory(): any {
    if (typeof (this.config.serviceType) === 'undefined') {
      return new OntimizeService(this.injector);
    } else if ('OntimizeEE' === this.config.serviceType) {
      return new OntimizeEEService(this.injector);
    } else {
      const newInstance = Object.create((this.config.serviceType as any).prototype);
      this.config.serviceType.apply(newInstance, new Array(this.injector));
      return newInstance;
    }
  }
}

export function dataServiceFactory(injector: Injector) {
  return new DataServiceFactory(injector).factory();
}
