import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { OSharedModule } from '../../../shared/shared.module';
import { OHourInputComponent } from './o-hour-input.component';
import { OHourTimepickerDirective } from './o-hour-input.directive';

@NgModule({
  declarations: [OHourInputComponent, OHourTimepickerDirective],
  imports: [OSharedModule, CommonModule, NgxMaterialTimepickerModule],
  exports: [OHourInputComponent, OHourTimepickerDirective]
})
export class OHourInputModule { }
