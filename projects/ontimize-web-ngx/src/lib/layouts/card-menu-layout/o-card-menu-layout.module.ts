import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OCardMenuItemModule } from '../../components/card-menu-item/o-card-menu-item.module';
import { OSharedModule } from '../../shared/shared.module';
import { OCardMenuLayoutComponent } from './o-card-menu-layout.component';

@NgModule({
  imports: [CommonModule, OCardMenuItemModule, OSharedModule, OCardMenuLayoutComponent],
  exports: [OCardMenuLayoutComponent]
})
export class OCardMenuLayoutModule { }
