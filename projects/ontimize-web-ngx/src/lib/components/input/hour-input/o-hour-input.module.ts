import { NgModule } from '@angular/core';

import { OHourInputComponent } from './o-hour-input.component';
import { OHourTimepickerDirective } from './o-hour-input.directive';

@NgModule({
  imports: [OHourInputComponent, OHourTimepickerDirective],
  exports: [OHourInputComponent, OHourTimepickerDirective]
})
export class OHourInputModule { }
