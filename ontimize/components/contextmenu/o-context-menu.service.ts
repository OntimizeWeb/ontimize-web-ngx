import { ComponentRef, ElementRef, Injectable, QueryList } from '@angular/core';
import { Overlay, OverlayRef, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { OContextMenuComponent } from './o-context-menu.component';
import { OContextMenuContentComponent } from './content/o-context-menu-content.component';
import { OContextMenuItemComponent } from './item/o-context-menu-item.component';

export interface IOContextMenuClickEvent {
  anchorElement?: ElementRef;
  contextMenu?: OContextMenuComponent;
  event?: MouseEvent;
  data?: any;
}

export interface IOContextMenuContext extends IOContextMenuClickEvent {
  menuItems?: QueryList<OContextMenuItemComponent>;
}

@Injectable()
export class OContextMenuService {

  public showContextMenu: Subject<IOContextMenuClickEvent> = new Subject<IOContextMenuClickEvent>();
  public closeContextMenu: Subject<Event> = new Subject();

  protected overlays: Array<OverlayRef> = [];
  protected fakeElement: any = {
    getBoundingClientRect: (): ClientRect => ({
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
    })
  };

  constructor(
    private overlay: Overlay,
    private scrollStrategy: ScrollStrategyOptions
  ) { }

  public openContextMenu(context: IOContextMenuContext): void {
    this.createOverlay(context);
  }

  public closeContext(): void {
    if (this.overlays) {
      this.overlays.forEach((overlay, index) => {
        overlay.detach();
        overlay.dispose();
      });
    }
    this.overlays = [];
  }

  protected createOverlay(context: IOContextMenuContext): void {
    // TODO: submenu
    this.fakeElement.getBoundingClientRect = (): ClientRect => ({
      bottom: context.event.clientY,
      height: 0,
      left: context.event.clientX,
      right: context.event.clientX,
      top: context.event.clientY,
      width: 0,
    });
    this.closeContext();
    const positionStrategy = this.overlay.position().connectedTo(
      { nativeElement: context.anchorElement || this.fakeElement },
      { originX: 'start', originY: 'bottom' },
      { overlayX: 'start', overlayY: 'top' }
    );
    this.overlays = [this.overlay.create({
      positionStrategy,
      panelClass: ['o-context-menu'],
      scrollStrategy: this.scrollStrategy.close()
    })];
    this.attachContextMenu(this.overlays[0], context);
  }

  protected attachContextMenu(overlay: OverlayRef, context: IOContextMenuContext): void {
    const contextMenuContent: ComponentRef<any> = overlay.attach(new ComponentPortal(OContextMenuContentComponent));
    contextMenuContent.instance.overlay = overlay;
    contextMenuContent.instance.menuItems = context.menuItems;
    contextMenuContent.instance.data = context.data;

    const subscriptions: Subscription = new Subscription();
    subscriptions.add(contextMenuContent.instance.execute.asObservable().subscribe(() => this.closeContext()));
    subscriptions.add(contextMenuContent.instance.close.asObservable().subscribe(() => this.closeContext()));

    contextMenuContent.onDestroy(() => context.menuItems.forEach(menuItem => menuItem.isActive = false));
  }

}
