import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { OSharedModule } from '../../shared/shared.module';
import { CanDeactivateFormGuard } from './guards/o-form-can-deactivate.guard';
import { OFormComponent } from './o-form.component';
import { OFormToolbarModule } from './toolbar/o-form-toolbar.module';

@NgModule({
  declarations: [OFormComponent],
  imports: [CommonModule, OFormToolbarModule, OSharedModule],
  exports: [OFormComponent, OFormToolbarModule],
  providers: [{ provide: CanDeactivateFormGuard, useClass: CanDeactivateFormGuard }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OFormModule { }
