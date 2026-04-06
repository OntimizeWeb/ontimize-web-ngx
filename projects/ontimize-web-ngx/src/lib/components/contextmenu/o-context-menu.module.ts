import { NgModule } from '@angular/core';

import { OContextMenuGroupComponent } from './context-menu-group/o-context-menu-group.component';
import { OContextMenuItemComponent } from './context-menu-item/o-context-menu-item.component';
import { OContextMenuSeparatorComponent } from './context-menu-separator/o-context-menu-separator.component';
import { OContextMenuComponent } from './o-context-menu.component';
import { OContextMenuDirective } from './o-context-menu.directive';

@NgModule({
  imports: [OContextMenuDirective, OContextMenuComponent, OContextMenuItemComponent, OContextMenuGroupComponent, OContextMenuSeparatorComponent],
  exports: [OContextMenuDirective, OContextMenuComponent, OContextMenuItemComponent, OContextMenuGroupComponent, OContextMenuSeparatorComponent]
})
export class OContextMenuModule { }
