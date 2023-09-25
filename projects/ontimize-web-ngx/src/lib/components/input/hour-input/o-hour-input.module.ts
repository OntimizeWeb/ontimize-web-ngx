import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { OSharedModule } from '../../../shared/shared.module';
import { OHourInputComponent } from './o-hour-input.component';

@NgModule({
  declarations: [OHourInputComponent],
  imports: [OSharedModule, CommonModule, NgxMaterialTimepickerModule],
  exports: [OHourInputComponent]
})
export class OHourInputModule { }
