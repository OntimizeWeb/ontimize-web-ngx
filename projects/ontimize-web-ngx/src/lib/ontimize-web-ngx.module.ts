import { CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule } from '@angular/core';

import { APP_CONFIG } from './config/app-config';
import { INTERNAL_ONTIMIZE_MODULES, INTERNAL_ONTIMIZE_MODULES_EXPORTED } from './config/o-modules';
import { ONTIMIZE_PROVIDERS } from './config/o-providers';
import { ODialogComponent } from './shared/components/dialog/o-dialog.component';
import { OSnackBarComponent } from './shared/components/snackbar/o-snackbar.component';
import { Config } from './types/config.type';

@NgModule({
    declarations: [],
    imports: INTERNAL_ONTIMIZE_MODULES,
    exports: [INTERNAL_ONTIMIZE_MODULES_EXPORTED],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OntimizeWebModule {
  static forRoot(config: Config): ModuleWithProviders<OntimizeWebModule> {
    return {
      ngModule: OntimizeWebModule,
      providers: [
        ...ONTIMIZE_PROVIDERS,
        { provide: APP_CONFIG, useValue: config }
      ]
    };
  }
}
