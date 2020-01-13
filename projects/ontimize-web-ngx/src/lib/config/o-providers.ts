import { LOCATION_INITIALIZED } from '@angular/common';
import { Injector, Provider } from '@angular/core';
import { BaseRequestOptions, XHRBackend } from '@angular/http';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { OContextMenuService } from '../components/contextmenu/o-context-menu.service';
import { AppConfig, Config } from '../config/app-config';
import { appConfigFactory, AppMenuService, AuthGuardService, CurrencyService, dataServiceFactory, DialogService, LocalStorageService, LoginService, MomentService, NavigationService, NumberService, OModulesInfoService, OntimizeExportService, OntimizeFileService, OntimizeMatIconRegistry, OntimizeService, OntimizeServiceResponseParser, OTranslateService, OUserInfoService, SnackBarService } from '../services';
import { OFormLayoutManagerService } from '../services/o-form-layout-manager.service';
import { Error403Component } from '../services/permissions/error403/o-error-403.component';
import { ORemoteConfigurationService } from '../services/remote-config.service';
import { ShareCanActivateChildService } from '../services/share-can-activate-child.service';
import { Codes } from '../util/codes';
import { Events } from '../util/events';
import { OHttp } from '../util/http/OHttp';

function addPermissionsRouteGuard(injector: Injector) {
  const route = injector.get(Router);
  const exists403 = route.config.find(route => route.path === Codes.FORBIDDEN_ROUTE);
  if (!exists403) {
    route.config.push({ path: Codes.FORBIDDEN_ROUTE, component: Error403Component });
  }
}


