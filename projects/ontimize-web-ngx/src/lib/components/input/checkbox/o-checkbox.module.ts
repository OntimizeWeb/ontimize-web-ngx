import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { OCheckboxComponent } from './o-checkbox.component';

@NgModule({
  declarations: [OCheckboxComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OCheckboxComponent]
})
export class OCheckboxModule { }
