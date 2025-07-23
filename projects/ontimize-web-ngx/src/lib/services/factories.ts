import { Injector } from '@angular/core';

import { AppConfig } from '../config/app-config';
import {
  O_AUTH_SERVICE,
  O_COMPONENT_STATE_SERVICE,
  O_DATA_SERVICE,
  O_EXPORT_DATA_SERVICE,
  O_EXPORT_SERVICE,
  O_FILE_SERVICE,
  O_LOCALSTORAGE_SERVICE,
  O_PERMISSION_SERVICE,
  O_RESPONSE_ADAPTER,
  O_REQUEST_ADAPTER
} from '../injection-tokens';
import { IExportDataProvider } from '../interfaces/export-data-provider.interface';
import { IExportService } from '../interfaces/export-service.interface';
import { IFileService } from '../interfaces/file-service.interface';
import { ILocalStorageService } from '../interfaces/local-service.interface';
import { INameConvention } from '../interfaces/name-convention.interface';
import { IPermissionsService } from '../interfaces/permissions-service.interface';
import { IPreferencesService } from '../interfaces/prefereces-service.interface';
import { IServiceResponseAdapter } from '../interfaces/service-response-adapter.interface';
import { ServiceType } from '../types/service-type.type';
import { _getInjectionTokenValue } from '../util/injection-token.utils';
import { Util } from '../util/util';
import { AuthService } from './auth.service';
import { BaseServiceResponse } from './base-service-response.class';
import { JSONAPIPreferencesService } from './jsonapi/jsonapi-preferences.service';
import { JSONAPIServiceResponseAdapter } from './jsonapi/jsonapi-service-response.adapter';
import { LocalStorageService } from './local-storage.service';
import { NameConventionLower } from './name-convention/name-convention-lower.service';
import { NameConventionUpper } from './name-convention/name-convention-upper.service';
import { NameConvention } from './name-convention/name-convention.service';
import { OntimizeAuthService } from './o-auth.service';
import { OntimizeExportDataProviderService3X } from './ontimize-export-data-provider-3x.service';
import { OntimizeExportDataProviderService } from './ontimize-export-data-provider.service';
import { OntimizeExportService3X } from './ontimize/ontimize-export-3xx.service';
import { OntimizeExportService } from './ontimize/ontimize-export.service';
import { OntimizeFileService } from './ontimize/ontimize-file.service';
import { OntimizePreferencesService } from './ontimize/ontimize-preferences.service';
import { OntimizeServiceResponseAdapter } from './ontimize/ontimize-service-response.adapter';
import { OntimizeService } from './ontimize/ontimize.service';
import { OntimizeEEPermissionsService } from './permissions/ontimize-ee-permissions.service';
import { OntimizePermissionsService } from './permissions/ontimize-permissions.service';
import { IBaseRequestArgument } from './request-adapter/base-request-argument.interface';
import { JSONAPIRequestArgumentsAdapter } from './request-adapter/jsonapi-request-arguments.adapter';
import { OntimizeRequestArgumentsAdapter } from './request-adapter/ontimize-request-arguments.adapter';
import { AbstractComponentStateService, DefaultComponentStateService } from './state/o-component-state.service';
import { FactoryUtil } from '../util/factory.util';


/* ----------------------------------------------------------------------------------------------------
 * --------------------------------------------- FACTORIES --------------------------------------------
 * ---------------------------------------------------------------------------------------------------- */

/**
 * Creates a new instance of the data service.
 */
export function dataServiceFactory(injector: Injector): any {
  const serviceClass = _getInjectionTokenValue(O_DATA_SERVICE, injector);
  const service = Util.createServiceInstance(serviceClass, injector);
  if (Util.isDefined(service)) {
    return service;
  }
  const config = injector.get(AppConfig).getConfiguration();
  const serviceType = config.serviceType;
  return Util.createServiceInstanceByType(serviceType, injector);
}

export function createServiceInstance(serviceClass: any, injector: Injector): any {
  return Util.createServiceInstance(serviceClass, injector);
}

/**
 * Creates a new instance of the file service.
 */
export function fileServiceFactory(injector: Injector): IFileService {
  const serviceClass = _getInjectionTokenValue(O_FILE_SERVICE, injector);
  const service = Util.createServiceInstance(serviceClass, injector);
  return Util.isDefined(service) ? service : new OntimizeFileService(injector);
}

/**
 * Creates a new instance of the local storage service.
 */
export function localStorageServiceFactory(injector: Injector): ILocalStorageService {
  const serviceClass = _getInjectionTokenValue(O_LOCALSTORAGE_SERVICE, injector);
  const service = Util.createServiceInstance(serviceClass, injector);
  return Util.isDefined(service) ? service : new LocalStorageService(injector);
}
/**
 * Creates a new instance of the exportation service.
 */
export function exportServiceFactory(injector: Injector): IExportService {
  const serviceClass = _getInjectionTokenValue(O_EXPORT_SERVICE, injector);
  const service = Util.createServiceInstance(serviceClass, injector);
  if (Util.isDefined(service)) {
    return service;
  }
  const config = injector.get(AppConfig).getConfiguration();

  if (typeof (config.exportServiceType) === 'undefined') {
    if (config.exportConfiguration) {
      return new OntimizeExportService3X(injector);
    } else {
      return new OntimizeExportService(injector);
    }
  }
  return Util.createServiceInstance(config.exportServiceType, injector);
}

