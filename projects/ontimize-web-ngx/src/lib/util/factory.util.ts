import { Injector } from '@angular/core';

import { AppConfig } from '../config/app-config';
import { JSONAPIService } from '../services/jsonapi/jsonapi.service';
import { OntimizeEEService } from '../services/ontimize/ontimize-ee.service';
import { OntimizeService } from '../services/ontimize/ontimize.service';

export class FactoryUtil {


  static isJsonApiService(injector: Injector): boolean {
    const config = injector.get(AppConfig);
    return config.getConfiguration().serviceType === 'JSONAPI' ||
      config.getConfiguration().serviceType instanceof JSONAPIService;
  }

  static isOntimizeEEService(injector: Injector): boolean {
    const config = injector.get(AppConfig);
    return (config.getConfiguration().serviceType === 'OntimizeEE' ||
      config.getConfiguration().serviceType instanceof OntimizeEEService) ||
      (config.getConfiguration().serviceType === 'Ontimize' ||
        config.getConfiguration().serviceType instanceof OntimizeService);
  }

}
