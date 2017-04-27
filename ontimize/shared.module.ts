import {
  NgModule,
  ModuleWithProviders
} from '@angular/core';

import { MdTooltipModule } from '@angular/material';

import { DisabledComponentDirective } from './directives/DisabledComponentDirective';
import { OListItemDirective } from './components/list/list-item/o-list-item.directive';
import { ODialogComponent } from './components/dialog/o-dialog.component';

import { OrderByPipe } from './pipes';
import { ONTIMIZE_DIRECTIVES } from './config/o-directives';

@NgModule({
  declarations: [
    DisabledComponentDirective,
    OListItemDirective,
    OrderByPipe,
    ONTIMIZE_DIRECTIVES
  ],
  imports: [
    MdTooltipModule
  ],
  entryComponents: [
    ODialogComponent
  ],
  exports: [
    DisabledComponentDirective,
    OListItemDirective,
    MdTooltipModule
  ]
})
export class OSharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: OSharedModule,
      providers: []
    };
  }
}
