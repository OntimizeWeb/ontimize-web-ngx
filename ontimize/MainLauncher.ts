import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModuleRef } from '@angular/core';

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
  // Hiding loader...
  let loader = document.getElementById('loader-wrapper');
  if (loader) {
    loader.remove();
    // loader.classList.add('loaded');
  }
  return ngModuleRef;
}
