import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OCardMenuItemModule } from '../../components/card-menu-item/o-card-menu-item.module';
import { OSharedModule } from '../../shared/shared.module';
import { OCardMenuLayoutComponent } from './o-card-menu-layout.component';

@NgModule({
  declarations: [OCardMenuLayoutComponent],
  imports: [CommonModule, OCardMenuItemModule, OSharedModule],
  exports: [OCardMenuLayoutComponent]
})
export class OCardMenuLayoutModule { }
