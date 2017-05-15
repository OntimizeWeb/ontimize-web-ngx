import {
  NgModule,
  ModuleWithProviders,
  Injector
} from '@angular/core';

// import { ODialogComponent } from './ontimize/components/dialog/o-dialog.component';

import { ONTIMIZE_MODULES, ONTIMIZE_EXPORTS_MODULES } from './ontimize/config/o-modules';
import { ONTIMIZE_PROVIDERS } from './ontimize/config/o-providers';
// import { ONTIMIZE_DIRECTIVES } from './ontimize/config/o-directives';

// import { Config } from './ontimize/config/app-config';
// import { ontimizeProviders } from './ontimize/config/o-providers';

export * from './ontimize/config/app-config';
export * from './ontimize/config/o-providers';
export * from './ontimize/config/o-modules';
export * from './ontimize/MainLauncher';
export * from './ontimize/interfaces';
export * from './ontimize/pipes';
export * from './ontimize/services';
export * from './ontimize/decorators';
export * from './ontimize/components';
export * from './ontimize/utils';

// export class OntimizeProvidersFactory {
//   protected config: Config;
//   constructor(config: Config) {
//     this.config = config;
//   }
//   public factory(): any {
//     return ontimizeProviders({
//       config: this.config
//     });
//   }
// }

// export function ontimizeProvidersFactory(CONFIG: Config) {
//   return new ProvidersFactory(CONFIG).factory();
// }
import {
//   // APP_CONFIG,
  AppConfig
} from './ontimize/config/app-config';

@NgModule({
  imports: [
    ONTIMIZE_MODULES
  ],
  // declarations: [
  // ONTIMIZE_DIRECTIVES
  // ],
  // entryComponents: [
  //   ODialogComponent
  // ],
  exports: [
    ONTIMIZE_EXPORTS_MODULES,
    AppConfig
  ],
  providers: [
    // standardProviders
    //Custom
    ONTIMIZE_PROVIDERS
  ]
})
export class OntimizeWebModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OntimizeWebModule,
      providers: []
    };
  }
}
