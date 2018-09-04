import { AfterViewInit, Component, ContentChildren, EventEmitter, HostListener, Injector, OnDestroy, OnInit, QueryList, ViewEncapsulation } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { trigger, state, style, transition, animate, query, group } from '@angular/animations';

import { OContextMenuItemComponent } from '../item/o-context-menu-item.component';

export const DEFAULT_CONTEXT_MENU_CONTENT_INPUTS = [
  'menuItems',
  'overlay',
  'data'
];

export const DEFAULT_CONTEXT_MENU_CONTENT_OUTPUTS = [
  'execute',
  'close'
];

export const EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';

@Component({
  selector: 'o-context-menu-content',
  templateUrl: 'o-context-menu-content.component.html',
  styleUrls: ['o-context-menu-content.component.scss'],
  inputs: DEFAULT_CONTEXT_MENU_CONTENT_INPUTS,
  outputs: DEFAULT_CONTEXT_MENU_CONTENT_OUTPUTS,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-context-menu-content]': 'true'
  },
  animations: [
    trigger('contentExpansion', [
      state('collapsed', style({ height: '0px' })),
      state('expanded', style({ height: '*' })),
      transition('collapsed=> expanded', group([
        query('.o-context-menu-item', [
            style({ opacity: 0 }),
            animate(EXPANSION_PANEL_ANIMATION_TIMING)
        ]),
        animate(EXPANSION_PANEL_ANIMATION_TIMING)
    ]))
    ])
  ]
})
export class OContextMenuContentComponent implements AfterViewInit, OnDestroy, OnInit {

  public menuItems: OContextMenuItemComponent[] = [];
  public overlay: OverlayRef;
  public data: any;
  public execute: EventEmitter<{ event: Event, data: any, menuItem: OContextMenuItemComponent }> = new EventEmitter();
  public close: EventEmitter<void> = new EventEmitter<void>();

  protected _contentExpansion = 'collapsed';
  @ContentChildren(OContextMenuItemComponent) public oContextMenuItems: QueryList<OContextMenuItemComponent>;

  protected subscription: Subscription = new Subscription();
  protected _keyManager: ActiveDescendantKeyManager<OContextMenuItemComponent>;

  constructor(
    protected injector: Injector
  ) { }

  ngAfterViewInit() {
    this.overlay.updatePosition();
    const self = this;
    setTimeout(() => {
      self.contentExpansion = 'expanded';
    }, 0);
  }

  ngOnInit() {
    this.menuItems.forEach(menuItem => {
      if (this.data) {
        menuItem.data = this.data;
      }
      this.subscription.add(menuItem.execute.subscribe(event => {
        this.execute.emit({ ...event, data: this.data, menuItem });
      }));
    });
    const queryList = new QueryList<OContextMenuItemComponent>();
    queryList.reset(this.menuItems);
    this._keyManager = new ActiveDescendantKeyManager<OContextMenuItemComponent>(queryList).withWrap();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get contentExpansion(): string {
    return this._contentExpansion;
  }

  set contentExpansion(val: string) {
    this._contentExpansion = val;
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:contextmenu', ['$event'])
  @HostListener('window:keydown.Escape', ['$event'])
  public closeMenu(event: MouseEvent): void {
    if (event.type === 'click' && event.button === 2) {
      return;
    }
    this.close.emit();
  }

  @HostListener('window:keydown.ArrowDown', ['$event'])
  @HostListener('window:keydown.ArrowUp', ['$event'])
  public onKeyEvent(event: KeyboardEvent): void {
    this._keyManager.onKeydown(event);
  }

  @HostListener('window:keydown.Enter', ['$event'])
  public keyboardMenuItemSelect(event?: KeyboardEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const menuItem = this.menuItems[this._keyManager.activeItemIndex];
    if (menuItem) {
      menuItem.triggerExecute(this.data, event);
    }
  }

}
