import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { OTextInputModule } from '../text-input/o-text-input.module';
import { ONIFInputComponent } from './o-nif-input.component';

@NgModule({
  declarations: [ONIFInputComponent],
  imports: [OSharedModule, CommonModule, OTextInputModule],
  exports: [ONIFInputComponent]
})
export class ONIFInputModule {
}
