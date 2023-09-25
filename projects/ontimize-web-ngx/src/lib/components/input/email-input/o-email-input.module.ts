import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { OTextInputModule } from '../text-input/o-text-input.module';
import { OEmailInputComponent } from './o-email-input.component';

@NgModule({
  declarations: [OEmailInputComponent],
  imports: [OSharedModule, CommonModule, OTextInputModule],
  exports: [OEmailInputComponent]
})
export class OEmailInputModule {
}
