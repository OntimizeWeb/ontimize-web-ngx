import { NgModule } from '@angular/core';

import { OHourInputComponent } from './o-hour-input.component';
import { OHourTimepickerDirective } from './o-hour-input.directive';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OHourInputComponent, OHourTimepickerDirective],
  exports: [OHourInputComponent, OHourTimepickerDirective]
})
export class OHourInputModule { }
