import { Injector } from '@angular/core';
import { LOCATION_INITIALIZED } from '@angular/common';
import { BaseRequestOptions, XHRBackend } from '@angular/http';
import { MatIconRegistry } from '@angular/material';
import { Events } from '../util/events';
import { OHttp } from '../util/http/OHttp';
import { AppConfig, Config } from '../config/app-config';

import {
  LoginService,
  NavigationService,
  OntimizeService,
  OntimizeFileService,
  OntimizeExportService,
  MomentService,
  NumberService,
  CurrencyService,
  OTranslateService,
  DialogService,
  SnackBarService,
  AuthGuardService,
  authGuardServiceFactory,
  dataServiceFactory,
  LocalStorageService,
  appConfigFactory,
  AppMenuService,
  OUserInfoService,
  OModulesInfoService,
  OntimizeServiceResponseParser
} from '../services';

import { OFormLayoutManagerService } from '../services/o-form-layout-manager.service';

export function appInitializerFactory(injector: Injector, config: Config, oTranslate: OTranslateService) {
  return () => new Promise<any>((resolve: any) => {
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

      oTranslate.setAppLang(userLang).subscribe(resolve, resolve, resolve);
    });

    injector.get(NavigationService).initialize();
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

export const ONTIMIZE_PROVIDERS = [
  //Standard
  MatIconRegistry,

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
  // getAuthServiceProvider
  {
    provide: AuthGuardService,
    useFactory: authGuardServiceFactory,
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
  }
];
