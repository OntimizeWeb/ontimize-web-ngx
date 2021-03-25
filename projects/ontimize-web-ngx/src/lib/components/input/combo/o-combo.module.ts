import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { O_COMBO_RENDERERS } from './combo-renderer/combo-renderer';
import { OComboSearchComponent } from './combo-search/o-combo-search.component';
import { OComboComponent } from './o-combo.component';

@NgModule({
  declarations: [
    OComboComponent,
    OComboSearchComponent,
    ...O_COMBO_RENDERERS
  ],
  imports: [CommonModule, OSharedModule],
  exports: [
    OComboComponent,
    OComboSearchComponent,
    ...O_COMBO_RENDERERS
  ],
  entryComponents: [
    ...O_COMBO_RENDERERS
  ],
})
export class OComboModule { }
