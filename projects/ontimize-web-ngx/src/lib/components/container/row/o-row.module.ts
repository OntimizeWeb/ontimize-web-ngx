import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { ORowComponent } from './o-row.component';

@NgModule({
  declarations: [ORowComponent],
  imports: [CommonModule, OSharedModule],
  exports: [ORowComponent]
})
export class ORowModule { }
