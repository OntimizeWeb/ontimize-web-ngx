import {
  NgModule,
  ModuleWithProviders,
} from '@angular/core';

import { DisabledComponentDirective } from './directives/DisabledComponentDirective';

@NgModule({
  declarations: [DisabledComponentDirective],
  exports: [DisabledComponentDirective],
})
export class OSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OSharedModule,
      providers: []
    };
  }
}
