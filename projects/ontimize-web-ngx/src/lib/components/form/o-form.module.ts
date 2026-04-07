import { NgModule } from '@angular/core';

import { CanDeactivateFormGuard } from './guards/o-form-can-deactivate.guard';
import { OFormComponent } from './o-form.component';
import { OFormToolbarModule } from './toolbar/o-form-toolbar.module';

@NgModule({
  imports: [OFormComponent, OFormToolbarModule],
  exports: [OFormComponent, OFormToolbarModule],
  providers: [{ provide: CanDeactivateFormGuard, useClass: CanDeactivateFormGuard }]
})
export class OFormModule { }
