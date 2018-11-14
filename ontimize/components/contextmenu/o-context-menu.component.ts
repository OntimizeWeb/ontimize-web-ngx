import { Component, ContentChildren, Injector, OnDestroy, OnInit, EventEmitter, QueryList } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ObservableWrapper } from '../../utils';
import { OContextMenuService, IOContextMenuContext } from './o-context-menu.service';
import { OComponentMenu } from './o-content-menu.class';

export const DEFAULT_OUTPUTS_O_CONTEXT_MENU = [
  'onShow'
];

@Component({
  moduleId: module.id,
  selector: 'o-context-menu',
  template: ' ',
  outputs: DEFAULT_OUTPUTS_O_CONTEXT_MENU
})
export class OContextMenuComponent implements OnDestroy, OnInit {

  @ContentChildren(OComponentMenu) public oContextMenuItems: QueryList<OComponentMenu>;

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
