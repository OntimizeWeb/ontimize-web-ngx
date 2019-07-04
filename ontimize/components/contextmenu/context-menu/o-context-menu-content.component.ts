import { OverlayRef } from '@angular/cdk/overlay';
import { AfterViewInit, Component, ContentChildren, EventEmitter, HostListener, Injector, OnInit, QueryList, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material';

import { OComponentMenuItems } from '../o-content-menu.class';
import { OContextMenuItemComponent } from '../o-context-menu-components';
import { OContextMenuService } from '../o-context-menu.service';
import { OWrapperContentMenuComponent } from './o-wrapper-content-menu/o-wrapper-content-menu.component';

export const DEFAULT_CONTEXT_MENU_CONTENT_INPUTS = [
  'menuItems',
  'overlay',
  'data',
  'menuClass'
];

export const DEFAULT_CONTEXT_MENU_CONTENT_OUTPUTS = [
  'execute',
  'close'
];

@Component({
  moduleId: module.id,
  selector: 'o-context-menu-content',
  templateUrl: 'o-context-menu-content.component.html',
  inputs: DEFAULT_CONTEXT_MENU_CONTENT_INPUTS,
  outputs: DEFAULT_CONTEXT_MENU_CONTENT_OUTPUTS,
  host: {
    '[class.o-context-menu-content]': 'true'
  }
})
export class OContextMenuContentComponent implements AfterViewInit, OnInit {

  public menuItems: any[] = [];
  public overlay: OverlayRef;
  public data: any;
  public menuClass: string;
  public execute: EventEmitter<{ event: Event, data: any, menuItem: OContextMenuItemComponent }> = new EventEmitter();

  @ContentChildren(OComponentMenuItems)
  public oContextMenuItems: QueryList<OComponentMenuItems>;
  @ViewChild(MatMenuTrigger)
  public trigger: MatMenuTrigger;
  @ViewChild(OWrapperContentMenuComponent)
  public menu: OWrapperContentMenuComponent;

  constructor(
    protected injector: Injector,
    protected menuService: OContextMenuService
  ) { }

  @HostListener('document:click')
  public click(): void {
    this.close();
  }

  public ngOnInit(): void {
    this.initialize();
  }

  public ngAfterViewInit(): void {
    this.trigger.openMenu();
  }

  public initialize(): void {
    this.setData(this.menuItems);
  }

  public setData(items): void {
    items.forEach(menuItem => {
      if (this.data) {
        menuItem.data = this.data;
        if (menuItem.children && menuItem.children.length > 0) {
          this.setData(menuItem.children);
        }
      }
    });
  }

  public onMenuClosed(e: Event): void {
    this.close();
  }

  public close(): void {
    this.trigger.closeMenu();
    this.menuService.closeContextMenu.next();
  }

}
