import { AfterViewInit, Component, ContentChildren, EventEmitter, HostListener, Injector, OnDestroy, OnInit, QueryList, ViewEncapsulation, ViewChild } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs/Subscription';
import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';

import { MatMenuTrigger } from '@angular/material';
import { OContextMenuService } from '../o-context-menu.service';
import { OContextMenuItemComponent } from '../context-menu-item/o-context-menu-item.component';
import { OComponentMenu } from '../o-content-menu.class';
import { OContextMenuGroupComponent } from '../context-menu-group/o-context-menu-group.component';


export const DEFAULT_CONTEXT_MENU_CONTENT_INPUTS = [
  'menuItems',
  'overlay',
  'data'
];

export const DEFAULT_CONTEXT_MENU_CONTENT_OUTPUTS = [
  'execute',
  'close'
];

@Component({
  moduleId: module.id,
  selector: 'o-context-menu-content',
  templateUrl: 'o-context-menu-content.component.html',
  styleUrls: ['o-context-menu-content.component.scss'],
  inputs: DEFAULT_CONTEXT_MENU_CONTENT_INPUTS,
  outputs: DEFAULT_CONTEXT_MENU_CONTENT_OUTPUTS,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-context-menu-content]': 'true'
  }
})
export class OContextMenuContentComponent implements AfterViewInit, OnDestroy, OnInit {

  public menuItems: any[] = [];
  public overlay: OverlayRef;
  public data: any;
  public execute: EventEmitter<{ event: Event, data: any, menuItem: OContextMenuItemComponent }> = new EventEmitter();
  public close: EventEmitter<void> = new EventEmitter<void>();

  protected _contentExpansion = 'collapsed';
  @ContentChildren(OComponentMenu) public oContextMenuItems: QueryList<OComponentMenu>;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  protected subscription: Subscription = new Subscription();
  protected _keyManager: ActiveDescendantKeyManager<OContextMenuItemComponent | OContextMenuGroupComponent>;


  constructor(
    protected injector: Injector,
    protected menuService: OContextMenuService
  ) { }

  ngAfterViewInit() {
    this.trigger.openMenu();
  }

  ngOnInit() {

    this.menuItems.forEach(menuItem => {
      if (this.data) {
        menuItem.data = this.data;
      }
      // this.subscription.add(menuItem.execute.subscribe(event => {
      //   this.execute.emit({ ...event, data: this.data, menuItem });
      // }));
    });
    const queryList = new QueryList<OContextMenuItemComponent | OContextMenuGroupComponent>();
    queryList.reset(this.menuItems);
    this._keyManager = new ActiveDescendantKeyManager<OContextMenuItemComponent | OContextMenuGroupComponent>(queryList).withWrap();

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

  onClosed(event) {
    console.log(event);
  }

  onOpened(event) {
    console.log(event);
  }
}
