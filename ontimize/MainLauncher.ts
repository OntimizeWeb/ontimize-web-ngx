import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModuleRef } from '@angular/core';

import { APP_CONFIG, Config } from './config/app-config';

import { OTranslateService } from './services';


export function ontimizeBootstrap(appModule: any, config?: any): Promise<NgModuleRef<any>> {

  var promise = platformBrowserDynamic().bootstrapModule(appModule);
  promise.then(moduleRef => {
    console.log('Bootstrap Successful');
    return ontimizePostBootstrap(moduleRef);
  }).catch(err => {
    console.error(err.message);
  });

  return promise;
}


export function ontimizePostBootstrap(ngModuleRef: NgModuleRef<any>): NgModuleRef<any> {
  // Configuring i18n...
  let translate: OTranslateService = ngModuleRef.injector.get(OTranslateService);
  let config: Config = ngModuleRef.injector.get(APP_CONFIG);
  configureI18n(config, translate);

  // Hiding loader...
  let loader = document.getElementById('loader-wrapper');
  if (loader) {
    loader.classList.add('loaded');
  }

  return ngModuleRef;
}


export function configureI18n(config: Config, translate: OTranslateService) {

  if (!translate) { return; }

  // not required as "en" is the default
  translate.setDefaultLang('en');

  var userLang = config['locale'];
  if (!userLang) {
    userLang = navigator.language.split('-')[0]; // use navigator lang if available
  }
  userLang = /(es|en)/gi.test(userLang) ? userLang : 'en';

  // this trigger the use of the spanish or english language after setting the translations
  translate.use(userLang);

}

