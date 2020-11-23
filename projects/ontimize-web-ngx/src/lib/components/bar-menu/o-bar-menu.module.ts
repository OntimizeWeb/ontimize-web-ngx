import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { OSharedModule } from '../../shared/shared.module';
import { OLocaleBarMenuItemComponent } from './locale-menu-item/o-locale-bar-menu-item.component';
import { OBarMenuGroupComponent } from './menu-group/o-bar-menu-group.component';
import { OBarMenuItemComponent } from './menu-item/o-bar-menu-item.component';
import { OBarMenuNestedComponent } from './menu-nested/o-bar-menu-nested.component';
import { OBarMenuSeparatorComponent } from './menu-separator/o-bar-menu-separator.component';
import { OBarMenuComponent } from './o-bar-menu.component';

@NgModule({
  declarations: [
    OBarMenuComponent,
    OBarMenuItemComponent,
    OBarMenuGroupComponent,
    OLocaleBarMenuItemComponent,
    OBarMenuSeparatorComponent,
    OBarMenuNestedComponent
  ],
  imports: [
    CommonModule,
    OSharedModule,
    RouterModule
  ],
  exports: [
    OBarMenuComponent,
    OBarMenuItemComponent,
    OBarMenuGroupComponent,
    OLocaleBarMenuItemComponent,
    OBarMenuSeparatorComponent,
    OBarMenuNestedComponent
  ]
})
export class OBarMenuModule {
}
