import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../shared/shared.module';
import { OFilterBuilderClearDirective } from './o-filter-builder-clear.directive';
import { OFilterBuilderQueryDirective } from './o-filter-builder-query.directive';
import { OFilterBuilderComponent } from './o-filter-builder.component';
import { OFilterBuilderComponentStateService } from '../../services/state/o-filter-builder-component-state.service';
import { OFilterBuilderMenuComponent } from './filter-builder-menu/filter-builder-menu.component';

@NgModule({
  imports: [
    OSharedModule,
    CommonModule
  ],
  declarations: [
    OFilterBuilderComponent,
    OFilterBuilderClearDirective,
    OFilterBuilderQueryDirective,
    OFilterBuilderMenuComponent
  ],
  exports: [
    OFilterBuilderComponent,
    OFilterBuilderClearDirective,
    OFilterBuilderQueryDirective,
    OFilterBuilderMenuComponent
  ],
  providers: [
    OFilterBuilderComponentStateService
  ]
})
export class OFilterBuilderModule { }
