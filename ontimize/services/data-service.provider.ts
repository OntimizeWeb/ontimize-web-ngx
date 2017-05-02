import { Injector } from '@angular/core';
import {OpaqueToken} from '@angular/core';
import {Http} from '@angular/http';

import {OntimizeEEService} from './ontimize-ee.service';
import {OntimizeService} from './ontimize.service';
import {APP_CONFIG, Config} from '../config/app-config';

export const SERVICE_CONFIG = new OpaqueToken('service.config');

class DataServiceFactory {

  protected config: Config;
  protected http: Http;

  constructor(protected injector: Injector) {
    this.config = this.injector.get(APP_CONFIG);
    this.http = this.injector.get(Http);
  }

  public factory(): any {
    if (typeof(this.config.serviceType)==='undefined') {
      return new OntimizeService(this.injector);
    }else if ('OntimizeEE' === this.config.serviceType) {
      return new OntimizeEEService(this.injector);
    } else {
      //  let newInstace =(this.config.servicetype as any).prototype;
      //  return newInstace.constructor.apply(newInstace, new Array(this.http));
      let newInstance = Object.create((this.config.serviceType as any).prototype);
      this.config.serviceType.apply(newInstance, new Array(this.injector));
      return newInstance;
    }
  }
};

export function dataServiceFactory (injector: Injector) {
  return new DataServiceFactory(injector).factory();
};
