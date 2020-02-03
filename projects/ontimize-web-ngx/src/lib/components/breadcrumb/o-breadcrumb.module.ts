import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OSharedModule } from '../../shared/shared.module';
import { OBreadcrumbComponent } from './o-breadcrumb.component';

@NgModule({
  imports: [CommonModule, OSharedModule, RouterModule],
  exports: [OBreadcrumbComponent],
  declarations: [OBreadcrumbComponent]
})
export class OBreadcrumbModule { }
