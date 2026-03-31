import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { OTextInputModule } from '../text-input/o-text-input.module';
import { OPasswordInputComponent } from './o-password-input.component';

@NgModule({
  declarations: [OPasswordInputComponent],
  imports: [OSharedModule, CommonModule, OTextInputModule],
  exports: [OPasswordInputComponent]
})
export class OPasswordInputModule {
}
