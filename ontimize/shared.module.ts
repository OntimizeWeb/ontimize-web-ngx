import {
  NgModule,
  ModuleWithProviders
} from '@angular/core';

import { DisabledComponentDirective } from './directives/DisabledComponentDirective';
import { OListItemDirective } from './components/list/o-list-item.directive';

@NgModule({
  declarations: [DisabledComponentDirective, OListItemDirective],
  exports: [DisabledComponentDirective, OListItemDirective],
})
export class OSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OSharedModule,
      providers: []
    };
  }
}
