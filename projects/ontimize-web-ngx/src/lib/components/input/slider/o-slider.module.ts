import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { OSliderComponent } from './o-slider.component';

@NgModule({
  declarations: [OSliderComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OSliderComponent]
})
export class OSliderModule { }
