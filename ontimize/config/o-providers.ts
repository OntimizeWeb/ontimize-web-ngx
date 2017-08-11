import {
  //   APP_INITIALIZER,
  //   InjectionToken,
  Injector
} from '@angular/core';
import { LOCATION_INITIALIZED } from '@angular/common';
import { BaseRequestOptions, XHRBackend } from '@angular/http';
import { MdIconRegistry } from '@angular/material';

import {
  LoginService,
  NavigationService,
  OntimizeService,
  MomentService,
  NumberService,
  CurrencyService,
  OTranslateService,
  DialogService,
  AuthGuardService,
  authGuardServiceFactory,
  dataServiceFactory,
  LocalStorageService,
  appConfigFactory,
  AppMenuService,
  OUserInfoService,
  OModulesInfoService
} from '../services';

import { Events } from '../util/events';
import { OHttp } from '../util/http/OHttp';
import {
  AppConfig,
  Config
} from '../config/app-config';


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
  });
}

/**
 * Bind some global events and publish on the 'app' channel
 */
export function bindEvents(window, document) {
  const events = new Events();
  function publishEventWrapper(channel): Function {
    return function (ev) {
      events.publish(channel, ev);
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
  return bindEvents(window, document);
}


export function getOntimizeServiceProvider(backend, defaultOptions) {
  return new OHttp(backend, defaultOptions);
}

export function getLoginServiceProvider(injector) {
  return new LoginService(injector);
}

export function getNavigationServiceProvider(injector) {
  return new NavigationService(injector);
}

export function getMomentServiceProvider(injector) {
  return new MomentService(injector);
}

export function getCurrencyServiceProvider(injector) {
  return new CurrencyService(injector);
}

export function getNumberServiceProvider(injector) {
  return new NumberService(injector);
}

export function getDialogServiceProvider(injector) {
  return new DialogService(injector);
}

export function getTranslateServiceProvider(injector) {
  return new OTranslateService(injector);
}

export function getLocalStorageServiceProvider(injector) {
  return new LocalStorageService(injector);
}

export function getAppMenuServiceProvider(injector) {
  return new AppMenuService(injector);
}

export function getOUserInfoServiceProvider(injector) {
  return new OUserInfoService(injector);
}

export function getOModulesInfoServiceProvider(injector) {
  return new OModulesInfoService(injector);
}

export const ONTIMIZE_PROVIDERS = [
  //Standard
  MdIconRegistry,

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
  }
];
