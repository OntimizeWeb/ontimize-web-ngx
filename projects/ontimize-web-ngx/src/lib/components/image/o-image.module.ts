import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../shared/shared.module';
import { OFullScreenDialogComponent } from './fullscreen/fullscreen-dialog.component';
import { OImageComponent } from './o-image.component';

@NgModule({
  declarations: [OImageComponent, OFullScreenDialogComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OImageComponent, OFullScreenDialogComponent],
  entryComponents: [OFullScreenDialogComponent]
})
export class OImageModule { }
