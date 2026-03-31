import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { OPhoneInputComponent } from './o-phone-input.component';

@NgModule({
	declarations: [OPhoneInputComponent],
	imports: [CommonModule, OSharedModule],
	exports: [OPhoneInputComponent],
})
export class OPhoneInputModule { }
