import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { OSlideToggleComponent } from './o-slide-toggle.component';

@NgModule({
  declarations: [OSlideToggleComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OSlideToggleComponent]
})
export class OSlideToggleModule { }
