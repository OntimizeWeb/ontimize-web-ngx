import { Component, forwardRef } from '@angular/core';
import { OComponentMenuItems } from '../o-content-menu.class';

@Component({
  moduleId: module.id,
  selector: 'o-context-menu-separator',
  template: ' ',
  providers: [{ provide: OComponentMenuItems, useExisting: forwardRef(() => OContextMenuSeparatorComponent) }]

})
export class OContextMenuSeparatorComponent extends OComponentMenuItems {

  public type = OComponentMenuItems.TYPE_SEPARATOR_MENU;

  public setActiveStyles(): void {
    this.isActive = true;
  }

  public setInactiveStyles(): void {
    this.isActive = false;
  }

}
