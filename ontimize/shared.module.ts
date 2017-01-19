import {
  NgModule,
  ModuleWithProviders
} from '@angular/core';

import { MdTooltipModule } from '@angular/material';

import { DisabledComponentDirective } from './directives/DisabledComponentDirective';
import { OListItemDirective } from './components/list/o-list-item.directive';

@NgModule({
  declarations: [DisabledComponentDirective, OListItemDirective],
  imports: [MdTooltipModule],
  exports: [DisabledComponentDirective, OListItemDirective, MdTooltipModule]
})
export class OSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OSharedModule,
      providers: []
    };
  }
}
