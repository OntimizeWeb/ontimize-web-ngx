import { InjectionToken, Injector } from '@angular/core';

import { AppConfig } from '../config/app-config';
import { IExportService } from '../interfaces/export-service.interface';
import { IFileService } from '../interfaces/file-service.interface';
import { IPermissionsService } from '../interfaces/permissions-service.interface';
import { Util } from '../util/util';
import { AuthService } from './auth.service';
import { OntimizeAuthService } from './o-auth.service';
import { OntimizeEEService } from './ontimize/ontimize-ee.service';
import { OntimizeExportService } from './ontimize/ontimize-export.service';
import { OntimizeFileService } from './ontimize/ontimize-file.service';
import { OntimizeService } from './ontimize/ontimize.service';
import { OntimizeEEPermissionsService } from './permissions/ontimize-ee-permissions.service';
import { OntimizePermissionsService } from './permissions/ontimize-permissions.service';

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

/* ----------------------------------------------------------------------------------------------------
 * --------------------------------------------- FACTORIES --------------------------------------------
 * ---------------------------------------------------------------------------------------------------- */

/**
 * Creates a new instance of the data service.
 */
export function dataServiceFactory(injector: Injector): any {
  const serviceClass = _getInjectionTokenValue(O_DATA_SERVICE, injector);
  const service = _createServiceInstance(serviceClass, injector);
  if (Util.isDefined(service)) {
    return service;
  }
  const config = injector.get(AppConfig).getConfiguration();
  if (typeof (config.serviceType) === 'undefined') {
    return new OntimizeService(injector);
  } else if ('OntimizeEE' === config.serviceType) {
    return new OntimizeEEService(injector);
  }
  return _createServiceInstance(config.serviceType, injector);
}

/**
 * Creates a new instance of the file service.
 */
export function fileServiceFactory(injector: Injector): IFileService {
  const serviceClass = _getInjectionTokenValue(O_FILE_SERVICE, injector);
  const service = _createServiceInstance(serviceClass, injector);
  return Util.isDefined(service) ? service : new OntimizeFileService(injector);
}

/**
 * Creates a new instance of the exportation service.
 */
export function exportServiceFactory(injector: Injector): IExportService {
  const serviceClass = _getInjectionTokenValue(O_EXPORT_SERVICE, injector);
  const service = _createServiceInstance(serviceClass, injector);
  if (Util.isDefined(service)) {
    return service;
  }
  const config = injector.get(AppConfig).getConfiguration();
  if (typeof (config.exportServiceType) === 'undefined') {
    return new OntimizeExportService(injector);
  }
  return _createServiceInstance(config.exportServiceType, injector);
}

/**
 * Creates a new instance of the permission service.
 */
export function permissionsServiceFactory(injector: Injector): IPermissionsService {
  const serviceClass = _getInjectionTokenValue(O_PERMISSION_SERVICE, injector);
  const service = _createServiceInstance(serviceClass, injector);
  if (Util.isDefined(service)) {
    return service;
  }
  const config = injector.get(AppConfig).getConfiguration();
  if (!Util.isDefined(config.permissionsServiceType) || 'OntimizePermissions' === config.permissionsServiceType) {
    return new OntimizePermissionsService(injector);
  } else if ('OntimizeEEPermissions' === config.permissionsServiceType) {
    return new OntimizeEEPermissionsService(injector);
  }
  return _createServiceInstance(config.permissionsServiceType, injector);
}

/**
 * Creates a new instance of the authentication service.
 */
export function authServiceFactory(injector: Injector): AuthService {
  const serviceClass = _getInjectionTokenValue(O_AUTH_SERVICE, injector);
  const service = _createServiceInstance(serviceClass, injector);
  return Util.isDefined(service) ? service : new OntimizeAuthService(injector);
}

/* ----------------------------------------------------------------------------------------------------
 * -------------------------------------------- PROVIDERS ---------------------------------------------
 * ----------------------------------------------------------------------------------------------------
 * Using the same provider multiple times accross the project produces namespaces conflicts when
 * building with ng-packagr, so we reused the providers defined here.
 * ---------------------------------------------------------------------------------------------------- */

export let OntimizeServiceProvider = { provide: OntimizeService, useFactory: dataServiceFactory, deps: [Injector] };

export let OntimizeExportServiceProvider = { provide: OntimizeExportService, useFactory: exportServiceFactory, deps: [Injector] };

export const OntimizeAuthServiceProvider = { provide: AuthService, useFactory: authServiceFactory, deps: [Injector] };

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

/**
 * Returns an instance of the provided service class
 * @param clazz the class reference
 * @param injector the injector
 */
export function _createServiceInstance(clazz: any, injector: Injector) {
  if (!Util.isDefined(clazz)) {
    return;
  }
  const newInstance = Object.create(clazz.prototype);
  clazz.apply(newInstance, [injector]);
  return newInstance;
}
