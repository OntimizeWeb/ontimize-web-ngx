import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../shared/shared.module';
import { OFilterBuilderClearDirective } from './o-filter-builder-clear.directive';
import { OFilterBuilderQueryDirective } from './o-filter-builder-query.directive';
import { OFilterBuilderComponent } from './o-filter-builder.component';
import { OFilterBuilderQueryButtonComponent } from './filter-builder-query-button/filter-builder-query-button.component';

@NgModule({
  imports: [
    OSharedModule,
    CommonModule
  ],
  declarations: [
    OFilterBuilderComponent,
    OFilterBuilderClearDirective,
    OFilterBuilderQueryDirective,
    OFilterBuilderQueryButtonComponent
  ],
  exports: [
    OFilterBuilderComponent,
    OFilterBuilderClearDirective,
    OFilterBuilderQueryDirective,
    OFilterBuilderQueryButtonComponent
  ]
})
export class OFilterBuilderModule { }
