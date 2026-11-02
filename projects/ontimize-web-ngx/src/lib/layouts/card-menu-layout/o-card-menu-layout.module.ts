import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OCardMenuItemComponent } from '../../components/card-menu-item/o-card-menu-item.component';
import { OSharedModule } from '../../shared/shared.module';
import { OCardMenuLayoutComponent } from './o-card-menu-layout.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [CommonModule, OCardMenuItemComponent, OSharedModule, OCardMenuLayoutComponent],
  exports: [OCardMenuLayoutComponent]
})
export class OCardMenuLayoutModule { }
