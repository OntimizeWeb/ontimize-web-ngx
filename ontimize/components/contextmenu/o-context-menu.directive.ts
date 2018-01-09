import { Injector, Directive, HostListener } from '@angular/core';

import { OContextMenuComponent } from './o-context-menu.component';
import { OContextMenuService } from './o-context-menu.service';

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

  protected oContextMenuService: OContextMenuService;

  constructor(
    protected injector: Injector
  ) {
    this.oContextMenuService = this.injector.get(OContextMenuService);
  }

  @HostListener('contextmenu', ['$event']) onRightClick(event: MouseEvent) {
    this.oContextMenuService.showContextMenu.next({
      contextMenu: this.oContextMenu,
      event,
      data: this.oContextMenuData
    });
    event.preventDefault();
    event.stopPropagation();
  }

}
