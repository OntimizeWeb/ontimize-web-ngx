import { NgModule } from '@angular/core';

import { CanDeactivateFormGuard } from './guards/o-form-can-deactivate.guard';
import { OFormNavigationComponent } from './navigation/o-form-navigation.component';
import { OFormComponent } from './o-form.component';
import { OFormToolbarComponent } from './toolbar/o-form-toolbar.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OFormComponent, OFormNavigationComponent, OFormToolbarComponent],
  exports: [OFormComponent, OFormNavigationComponent, OFormToolbarComponent],
  providers: [{ provide: CanDeactivateFormGuard, useClass: CanDeactivateFormGuard }]
})
export class OFormModule { }
