import { NgModule } from '@angular/core';

import { OLocaleBarMenuItemComponent } from './locale-menu-item/o-locale-bar-menu-item.component';
import { OBarMenuGroupComponent } from './menu-group/o-bar-menu-group.component';
import { OBarMenuItemComponent } from './menu-item/o-bar-menu-item.component';
import { OBarMenuNestedComponent } from './menu-nested/o-bar-menu-nested.component';
import { OBarMenuSeparatorComponent } from './menu-separator/o-bar-menu-separator.component';
import { OBarMenuComponent } from './o-bar-menu.component';

/** @deprecated Use the standalone component directly. Import the component class instead of this module. */
@NgModule({
  imports: [
    OBarMenuComponent,
    OBarMenuItemComponent,
    OBarMenuGroupComponent,
    OLocaleBarMenuItemComponent,
    OBarMenuSeparatorComponent,
    OBarMenuNestedComponent
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
