import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { ODateRangeInputComponent } from './o-daterange-input.component';
import { ODaterangepickerDirective } from './o-daterange-input.directive';
import { DaterangepickerComponent } from './o-daterange-picker.component';

@NgModule({
    declarations: [DaterangepickerComponent, ODateRangeInputComponent, ODaterangepickerDirective],
    imports: [CommonModule, OSharedModule],
    exports: [ODateRangeInputComponent]
})
export class ODateRangeInputModule { }
