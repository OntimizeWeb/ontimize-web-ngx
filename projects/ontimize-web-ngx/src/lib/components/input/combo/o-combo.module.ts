import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { OComboSearchComponent } from './combo-search/o-combo-search.component';
import { OComboComponent } from './o-combo.component';

@NgModule({
  declarations: [OComboComponent, OComboSearchComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OComboComponent, OComboSearchComponent]
})
export class OComboModule { }
