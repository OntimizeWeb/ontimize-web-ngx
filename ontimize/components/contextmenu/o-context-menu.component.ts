import { Component, ContentChildren, Injector, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { OContextMenuService, IOContextMenuContext } from './o-context-menu.service';
import { OContextMenuItemComponent } from './o-context-menu-item.component';

@Component({
  selector: 'o-context-menu',
  template: ' '
})
export class OContextMenuComponent implements OnDestroy, OnInit {

  @ContentChildren(OContextMenuItemComponent) public oContextMenuItems: OContextMenuItemComponent[];

  public oContextMenuService: OContextMenuService;
  protected subscription: Subscription = new Subscription();

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
    if (params.contextMenu !== this) {
      return;
    }
    params.menuItems = this.oContextMenuItems;
    if (params.menuItems.length > 0) {
      this.oContextMenuService.openContextMenu(params);
    }
  }

}
