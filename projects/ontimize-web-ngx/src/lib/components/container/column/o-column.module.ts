import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { OColumnComponent } from './o-column.component';

@NgModule({
  declarations: [OColumnComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OColumnComponent]
})
export class OColumnModule { }
