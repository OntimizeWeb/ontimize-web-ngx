import { AfterContentInit, Component, ContentChildren, forwardRef, OnDestroy, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';

import { OComponentMenuBaseItem } from '../o-content-menu-base-item.class';

@Component({
  selector: 'o-context-menu-group',
  template: ' ',
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
    this.children = this.oContextMenuItems.toArray();
  }

}
