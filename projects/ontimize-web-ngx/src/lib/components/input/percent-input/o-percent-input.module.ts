import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { ORealInputModule } from '../real-input/o-real-input.module';
import { OPercentInputComponent } from './o-percent-input.component';

@NgModule({
  declarations: [OPercentInputComponent],
  imports: [CommonModule, OSharedModule, ORealInputModule],
  exports: [OPercentInputComponent]
})
export class OPercentInputModule { }
