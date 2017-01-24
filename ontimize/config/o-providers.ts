import { Injector } from '@angular/core';
import { BaseRequestOptions, XHRBackend } from '@angular/http';
import { MATERIAL_BROWSER_PROVIDERS } from '../components/material/ng2-material/index';

import { MdIconRegistry } from '@angular/material';

import {
  LoginService, NavigationService, OntimizeService, MomentService, NumberService, CurrencyService,
  OTranslateService, DialogService, AuthGuardService, authGuardServiceFactory, dataServiceFactory, LocalStorageService
} from '../services';
import { SERVICE_CONFIG } from '../services/data-service.provider';

import { APP_CONFIG, AppConfig } from '../config/app-config';
import { Events } from '../util/events';
import { OHttp } from '../util/http/OHttp';


const APP_HTTP_PROVIDERS = [
  XHRBackend,
  BaseRequestOptions,
  {
    provide: OHttp,
    useFactory: (backend, defaultOptions) => new OHttp(backend, defaultOptions),
    deps: [XHRBackend, BaseRequestOptions]
  }
];


/**
 * @private
 */
export function ontimizeProviders(args: any = {}): any {

  let events = new Events();
  bindEvents(window, document, events);

  var config = args.config;
  let appConfig = new AppConfig(config);
  config = appConfig.getConfiguration();
  let servicesConf = {};
  if (config.hasOwnProperty('servicesConfiguration')) {
    servicesConf = config['servicesConfiguration'];
  }

  return [
    //Standard
    MATERIAL_BROWSER_PROVIDERS,

    MdIconRegistry,

    { provide: Events, useValue: events },
    { provide: APP_CONFIG, useValue: config },
    { provide: SERVICE_CONFIG, useValue: servicesConf },

    //Custom
    getOntimizeServiceProvider(),
    LoginService,
    NavigationService,
    MomentService,
    CurrencyService,
    NumberService,
    DialogService,
    OTranslateService,
    LocalStorageService,
    getAuthServiceProvider()
  ];
}

function getOntimizeServiceProvider() {
  return [
    APP_HTTP_PROVIDERS,
    {
      provide: OntimizeService,
      useFactory: dataServiceFactory,
      deps: [Injector]
    },
  ];
}

function getAuthServiceProvider() {
  return {
    provide: AuthGuardService,
    useFactory: authGuardServiceFactory,
    deps: [Injector]
  };
}


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