export function exportDataFactory(injector: Injector): IExportDataProvider {
  const provider = _getInjectionTokenValue(O_EXPORT_DATA_SERVICE, injector);
  const service = Util.createServiceInstance(provider, injector);
  if (Util.isDefined(service)) {
    return service;
  } else {
    const config = injector.get(AppConfig).getConfiguration();
    if (typeof (config.exportConfiguration) === 'undefined') {
      return new OntimizeExportDataProviderService(injector);
    } else {
      return new OntimizeExportDataProviderService3X(injector);
    }
  }

}
export function serviceRequestAdapterFactory(injector: Injector): IBaseRequestArgument {

  const serviceClass = _getInjectionTokenValue(O_REQUEST_ADAPTER, injector);
  const service = Util.createServiceInstance(serviceClass, injector);

  if (Util.isDefined(service)) {
    return service;
  }

  const config = injector.get(AppConfig).getConfiguration();
  if (!Util.isDefined(config.serviceType) ||
    FactoryUtil.isOntimizeEEService(injector)) {
    return new OntimizeRequestArgumentsAdapter();
  } else if (FactoryUtil.isJsonApiService(injector)) {
    return new JSONAPIRequestArgumentsAdapter();
  }
  return new OntimizeRequestArgumentsAdapter();
}

export function serviceResponseAdapterFactory(injector: Injector): IServiceResponseAdapter<BaseServiceResponse> {
  const serviceClass = _getInjectionTokenValue(O_RESPONSE_ADAPTER, injector);
  const service = Util.createServiceInstance(serviceClass, injector);

  if (Util.isDefined(service)) {
    return service;
  }
  const config = injector.get(AppConfig).getConfiguration();
  if (!Util.isDefined(config.serviceType) ||
    (FactoryUtil.isOntimizeEEService(injector))) {
    return new OntimizeServiceResponseAdapter();
  } else if (FactoryUtil.isJsonApiService(injector)) {

    return new JSONAPIServiceResponseAdapter();
  }
  return new JSONAPIServiceResponseAdapter();
}

/**
 * Creates a new instance of the permission service.
 */
export function permissionsServiceFactory(injector: Injector): IPermissionsService {
  const serviceClass = _getInjectionTokenValue(O_PERMISSION_SERVICE, injector);
  const service = Util.createServiceInstance(serviceClass, injector);
  if (Util.isDefined(service)) {
    return service;
  }
  const config = injector.get(AppConfig).getConfiguration();

  if (!Util.isDefined(config.permissionsServiceType) || 'OntimizeEEPermissions' === config.permissionsServiceType) {
    return new OntimizeEEPermissionsService(injector);
  } else if ('OntimizePermissions' === config.permissionsServiceType) {
    return new OntimizePermissionsService(injector);
  }
  return Util.createServiceInstance(config.permissionsServiceType, injector);
}

/**
 * Creates a new instance of the preferences service.
 */
export function preferencesServiceFactory(injector: Injector): IPreferencesService {

  const config = injector.get(AppConfig).getConfiguration();

  if (!Util.isDefined(config.serviceType) || FactoryUtil.isOntimizeEEService(injector)) {
    return new OntimizePreferencesService(injector);
  } else if (FactoryUtil.isJsonApiService(injector)) {
    return new JSONAPIPreferencesService(injector);
  }
  return new JSONAPIPreferencesService(injector);
}

/**
 * Creates a new instance of the authentication service.
 */
export function authServiceFactory(injector: Injector): AuthService {
  const serviceClass = _getInjectionTokenValue(O_AUTH_SERVICE, injector);
  const service = Util.createServiceInstance(serviceClass, injector);
  return Util.isDefined(service) ? service : new OntimizeAuthService(injector);
}

export function componentStateFactory(injector: Injector): AbstractComponentStateService<any, any> {
  const service = _getInjectionTokenValue(O_COMPONENT_STATE_SERVICE, injector);
  return Util.isDefined(service) ? service : new DefaultComponentStateService(injector);
}

/* ----------------------------------------------------------------------------------------------------
 * -------------------------------------------- PROVIDERS ---------------------------------------------
 * ----------------------------------------------------------------------------------------------------
 * Using the same provider multiple times accross the project produces namespaces conflicts when
 * building with ng-packagr, so we reused the providers defined here.
 * ---------------------------------------------------------------------------------------------------- */

export const OntimizeServiceProvider = { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] };

export const OntimizeExportServiceProvider = { provide: OntimizeExportService, useFactory: exportServiceFactory, deps: [Injector] };

export const OntimizeAuthServiceProvider = { provide: AuthService, useFactory: authServiceFactory, deps: [Injector] };

export const ComponentStateServiceProvider = { provide: AbstractComponentStateService, useFactory: componentStateFactory, deps: [Injector] };

export const ExportDataServiceProvider = { provide: OntimizeExportDataProviderService, useFactory: exportDataFactory, deps: [Injector] };

export const ServiceRequestAdapter = { provide: OntimizeRequestArgumentsAdapter, useFactory: serviceRequestAdapterFactory, deps: [Injector] };

export const ServiceResponseAdapter = { provide: OntimizeServiceResponseAdapter, useFactory: serviceResponseAdapterFactory, deps: [Injector] };

export const NameConventionProvider = { provide: NameConvention, useFactory: nameConventionServiceFactory, deps: [Injector] };
export const OntimizeLocalStorageServiceProvider = { provide: LocalStorageService, useFactory: localStorageServiceFactory, deps: [Injector] };

/**
 * Creates a new instance of the preferences service.
 */
export function nameConventionServiceFactory(injector: Injector): INameConvention {

  const config = injector.get(AppConfig).getConfiguration();

  if (config?.nameConvention === 'lower') {
    return new NameConventionLower();
  } else if (config?.nameConvention === 'upper') {
    return new NameConventionUpper();
  }
  return new NameConvention();
}



