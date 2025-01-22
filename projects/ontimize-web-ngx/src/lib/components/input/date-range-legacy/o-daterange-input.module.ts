import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { ODateRangeLegacyInputComponent } from './o-daterange-input.component';
import { ODaterangepickerDirective } from './o-daterange-input.directive';
import { DaterangepickerComponent } from './o-daterange-picker.component';

@NgModule({
    declarations: [DaterangepickerComponent, ODateRangeLegacyInputComponent, ODaterangepickerDirective],
    imports: [CommonModule, OSharedModule],
    exports: [ODateRangeLegacyInputComponent]
})
export class ODateRangeLegacyInputModule { }