export function appInitializerFactory(injector: Injector, config: Config, oTranslate: OTranslateService) {
  return () => new Promise<any>((resolve: any) => {
    let observableArray = [];
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      oTranslate.setDefaultLang('en');
      let userLang = config['locale'];
      if (!userLang) {
        // use navigator lang if available
        userLang = oTranslate.getBrowserLang();
      }

      // initialize available locales array if needed
      if (!config.applicationLocales) {
        config.applicationLocales = [];
      }
      if (config.applicationLocales.indexOf('en') === -1) {
        config.applicationLocales.push('en');
      }
      if (userLang && config.applicationLocales.indexOf(userLang) === -1) {
        config.applicationLocales.push(userLang);
      }
      if (config['uuid'] === undefined || config['uuid'] === null || config['uuid'] === '') {
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

/**
 * Bind some global events and publish on the 'app' channel
 */
export function bindEvents(window: Window) {
  const events = new Events();
  function publishEventWrapper(channel: string): EventListenerObject {
    return {
      handleEvent: function (ev: Event) {
        events.publish(channel, ev);
      }
    };
  }
  window.addEventListener('online', publishEventWrapper('app:online'), false);
  window.addEventListener('offline', publishEventWrapper('app:offline'), false);
  window.addEventListener('orientationchange', publishEventWrapper('app:rotated'));
  // When that status taps, we respond
  window.addEventListener('statusTap', publishEventWrapper('app:statusTap'));
  // start listening for resizes XXms after the app starts
  setTimeout(function () {
    window.addEventListener('resize', publishEventWrapper('app:resize'));
  }, 2000);
  return events;
}

export function getEvents() {
  return bindEvents(window);
}

export function getOntimizeServiceProvider(backend: XHRBackend, defaultOptions: BaseRequestOptions) {
  return new OHttp(backend, defaultOptions);
}

export function getOntimizeFileServiceProvider(injector: Injector) {
  return new OntimizeFileService(injector);
}

export function getOntimizeExportServiceProvider(injector: Injector) {
  return new OntimizeExportService(injector);
}

export function getLoginServiceProvider(injector: Injector) {
  return new LoginService(injector);
}

export function getNavigationServiceProvider(injector: Injector) {
  return new NavigationService(injector);
}

export function getMomentServiceProvider(injector: Injector) {
  return new MomentService(injector);
}

export function getCurrencyServiceProvider(injector: Injector) {
  return new CurrencyService(injector);
}

export function getNumberServiceProvider(injector: Injector) {
  return new NumberService(injector);
}

export function getDialogServiceProvider(injector: Injector) {
  return new DialogService(injector);
}

export function getSnackBarServiceProvider(injector: Injector) {
  return new SnackBarService(injector);
}

export function getTranslateServiceProvider(injector: Injector) {
  return new OTranslateService(injector);
}

export function getLocalStorageServiceProvider(injector: Injector) {
  return new LocalStorageService(injector);
}

export function getAppMenuServiceProvider(injector: Injector) {
  return new AppMenuService(injector);
}

export function getOUserInfoServiceProvider(injector: Injector) {
  return new OUserInfoService(injector);
}

export function getOModulesInfoServiceProvider(injector: Injector) {
  return new OModulesInfoService(injector);
}

export function getOntimizeServiceResponseParser(injector: Injector) {
  return new OntimizeServiceResponseParser(injector);
}

export function getORemoteConfigurationService(injector: Injector): ORemoteConfigurationService {
  return new ORemoteConfigurationService(injector);
}

export const ONTIMIZE_PROVIDERS: Provider[] = [

  { provide: Events, useValue: getEvents },

  {
    provide: AppConfig,
    useFactory: appConfigFactory,
    deps: [Injector]
  },
  // getOntimizeServiceProvider
  XHRBackend,
  BaseRequestOptions,
  {
    provide: OHttp,
    useFactory: getOntimizeServiceProvider,
    deps: [XHRBackend, BaseRequestOptions]
  },
  {
    provide: OntimizeService,
    useFactory: dataServiceFactory,
    deps: [Injector]
  },
  {
    provide: OntimizeServiceResponseParser,
    useFactory: getOntimizeServiceResponseParser,
    deps: [Injector]
  },
  {
    provide: OntimizeFileService,
    useFactory: getOntimizeFileServiceProvider,
    deps: [Injector]
  },
  {
    provide: OntimizeExportService,
    useFactory: getOntimizeExportServiceProvider,
    deps: [Injector]
  },
  // getLoginServiceProvider
  {
    provide: LoginService,
    useFactory: getLoginServiceProvider,
    deps: [Injector]
  },
  //getNavigationServiceProvider
  {
    provide: NavigationService,
    useFactory: getNavigationServiceProvider,
    deps: [Injector]
  },
  // getMomentServiceProvider
  {
    provide: MomentService,
    useFactory: getMomentServiceProvider,
    deps: [Injector]
  },
  // getCurrencyServiceProvider
  {
    provide: CurrencyService,
    useFactory: getCurrencyServiceProvider,
    deps: [Injector]
  },
  //getNumberServiceProvider
  {
    provide: NumberService,
    useFactory: getNumberServiceProvider,
    deps: [Injector]
  },
  // getDialogServiceProvider
  {
    provide: DialogService,
    useFactory: getDialogServiceProvider,
    deps: [Injector]
  },
  // getSnackbarServiceProvider
  {
    provide: SnackBarService,
    useFactory: getSnackBarServiceProvider,
    deps: [Injector]
  },
  // getTranslateServiceProvider
  {
    provide: OTranslateService,
    useFactory: getTranslateServiceProvider,
    deps: [Injector]
  },
  // getLocalStorageServiceProvider
  {
    provide: LocalStorageService,
    useFactory: getLocalStorageServiceProvider,
    deps: [Injector]
  },
  {
    provide: AuthGuardService,
    useClass: AuthGuardService,
    deps: [Injector]
  },
  {
    provide: AppMenuService,
    useFactory: getAppMenuServiceProvider,
    deps: [Injector]
  },
  {
    provide: OUserInfoService,
    useFactory: getOUserInfoServiceProvider,
    deps: [Injector]
  },
  {
    provide: OModulesInfoService,
    useFactory: getOModulesInfoServiceProvider,
    deps: [Injector]
  },
  {
    provide: OFormLayoutManagerService,
    useClass: OFormLayoutManagerService
  },
  {
    provide: OContextMenuService,
    useClass: OContextMenuService
  },
  {
    provide: ShareCanActivateChildService,
    useClass: ShareCanActivateChildService
  },
  {
    provide: ORemoteConfigurationService,
    useFactory: getORemoteConfigurationService,
    deps: [Injector]
  },
  // disabled global ripple
  { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } }
];
