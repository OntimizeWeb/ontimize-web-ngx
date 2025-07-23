import { Injector } from '@angular/core';
import moment from 'moment';
import { from, isObservable, Observable, of } from 'rxjs';

import { IDataService } from '../interfaces/data-service.interface';
import { IFormDataComponent } from '../interfaces/form-data-component.interface';
import { IPermissionsService } from '../interfaces/permissions-service.interface';
import { OConfigureMessageServiceArgs } from '../types/configure-message-service-args.type';
import { OConfigureServiceArgs } from '../types/configure-service-args.type';
import { ODateValueType } from '../types/o-date-value.type';
import { Base64 } from './base64';
import { Codes } from './codes';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AppConfig } from '../config/app-config';
import { ServiceType } from '../types/service-type.type';
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
