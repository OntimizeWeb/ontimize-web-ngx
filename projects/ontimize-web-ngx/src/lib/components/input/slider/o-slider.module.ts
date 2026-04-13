import { NgModule } from '@angular/core';

import { OSliderComponent } from './o-slider.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OSliderComponent],
  exports: [OSliderComponent]
})
export class OSliderModule { }
