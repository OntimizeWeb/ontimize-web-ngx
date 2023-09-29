import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { ORealInputModule } from '../real-input/o-real-input.module';
import { OCurrencyInputComponent } from './o-currency-input.component';

@NgModule({
  declarations: [OCurrencyInputComponent],
  imports: [CommonModule, OSharedModule, ORealInputModule],
  exports: [OCurrencyInputComponent]
})
export class OCurrencyInputModule { }
