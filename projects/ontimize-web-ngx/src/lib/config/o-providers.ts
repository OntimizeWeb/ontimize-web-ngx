import { LOCATION_INITIALIZED } from '@angular/common';
import { Injector, Provider } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';

import { AppConfig, O_INPUTS_OPTIONS } from '../config/app-config';
import { appConfigFactory } from '../services/app-config.provider';
import { ComponentStateServiceProvider, ExportDataServiceProvider, OntimizeAuthServiceProvider, OntimizeExportServiceProvider, OntimizeServiceProvider } from '../services/factories';
import { LocalStorageService } from '../services/local-storage.service';
import { NavigationService } from '../services/navigation.service';
import { OntimizeMatIconRegistry } from '../services/ontimize-icon-registry.service';
import { OntimizeServiceResponseAdapter } from '../services/ontimize/ontimize-service-response.adapter';
import { ORemoteConfigurationService } from '../services/remote-config.service';
import { OTranslateService } from '../services/translate/o-translate.service';
import { Error403Component } from '../shared/components/error403/o-error-403.component';
import { O_MAT_ERROR_OPTIONS } from '../shared/material/o-mat-error/o-mat-error';
import { Config } from '../types/config.type';
import { Codes } from '../util/codes';
import { Util } from '../util/util';

function addPermissionsRouteGuard(injector: Injector) {
  const route = injector.get(Router);
  const exists403 = route.config.find(r => r.path === Codes.FORBIDDEN_ROUTE);
  if (!exists403) {
    route.config.push({ path: Codes.FORBIDDEN_ROUTE, component: Error403Component });
  }
}

export function appInitializerFactory(injector: Injector, config: Config, oTranslate: OTranslateService) {
  return () => new Promise<any>((resolve: any) => {
    const observableArray = [];
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      const storedLang = oTranslate.getStoredLanguage();
      const configLang = config['locale'];
      const browserLang = oTranslate.getBrowserLang();
      let userLang = Util.isDefined(config['defaultLocale']) ? config['defaultLocale'] : 'en';
      let defaultLang = Util.isDefined(config['defaultLocale']) ? config['defaultLocale'] : 'en';
      if (storedLang) {
        userLang = storedLang;
      } else if (configLang) {
        userLang = configLang;
        defaultLang = configLang;
      } else if (browserLang) {
        userLang = browserLang;
        defaultLang = browserLang;
      }
      oTranslate.setDefaultLang(defaultLang);

      const locales = new Set(config.applicationLocales || []);
      locales.add('en');
      locales.add(userLang);

      // initialize available locales array if needed
      if (!config.applicationLocales) {
        config.applicationLocales = [...locales];
      }

      if (config.uuid == null || config.uuid === '') {
        console.error('Your app must have an \'uuid\' property defined on your app.config file. Otherwise, your application will not work correctly.');
        alert('Your app must have an \'uuid\' property defined on your app.config file. Otherwise, your application will not work correctly.');
      }
      injector.get(NavigationService).initialize();
      injector.get(OntimizeMatIconRegistry).initialize();
      injector.get(LocalStorageService).setBackwardCompatibility();
      addPermissionsRouteGuard(injector);
      observableArray.push(oTranslate.setAppLang(userLang));
      const remoteConfigService = injector.get(ORemoteConfigurationService);
      observableArray.push(remoteConfigService.initialize());
      combineLatest(observableArray).subscribe(() => {
        resolve();
      });
    });
  });
}

export const ONTIMIZE_PROVIDERS: Provider[] = [
  { provide: AppConfig, useFactory: appConfigFactory, deps: [Injector] },
  OntimizeServiceProvider,
  OntimizeServiceResponseAdapter,
  OntimizeAuthServiceProvider,
  ComponentStateServiceProvider,
  ExportDataServiceProvider,
  OntimizeExportServiceProvider,
  // disabled global ripple
  { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } },
  { provide: O_MAT_ERROR_OPTIONS, useValue: {} },
  { provide: O_INPUTS_OPTIONS, useValue: {} }
];
