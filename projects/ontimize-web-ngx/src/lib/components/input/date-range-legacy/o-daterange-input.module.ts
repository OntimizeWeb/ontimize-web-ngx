import { NgModule } from '@angular/core';

import { ODateRangeLegacyInputComponent } from './o-daterange-input.component';
import { ODaterangepickerDirective } from './o-daterange-input.directive';
import { DaterangepickerComponent } from './o-daterange-picker.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
    imports: [DaterangepickerComponent, ODateRangeLegacyInputComponent, ODaterangepickerDirective],
    exports: [ODateRangeLegacyInputComponent]
})
export class ODateRangeLegacyInputModule { }
