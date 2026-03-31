import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { OSearchInputComponent } from './o-search-input.component';

@NgModule({
  declarations: [OSearchInputComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OSearchInputComponent]
})
export class OSearchInputModule { }
