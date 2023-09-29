import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OSharedModule } from '../../shared/shared.module';
import { OCardMenuItemComponent } from './o-card-menu-item.component';

@NgModule({
  declarations: [OCardMenuItemComponent],
  imports: [CommonModule, OSharedModule],
  exports: [OCardMenuItemComponent]
})
export class OCardMenuItemModule { }
