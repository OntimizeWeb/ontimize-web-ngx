import { Overlay, OverlayRef, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, ElementRef, Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { IOContextMenuClickEvent, IOContextMenuContext } from '../../interfaces/o-context-menu.interface';
import { OContextMenuContentComponent } from './context-menu/o-context-menu-content.component';

@Injectable()
export class OContextMenuService implements OnDestroy {

  public showContextMenu: Subject<IOContextMenuClickEvent> = new Subject<IOContextMenuClickEvent>();
  public closeContextMenu: Subject<Event> = new Subject();
  public activeMenu: OContextMenuContentComponent;

  protected overlays: OverlayRef[] = [];
  protected fakeElement: ElementRef = new ElementRef({ nativeElement: '' });
  protected subscription: Subscription = new Subscription();

  constructor(
    private overlay: Overlay,
    private scrollStrategy: ScrollStrategyOptions
  ) {
    this.subscription.add(this.closeContextMenu.subscribe(() => this.destroyOverlays()));
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public openContextMenu(context: IOContextMenuContext): void {
    this.destroyOverlays();
    this.createOverlay(context);
  }

  public destroyOverlays(): void {
    if (this.overlays) {
      this.overlays.forEach((overlay) => {
        overlay.detach();
        overlay.dispose();
      });
    }
    this.overlays = [];
  }

  // Create overlay and attach `o-context-menu-content` to it in order to trigger the menu click, the menu opens in a new overlay
  // TODO: try to use only one overlay
  protected createOverlay(context: IOContextMenuContext): void {
    context.event.preventDefault();
    context.event.stopPropagation();

    this.fakeElement.nativeElement.getBoundingClientRect = (): ClientRect => ({
      bottom: context.event.clientY,
      height: 0,
      left: context.event.clientX,
      right: context.event.clientX,
      top: context.event.clientY,
      width: 0,
    });

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(context.anchorElement || this.fakeElement)
      .withPositions([{
        overlayX: 'start',
        overlayY: 'top',
        originX: 'start',
        originY: 'bottom'
      }]);

    const overlayRef = this.overlay.create({
      positionStrategy: positionStrategy,
      hasBackdrop: false,
      panelClass: ['o-context-menu'],
      scrollStrategy: this.scrollStrategy.close()
    });

    this.overlays = [overlayRef];

    this.attachContextMenu(this.overlays[0], context);
  }

  protected attachContextMenu(overlay: OverlayRef, context: IOContextMenuContext): void {
    const contextMenuContent: ComponentRef<any> = overlay.attach(new ComponentPortal(OContextMenuContentComponent));
    contextMenuContent.instance.overlay = overlay;
    contextMenuContent.instance.menuItems = context.menuItems;
    contextMenuContent.instance.data = context.data;
    contextMenuContent.instance.menuClass = context.class;
    this.subscription.add(contextMenuContent.instance.close.subscribe(() => {
      this.closeContextMenu.next();
    }));
  }

}
