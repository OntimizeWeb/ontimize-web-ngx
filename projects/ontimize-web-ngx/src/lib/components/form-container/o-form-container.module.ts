import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OBreadcrumbComponent } from '../../components/breadcrumb/o-breadcrumb.component';
import { OSharedModule } from '../../shared/shared.module';
import { OFormContainerComponent } from './o-form-container.component';

@NgModule({
  declarations: [OFormContainerComponent],
  imports: [OSharedModule, CommonModule],
  entryComponents: [OBreadcrumbComponent],
  exports: [OFormContainerComponent]
})
export class OFormContainerModule {
}
