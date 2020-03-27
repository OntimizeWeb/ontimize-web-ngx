import { ElementRef, QueryList } from '@angular/core';

import { OComponentMenuItems } from '../components/contextmenu/o-content-menu.class';
import { OContextMenuComponent } from '../components/contextmenu/o-context-menu.component';

export interface IOContextMenuClickEvent {
  anchorElement?: ElementRef;
  contextMenu?: OContextMenuComponent;
  event?: MouseEvent;
  data?: any;
}

export interface IOContextMenuContext extends IOContextMenuClickEvent {
  menuItems?: QueryList<OComponentMenuItems>;
  class?: string;
}
