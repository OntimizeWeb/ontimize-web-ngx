import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OSharedModule } from '../../shared';

import { OContextMenuDirective } from './o-context-menu.directive';
import { OContextMenuContentComponent } from './content/o-context-menu-content.component';
import { OContextMenuComponent } from './o-context-menu.component';
import { OContextMenuItemComponent } from './item/o-context-menu-item.component';

@NgModule({
  imports: [CommonModule, OSharedModule],
  entryComponents: [OContextMenuContentComponent, OContextMenuComponent],
  exports: [CommonModule, OContextMenuDirective, OContextMenuContentComponent, OContextMenuComponent, OContextMenuItemComponent],
  declarations: [OContextMenuDirective, OContextMenuContentComponent, OContextMenuComponent, OContextMenuItemComponent]
})
export class OContextMenuModule { }
