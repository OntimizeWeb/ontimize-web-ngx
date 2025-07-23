import { Injector } from '@angular/core';

import { AppConfig } from '../config/app-config';
import { JSONAPIService } from '../services/jsonapi/jsonapi.service';
import { OntimizeEEService } from '../services/ontimize/ontimize-ee.service';
import { OntimizeService } from '../services/ontimize/ontimize.service';
import { ServiceType } from '../types/service-type.type';
import { Util } from './util';
import { OConfigureServiceArgs } from '../types/configure-service-args.type';

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

  static createServiceInstanceByType(serviceType: ServiceType, injector: Injector): any {
    if (!Util.isDefined(serviceType) || ServiceType.OntimizeEE === serviceType) {
      return new OntimizeEEService(injector);
    }
    if (ServiceType.Ontimize === serviceType) {
      return new OntimizeService(injector);
    }
    if (ServiceType.JSONAPI === serviceType) {
      return new JSONAPIService(injector);
    }
    return Util.createServiceInstance(serviceType, injector);

  }

  private static getDataServiceInstance(serviceType: any, baseService: any, injector: Injector): any {
    if (!serviceType) {
      return injector.get<any>(baseService);
    }

    if (![ServiceType.Ontimize, ServiceType.OntimizeEE, ServiceType.JSONAPI].includes(serviceType)) {
      return FactoryUtil.createServiceInstanceByType(injector.get<any>(serviceType), injector);
    }

    return FactoryUtil.createServiceInstanceByType(serviceType, injector);
  }

   static configureService(configureServiceArgs: OConfigureServiceArgs): any {
      const baseService = configureServiceArgs.baseService;
      const entity = configureServiceArgs.entity;
      const service = configureServiceArgs.service;
      const injector = configureServiceArgs.injector;

      const config = injector.get(AppConfig);
      const serviceConfiguration = config.getServiceConfiguration();
      const serviceConfigurationType = serviceConfiguration[service]?.serviceType;
      const serviceType = configureServiceArgs.serviceType || serviceConfigurationType;

      try {
        let dataService = this.getDataServiceInstance(serviceType, baseService, injector);

        if (Util.isDataService(dataService)) {
          const serviceCfg = dataService.getDefaultServiceConfiguration(service);
          if (entity) {
            serviceCfg.entity = entity;
          }
          dataService.configureService(serviceCfg);
        }
        return dataService;
      } catch (e) {
        console.error(e);
        return null;
      }

    }


}
