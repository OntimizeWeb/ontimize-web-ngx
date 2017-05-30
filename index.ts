import {
  NgModule,
  ModuleWithProviders
} from '@angular/core';

import {
  ONTIMIZE_EXPORTS_MODULES,
  ONTIMIZE_MODULES
} from './ontimize/config/o-modules';

import {
  ONTIMIZE_PROVIDERS
} from './ontimize/config/o-providers';

export * from './ontimize/config/app-config';
export * from './ontimize/MainLauncher';
export * from './ontimize/pipes';
export * from './ontimize/services';
export * from './ontimize/decorators';
export * from './ontimize/components';
export * from './ontimize/utils';
export * from './ontimize/shared';

import { ODialogComponent } from './ontimize/components';

import {
  APP_CONFIG,
  AppConfig
} from './ontimize/config/app-config';


import { SERVICE_CONFIG } from './ontimize/services/data-service.provider';

@NgModule({
  imports: ONTIMIZE_MODULES,
  exports: ONTIMIZE_EXPORTS_MODULES,
  entryComponents: [
    ODialogComponent
  ]
})
export class OntimizeWebModule {
  static forRoot(args : any = {}): ModuleWithProviders {

    let appConfig = new AppConfig(args.config);
    var config = appConfig.getConfiguration();
    let servicesConf = {};
    if (config.hasOwnProperty('servicesConfiguration')) {
      servicesConf = config['servicesConfiguration'];
    }

    return {
      ngModule: OntimizeWebModule,
      providers: [
        { provide: APP_CONFIG, useValue: config },
        { provide: SERVICE_CONFIG, useValue: servicesConf },
        ONTIMIZE_PROVIDERS
      ]
    };
  }
}
