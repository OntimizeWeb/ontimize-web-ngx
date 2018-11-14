import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OSharedModule } from '../../shared';

import { OContextMenuDirective } from './o-context-menu.directive';
import { OContextMenuComponent } from './o-context-menu.component';
import { OContextMenuContentComponent } from './context-menu/o-context-menu-content.component';
import { OContextMenuItemComponent } from './context-menu-item/o-context-menu-item.component';
import { OContextMenuGroupComponent } from './context-menu-group/o-context-menu-group.component';
import { OMenuItemComponent } from './context-menu/menu-item/o-menu-item.component';


@NgModule({
  imports: [CommonModule, OSharedModule],
  entryComponents: [OContextMenuContentComponent, OContextMenuComponent],
  exports: [CommonModule, OContextMenuDirective, OContextMenuComponent, OContextMenuItemComponent, OContextMenuGroupComponent],
  declarations: [OContextMenuDirective, OContextMenuContentComponent, OContextMenuComponent, OContextMenuItemComponent, OContextMenuGroupComponent, OMenuItemComponent]
})
export class OContextMenuModule { }
