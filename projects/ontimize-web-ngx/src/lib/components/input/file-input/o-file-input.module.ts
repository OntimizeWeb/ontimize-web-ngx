import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../../shared/shared.module';
import { OFileInputComponent } from './o-file-input.component';

@NgModule({
  declarations: [OFileInputComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OFileInputComponent]
})
export class OFileInputModule { }
