import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { OTextInputComponent } from './o-text-input.component';

@NgModule({
  declarations: [OTextInputComponent],
  imports: [OSharedModule, CommonModule],
  exports: [OTextInputComponent]
})
export class OTextInputModule {
}
