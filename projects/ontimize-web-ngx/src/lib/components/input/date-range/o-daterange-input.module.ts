import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { ODateRangeInputComponent } from './o-daterange-input.component';

@NgModule({
  declarations: [ODateRangeInputComponent],
  imports: [CommonModule, OSharedModule],
  exports: [ODateRangeInputComponent]
})
export class ODateRangeInputModule { }
