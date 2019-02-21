import { Component, ContentChildren, Injector, OnDestroy, OnInit, EventEmitter, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';

import { ObservableWrapper } from '../../utils';
import { OContextMenuService, IOContextMenuContext } from './o-context-menu.service';
import { OComponentMenuItems } from './o-content-menu.class';

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

  @ContentChildren(OComponentMenuItems) public oContextMenuItems: QueryList<OComponentMenuItems>;

  public oContextMenuService: OContextMenuService;
  protected subscription: Subscription = new Subscription();
  public origin: HTMLElement;
  public onShow: EventEmitter<any> = new EventEmitter();
  public onClose: EventEmitter<any> = new EventEmitter();

  constructor(
    protected injector: Injector
  ) {
    this.oContextMenuService = this.injector.get(OContextMenuService);
  }

  ngOnInit() {
    this.subscription.add(this.oContextMenuService.showContextMenu.subscribe(param => this.showContextMenu(param)));
    this.subscription.add(this.oContextMenuService.closeContextMenu.subscribe(param => this.onClose.emit()));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showContextMenu(params: IOContextMenuContext): void {
    this.origin = <HTMLElement>params.event.target;
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
