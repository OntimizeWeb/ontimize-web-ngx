import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../shared/shared.module';
import { OButtonComponent } from './o-button.component';

@NgModule({
  declarations: [OButtonComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OButtonComponent]
})
export class OButtonModule { }
