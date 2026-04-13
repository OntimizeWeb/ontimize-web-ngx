import { NgModule } from '@angular/core';

import { OBreadcrumbComponent } from './o-breadcrumb.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [OBreadcrumbComponent],
  exports: [OBreadcrumbComponent]
})
export class OBreadcrumbModule { }
