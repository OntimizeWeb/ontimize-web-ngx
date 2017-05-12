import {
  NgModule,
  ModuleWithProviders
} from '@angular/core';

// import { MdIconRegistry } from '@angular/material';

// import {
//   LoginService,
//   NavigationService,
//   OntimizeService,
//   MomentService,
//   NumberService,
//   CurrencyService,
//   OTranslateService,
//   DialogService,
//   AuthGuardService,
//   authGuardServiceFactory,
//   dataServiceFactory,
//   LocalStorageService
// } from './ontimize/services';

// import { SERVICE_CONFIG } from './ontimize/services/data-service.provider';

// import { APP_CONFIG, AppConfig } from './ontimize/config/app-config';
// import { Events } from './ontimize/util/events';
// import { OHttp } from './ontimize/util/http/OHttp';


// import {
//   OSharedModule
// } from './ontimize/shared.module';


import { MdTooltipModule } from '@angular/material';

import { FormsModule } from '@angular/forms';

// import { DisabledComponentDirective } from './ontimize/directives/DisabledComponentDirective';
// import { OListItemDirective } from './ontimize/components/list/list-item/o-list-item.directive';
import { ODialogComponent } from './ontimize/components/dialog/o-dialog.component';

import { ONTIMIZE_MODULES } from './ontimize/config/o-modules';
// import { ONTIMIZE_DIRECTIVES } from './ontimize/config/o-directives';

import { Config } from './ontimize/config/app-config';
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


@NgModule({
  // imports: [
  //   OSharedModule,
  //   ONTIMIZE_MODULES
  // ]
  imports: [
    // MdTooltipModule,
    // FormsModule,
    ONTIMIZE_MODULES
  ],
  declarations: [
    // DisabledComponentDirective,
    // OListItemDirective,
    // ONTIMIZE_DIRECTIVES
  ],
  // entryComponents: [
  //   ODialogComponent
  // ],
  exports: [
    // DisabledComponentDirective,
    // OListItemDirective,
    // MdTooltipModule
  ]
})
export class OntimizeWebModule {
  // static forRoot(CONFIG: Config): ModuleWithProviders {
  //   return {
  //     ngModule: OntimizeWebModule,
  //     providers: [
  //     //   MdIconRegistry,

  //     //   // { provide: Events, useValue: events },
  //     //   { provide: APP_CONFIG, useValue: CONFIG },
  //     //   { provide: SERVICE_CONFIG, useValue: CONFIG['servicesConfiguration'] || {} }

  //     ]
  //   };
  // }
}
