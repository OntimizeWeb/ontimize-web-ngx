import { Component, ContentChildren, EventEmitter, Injector, OnDestroy, OnInit, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';

import { OComponentMenuItems } from './o-content-menu.class';
import { IOContextMenuContext, OContextMenuService } from './o-context-menu.service';

export const DEFAULT_OUTPUTS_O_CONTEXT_MENU = [
  'onShow',
  'onClose'
];

@Component({
  moduleId: module.id,
  selector: 'o-context-menu',
  template: ' ',
  outputs: DEFAULT_OUTPUTS_O_CONTEXT_MENU
})
export class OContextMenuComponent implements OnDestroy, OnInit {

  @ContentChildren(OComponentMenuItems)
  public oContextMenuItems: QueryList<OComponentMenuItems>;

  public origin: HTMLElement;
  public onShow: EventEmitter<any> = new EventEmitter();
  public onClose: EventEmitter<any> = new EventEmitter();

  public oContextMenuService: OContextMenuService;
  protected subscription: Subscription = new Subscription();

  constructor(
    protected injector: Injector
  ) {
    this.oContextMenuService = this.injector.get(OContextMenuService);
  }

  public ngOnInit(): void {
    this.subscription.add(this.oContextMenuService.showContextMenu.subscribe(param => this.showContextMenu(param)));
    this.subscription.add(this.oContextMenuService.closeContextMenu.subscribe(param => this.onClose.emit()));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public showContextMenu(params: IOContextMenuContext): void {
    this.origin = params.event.target as HTMLElement;
    this.onShow.emit(params);
    if (params.contextMenu !== this) {
      return;
    }
    params.menuItems = this.oContextMenuItems;
    if (params.menuItems.length > 0) {
      this.oContextMenuService.openContextMenu(params);
    }
  }

}
