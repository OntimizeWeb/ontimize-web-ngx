import { OSharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { OFilterBuilderClearDirective } from './o-filter-builder-clear.directive';
import { OFilterBuilderQueryDirective } from './o-filter-builder-query.directive';
import { OFilterBuilderComponent } from './o-filter-builder.component';

import { NgModule } from '@angular/core';

@NgModule({
  imports: [
    OSharedModule,
    CommonModule
  ],
  declarations: [
    OFilterBuilderComponent,
    OFilterBuilderClearDirective,
    OFilterBuilderQueryDirective
  ],
  exports: [
    OFilterBuilderComponent,
    OFilterBuilderClearDirective,
    OFilterBuilderQueryDirective
  ]
})
export class OFilterBuilderModule { }
