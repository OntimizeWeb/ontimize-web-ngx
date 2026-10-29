import { NgModule } from '@angular/core';

import { OFormContainerComponent } from './o-form-container.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OFormContainerComponent],
  exports: [OFormContainerComponent]
})
export class OFormContainerModule {
}
