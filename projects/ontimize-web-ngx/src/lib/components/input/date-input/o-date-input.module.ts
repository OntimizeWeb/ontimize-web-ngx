import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { ODateInputComponent } from './o-date-input.component';

@NgModule({
  declarations: [ODateInputComponent],
  imports: [CommonModule, OSharedModule],
  exports: [ODateInputComponent]
})
export class ODateInputModule { }
