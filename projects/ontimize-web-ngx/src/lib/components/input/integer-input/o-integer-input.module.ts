import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { OTextInputModule } from '../text-input/o-text-input.module';
import { OIntegerInputComponent } from './o-integer-input.component';

@NgModule({
  declarations: [OIntegerInputComponent],
  imports: [CommonModule, OSharedModule, OTextInputModule],
  exports: [OIntegerInputComponent]
})
export class OIntegerInputModule { }
