import { InjectionToken, Injector } from '@angular/core';

import { AppConfig } from '../config/app-config';
import { IChartOnDemandService } from '../interfaces/chart-on-demand.interface';
import { IExportDataProvider } from '../interfaces/export-data-provider.interface';
import { IExportService } from '../interfaces/export-service.interface';
import { IFileService } from '../interfaces/file-service.interface';
import { IPermissionsService } from '../interfaces/permissions-service.interface';
import { IReportService } from '../interfaces/report-on-demand-service.interface';
import { OMatErrorOptions } from '../types/o-mat-error.type';
import { Util } from '../util/util';
import { AuthService } from './auth.service';
import { OntimizeAuthService } from './o-auth.service';
import { OErrorDialogManager } from './o-error-dialog-manager.service';
import { OntimizeExportDataProviderService3X } from './ontimize-export-data-provider-3x.service';
import { OntimizeExportDataProviderService } from './ontimize-export-data-provider.service';
import { OntimizeEEService } from './ontimize/ontimize-ee.service';
import { OntimizeExportService3X } from './ontimize/ontimize-export-3xx.service';
import { OntimizeExportService } from './ontimize/ontimize-export.service';
import { OntimizeFileService } from './ontimize/ontimize-file.service';
import { OntimizeService } from './ontimize/ontimize.service';
import { OntimizeEEPermissionsService } from './permissions/ontimize-ee-permissions.service';
import { OntimizePermissionsService } from './permissions/ontimize-permissions.service';
import { AbstractComponentStateService, DefaultComponentStateService } from './state/o-component-state.service';
import { JSONAPIService } from './jsonapi/jsonapi.service';

import { OntimizeQueryArgumentsAdapter } from './query-arguments/ontimize-query-arguments.adapter';
import { JSONAPIQueryArgumentsAdapter } from './query-arguments/jsonapi-query-arguments.adapter';
import { IBaseQueryArgument } from './query-arguments/base-query-argument.interface';
import { OntimizeServiceResponseAdapter } from './ontimize/ontimize-service-response.adapter';
import { IServiceResponseAdapter } from '../interfaces/service-response-adapter.interface';
import { BaseServiceResponse } from './base-service-response.class';
import { JSONAPIServiceResponseAdapter } from './jsonapi/jsonapi-service-response.adapter';
import { OntimizePreferencesService } from './ontimize/ontimize-preferences.service';
import { JSONAPIPreferencesService } from './jsonapi/jsonapi-preferences.service';
import { IPreferencesService } from '../interfaces/prefereces-service.interface';

/* ----------------------------------------------------------------------------------------------------
 * ----------------------------------------- INJECTION TOKENS -----------------------------------------
 * ---------------------------------------------------------------------------------------------------- */

/**
 * Injection token that can be used to replace the data service `OntimizeService` or `OntimizeEEService`.
 */
export const O_DATA_SERVICE = new InjectionToken('Ontimize data service');

/**
 * Injection token that can be used to replace the translate service `OTranslateService`.
 */
export const O_TRANSLATE_SERVICE = new InjectionToken('Translate service');

/**
 * Injection token that can be used to replace the file service `OntimizeFileService`.
 */
export const O_FILE_SERVICE = new InjectionToken<IFileService>('File uploader service');

/**
 * Injection token that can be used to replace the exportation service `OntimizeExportService`.
 */
export const O_EXPORT_SERVICE = new InjectionToken<IExportService>('Export service');

/**
 * Injection token that can be used to replace the permission service `OntimizePermissionsService or OntimizeEEPermissionsService`.
 */
export const O_PERMISSION_SERVICE = new InjectionToken<IPermissionsService>('Permission service');

/**
 * Injection token that can be used to replace the authentication service `AuthService`.
 */
export const O_AUTH_SERVICE = new InjectionToken<AuthService>('Authentication service');

/**
* Injection token that can be used to replace the component state service `DefaultComponentStateService`.
*/
export const O_COMPONENT_STATE_SERVICE = new InjectionToken<DefaultComponentStateService>('Component state service');


/**
* Injection token that can be used to replace the component state service `DefaultComponentStateService`.
*/
export const O_CHART_ON_DEMAND_SERVICE = new InjectionToken<IChartOnDemandService>('Chart on demand service');

export const O_REPORT_SERVICE = new InjectionToken<IReportService>('Report service');

export const O_ERROR_DIALOG_MANAGER = new InjectionToken<OErrorDialogManager>('Error dialog manager');

export const O_EXPORT_DATA_SERVICE = new InjectionToken<IExportDataProvider>('Export data provider');

export const O_MAT_ERROR_OPTIONS = new InjectionToken<OMatErrorOptions>('o-mat-error-options');

export const O_FORM_MESSAGE_SERVICE = new InjectionToken('Ontimize o-form message service');

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
  if (!Util.isDefined(config.serviceType) || 'OntimizeEE' === config.serviceType) {
    return new OntimizeEEService(injector);
  } else if ('Ontimize' === config.serviceType) {
    return new OntimizeService(injector);
  } else if ('JSONAPI' === config.serviceType) {
    return new JSONAPIService(injector);
  } else
    return Util.createServiceInstance(config.serviceType, injector);
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
export function serviceRequestAdapterFactory(injector: Injector): IBaseQueryArgument {
  const config = injector.get(AppConfig).getConfiguration();
  if (!Util.isDefined(config.serviceType) || ('OntimizeEE' === config.serviceType || 'Ontimize' === config.serviceType)) {
    return new OntimizeQueryArgumentsAdapter();
  } else if ('JSONAPI' === config.serviceType) {
    return new JSONAPIQueryArgumentsAdapter();
  }
  return new JSONAPIQueryArgumentsAdapter();
}

export function serviceResponseAdapterFactory(injector: Injector): IServiceResponseAdapter<BaseServiceResponse> {
  const config = injector.get(AppConfig).getConfiguration();
  if (!Util.isDefined(config.serviceType) || ('OntimizeEE' === config.serviceType || 'Ontimize' === config.serviceType)) {
    return new OntimizeServiceResponseAdapter();
  } else if ('JSONAPI' === config.serviceType) {
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

  if (!Util.isDefined(config.serviceType) || ('OntimizeEE' === config.serviceType || 'Ontimize' === config.serviceType)) {
    return new OntimizePreferencesService(injector);
  } else if ('JSONAPI' === config.serviceType) {
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

export const ServiceRequestAdapter = { provide: OntimizeQueryArgumentsAdapter, useFactory: serviceRequestAdapterFactory, deps: [Injector] };

export const ServiceResponseAdapter = { provide: OntimizeServiceResponseAdapter, useFactory: serviceResponseAdapterFactory, deps: [Injector] };
/* ----------------------------------------------------------------------------------------------------
 * ----------------------------------------- Utility methods ------------------------------------------
 * ---------------------------------------------------------------------------------------------------- */

/**
 * Returns the value for the provided injection token
 * @param token the injection token
 * @param injector the injector
 */
export function _getInjectionTokenValue<T>(token: InjectionToken<T>, injector: Injector): T {
  let service: T;
  try {
    service = injector.get(token);
  } catch (e) {
    // No value provided for the injection token
  }
  return service;
}




