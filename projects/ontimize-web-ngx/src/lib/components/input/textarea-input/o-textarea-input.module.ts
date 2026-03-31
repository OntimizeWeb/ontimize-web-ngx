import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { OTextareaInputComponent } from './o-textarea-input.component';

@NgModule({
  declarations: [OTextareaInputComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OTextareaInputComponent]
})
export class OTextareaInputModule { }
