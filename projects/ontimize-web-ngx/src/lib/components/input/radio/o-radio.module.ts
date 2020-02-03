import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { ORadioComponent } from './o-radio.component';

@NgModule({
  declarations: [ORadioComponent],
  imports: [CommonModule, OSharedModule],
  exports: [ORadioComponent]
})
export class ORadioModule { }
