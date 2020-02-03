import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../shared/shared.module';
import { OFilterBuilderClearDirective } from './o-filter-builder-clear.directive';
import { OFilterBuilderQueryDirective } from './o-filter-builder-query.directive';
import { OFilterBuilderComponent } from './o-filter-builder.component';

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
