import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OCardMenuItemModule } from '../../components/card-menu-item/o-card-menu-item.module';
import { OSharedModule } from '../../shared/shared.module';
import { OCardMenuLayoutComponent } from './o-card-menu-layout.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [CommonModule, OCardMenuItemModule, OSharedModule, OCardMenuLayoutComponent],
  exports: [OCardMenuLayoutComponent]
})
export class OCardMenuLayoutModule { }
