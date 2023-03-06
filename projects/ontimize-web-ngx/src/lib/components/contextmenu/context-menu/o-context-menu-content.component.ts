import { OverlayRef } from '@angular/cdk/overlay';
import { AfterViewInit, Component, EventEmitter, HostListener, Injector, OnInit, QueryList, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';

import { OContextMenuGroupComponent } from '../context-menu-group/o-context-menu-group.component';
import { OContextMenuItemComponent } from '../context-menu-item/o-context-menu-item.component';
import { OComponentMenuBaseItem } from '../o-content-menu-base-item.class';

export const DEFAULT_CONTEXT_MENU_CONTENT_INPUTS = [
  'menuItems',
  'externalMenuItems',
  'overlay',
  'data',
  'menuClass'
];

export const DEFAULT_CONTEXT_MENU_CONTENT_OUTPUTS = [
  'execute',
  'close'
];

@Component({
  selector: 'o-context-menu-content',
  templateUrl: 'o-context-menu-content.component.html',
  inputs: DEFAULT_CONTEXT_MENU_CONTENT_INPUTS,
  outputs: DEFAULT_CONTEXT_MENU_CONTENT_OUTPUTS,
  host: {
    '[class.o-context-menu-content]': 'true'
  }
})
export class OContextMenuContentComponent implements AfterViewInit, OnInit {

  public menuItems: QueryList<OComponentMenuBaseItem>;
  public externalMenuItems: QueryList<OComponentMenuBaseItem>;
  public overlay: OverlayRef;
  public data: any;
  public menuClass: string;
  public execute: EventEmitter<{ event: Event, data: any, menuItem: OContextMenuItemComponent }> = new EventEmitter();
  public close: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatMenuTrigger)
  public trigger: MatMenuTrigger;
  public allMenuItems: OComponentMenuBaseItem[];

  constructor(
    protected injector: Injector
  ) { }

  @HostListener('document:click')
  public click(): void {
    this.closeContent();
  }

  public ngOnInit(): void {
    this.initialize();
  }

  public ngAfterViewInit(): void {
    this.trigger.openMenu();
  }


  public initialize(): void {
    const menuItemsArray = this.menuItems ? this.menuItems.toArray() : [];
    const externalItemsArray = this.externalMenuItems ? this.externalMenuItems.toArray() : [];
    this.allMenuItems = menuItemsArray.concat(externalItemsArray);
    this.setData(this.allMenuItems);
  }

  public setData(items: OComponentMenuBaseItem[]): void {
    if (this.data) {
      (items || []).forEach((menuItem: OComponentMenuBaseItem) => {
        menuItem.data = this.data;
        if (menuItem instanceof OContextMenuGroupComponent) {
          this.setData(menuItem.children);
        }
      });
    }
  }

  public onMenuClosed(e: Event): void {
    this.closeContent();
  }

  public closeContent(): void {
    this.trigger.closeMenu();
    this.close.emit();
  }

}
