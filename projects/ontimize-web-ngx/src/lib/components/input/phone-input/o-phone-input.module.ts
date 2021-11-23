import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { OTextInputModule } from '../text-input/o-text-input.module';
import { OPhoneInputComponent } from './o-phone-input.component';

@NgModule({
  declarations: [OPhoneInputComponent],
  imports: [OSharedModule, CommonModule, OTextInputModule],
  exports: [OPhoneInputComponent]
})
export class OPhoneInputModule {
}
