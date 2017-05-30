import { Injector } from '@angular/core';
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
  LocalStorageService
} from '../services';

import {
  APP_CONFIG,
  AppConfig
} from '../config/app-config';
import { SERVICE_CONFIG } from '../services/data-service.provider';

import { Events } from '../util/events';
import { OHttp } from '../util/http/OHttp';

const events = new Events();
bindEvents(window, document, events);

/**
 * Bind some global events and publish on the 'app' channel
 */
function bindEvents(window, document, events) {
  window.addEventListener('online', (ev) => {
    console.log('app online');
    events.publish('app:online', ev);
  }, false);

  window.addEventListener('offline', (ev) => {
    console.log('app offline');
    events.publish('app:offline', ev);
  }, false);

  window.addEventListener('orientationchange', (ev) => {
    events.publish('app:rotated', ev);
  });

  // When that status taps, we respond
  window.addEventListener('statusTap', (ev) => {
    events.publish('app:statusTap', ev);
  });

  // start listening for resizes XXms after the app starts
  setTimeout(function () {
    window.addEventListener('resize', function (ev) {
      events.publish('app:resize', ev);
    });
  }, 2000);
}

export const ONTIMIZE_PROVIDERS: any = [
  //Standard
  MdIconRegistry,

  { provide: Events, useValue: events },
  // This two dependencies are now loaded in OntimizeWebModule.forRoot method
  // { provide: APP_CONFIG, useValue: config },
  // { provide: SERVICE_CONFIG, useValue: servicesConf },

  // getOntimizeServiceProvider
  XHRBackend,
  BaseRequestOptions,
  {
    provide: OHttp,
    useFactory: (backend, defaultOptions) => new OHttp(backend, defaultOptions),
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
    useFactory: (injector) => new LoginService(injector),
    deps: [Injector]
  },
  //getNavigationServiceProvider
  {
    provide: NavigationService,
    useFactory: (injector) => new NavigationService(injector),
    deps: [Injector]
  },
  // getMomentServiceProvider
  {
    provide: MomentService,
    useFactory: (injector) => new MomentService(injector),
    deps: [Injector]
  },
  // getCurrencyServiceProvider
  {
    provide: CurrencyService,
    useFactory: (injector) => new CurrencyService(injector),
    deps: [Injector]
  },
  //getNumberServiceProvider
  {
    provide: NumberService,
    useFactory: (injector) => new NumberService(injector),
    deps: [Injector]
  },
  // getDialogServiceProvider
  {
    provide: DialogService,
    useFactory: (injector) => new DialogService(injector),
    deps: [Injector]
  },
  // getTranslateServiceProvider
  {
    provide: OTranslateService,
    useFactory: (injector) => new OTranslateService(injector),
    deps: [Injector]
  },
  // getLocalStorageServiceProvider
  {
    provide: LocalStorageService,
    useFactory: (injector) => new LocalStorageService(injector),
    deps: [Injector]
  },
  // getAuthServiceProvider
  {
    provide: AuthGuardService,
    useFactory: authGuardServiceFactory,
    deps: [Injector]
  }
];

