import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { ODateInputModule } from '../date-input/o-date-input.module';
import { OHourInputModule } from '../hour-input/o-hour-input.module';
import { OTimeInputComponent } from './o-time-input.component';

@NgModule({
  declarations: [OTimeInputComponent],
  imports: [CommonModule, ODateInputModule, OHourInputModule, OSharedModule],
  exports: [OTimeInputComponent]
})
export class OTimeInputModule { }
