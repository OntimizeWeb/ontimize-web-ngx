import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { OIntegerInputModule } from '../integer-input/o-integer-input.module';
import { ORealInputComponent } from './o-real-input.component';

@NgModule({
  declarations: [ORealInputComponent],
  imports: [CommonModule, OSharedModule, OIntegerInputModule],
  exports: [ORealInputComponent]
})
export class ORealInputModule { }
