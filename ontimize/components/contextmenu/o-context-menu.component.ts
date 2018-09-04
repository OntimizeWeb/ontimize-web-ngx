import { Component, ContentChildren, Injector, OnDestroy, OnInit, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { ObservableWrapper } from '../../utils';
import { OContextMenuService, IOContextMenuContext } from './o-context-menu.service';
import { OContextMenuItemComponent } from './item/o-context-menu-item.component';

export const DEFAULT_OUTPUTS_O_CONTEXT_MENU = [
  'onShow'
];

@Component({
  selector: 'o-context-menu',
  template: ' ',
  outputs : DEFAULT_OUTPUTS_O_CONTEXT_MENU
})
export class OContextMenuComponent implements OnDestroy, OnInit {

  @ContentChildren(OContextMenuItemComponent) public oContextMenuItems: OContextMenuItemComponent[];

  public oContextMenuService: OContextMenuService;
  protected subscription: Subscription = new Subscription();

  public onShow: EventEmitter<any> = new EventEmitter();

  constructor(
    protected injector: Injector
  ) {
    this.oContextMenuService = this.injector.get(OContextMenuService);
  }

  ngOnInit() {
    this.subscription.add(this.oContextMenuService.showContextMenu.subscribe(param => this.showContextMenu(param)));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showContextMenu(params: IOContextMenuContext): void {
    ObservableWrapper.callEmit(this.onShow, params);
    if (params.contextMenu !== this) {
      return;
    }
    params.menuItems = this.oContextMenuItems;
    if (params.menuItems.length > 0) {
      this.oContextMenuService.openContextMenu(params);
    }
  }

}
