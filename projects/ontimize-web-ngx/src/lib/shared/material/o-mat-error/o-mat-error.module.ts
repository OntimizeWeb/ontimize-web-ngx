import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule, MatTooltipModule } from '@angular/material';

import { OMatErrorComponent } from './o-mat-error';

@NgModule({
  declarations: [OMatErrorComponent],
  imports: [MatTooltipModule, MatFormFieldModule, CommonModule],
  exports: [OMatErrorComponent]
})
export class OMatErrorModule {
}
