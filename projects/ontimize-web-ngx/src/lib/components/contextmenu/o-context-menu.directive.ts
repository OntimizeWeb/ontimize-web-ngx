import { Directive, HostListener, Injector } from '@angular/core';

import { Util } from '../../util/util';
import { OContextMenuComponent } from './o-context-menu.component';

export const DEFAULT_CONTEXT_MENU_DIRECTIVE_INPUTS = [
  'oContextMenu',
  'oContextMenuData'
];

@Directive({
  selector: '[oContextMenu]',
  inputs: DEFAULT_CONTEXT_MENU_DIRECTIVE_INPUTS
})
export class OContextMenuDirective {

  public oContextMenu: OContextMenuComponent;
  public oContextMenuData: any;

  constructor(protected injector: Injector) {
  }

  @HostListener('contextmenu', ['$event'])
  public onRightClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (Util.isDefined(this.oContextMenu)) {
      this.oContextMenu.oContextMenuService.showContextMenu.next({
        contextMenu: this.oContextMenu,
        event: event,
        data: this.oContextMenuData
      });
    }
  }

}
