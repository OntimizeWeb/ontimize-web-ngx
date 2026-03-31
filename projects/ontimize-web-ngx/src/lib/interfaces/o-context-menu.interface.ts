import { ElementRef, QueryList } from '@angular/core';

import { OComponentMenuBaseItem } from '../components/contextmenu/o-content-menu-base-item.class';
import { OContextMenuComponent } from '../components/contextmenu/o-context-menu.component';

export interface IOContextMenuClickEvent {
  anchorElement?: ElementRef;
  contextMenu?: OContextMenuComponent;
  event?: MouseEvent;
  data?: any;
}

export interface IOContextMenuContext extends IOContextMenuClickEvent {
  menuItems?: QueryList<OComponentMenuBaseItem>;
  externalMenuItems?: QueryList<OComponentMenuBaseItem>;
  class?: string;
}
