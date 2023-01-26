import { AfterContentInit, Component, ContentChildren, forwardRef, OnDestroy, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';

import { DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS, OComponentMenuBaseItem } from '../o-content-menu-base-item.class';

export const DEFAULT_CONTEXT_MENU_GROUP_INPUTS = [
  ...DEFAULT_INPUTS_O_CONTEXT_MENU_ITEMS
];

@Component({
  selector: 'o-context-menu-group',
  template: ' ',
  inputs: DEFAULT_CONTEXT_MENU_GROUP_INPUTS,
  providers: [{ provide: OComponentMenuBaseItem, useExisting: forwardRef(() => OContextMenuGroupComponent) }]
})
export class OContextMenuGroupComponent extends OComponentMenuBaseItem implements AfterContentInit, OnDestroy {

  public type = OComponentMenuBaseItem.TYPE_GROUP_MENU;
  public children: OComponentMenuBaseItem[] = [];
  @ContentChildren(OComponentMenuBaseItem) public oContextMenuItems: QueryList<OComponentMenuBaseItem>;

  protected subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterContentInit(): void {
    this.subscription.add(this.oContextMenuItems.changes.subscribe(() => {
      this.updateChildren();
    }));
    this.updateChildren();
  }

  protected updateChildren() {
    this.children = this.oContextMenuItems.toArray().slice(1, this.oContextMenuItems.toArray().length);
  }

}
