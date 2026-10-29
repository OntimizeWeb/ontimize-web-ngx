import { NgModule } from '@angular/core';

import { OFullScreenDialogComponent } from './fullscreen/fullscreen-dialog.component';
import { OImageComponent } from './o-image.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OImageComponent, OFullScreenDialogComponent],
  exports: [OImageComponent, OFullScreenDialogComponent]
})
export class OImageModule { }
