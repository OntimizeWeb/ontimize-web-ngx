import { NgModule } from '@angular/core';

import { OFullScreenDialogComponent } from './fullscreen/fullscreen-dialog.component';
import { OImageComponent } from './o-image.component';

@NgModule({
  imports: [OImageComponent, OFullScreenDialogComponent],
  exports: [OImageComponent, OFullScreenDialogComponent]
})
export class OImageModule { }
