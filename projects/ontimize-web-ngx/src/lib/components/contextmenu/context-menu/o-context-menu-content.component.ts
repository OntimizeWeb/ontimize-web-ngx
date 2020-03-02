import { OverlayRef } from '@angular/cdk/overlay';
import {
  AfterViewInit,
  Component,
  ContentChildren,
  EventEmitter,
  HostListener,
  Injector,
  OnInit,
  QueryList,
  ViewChild,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material';

import { OContextMenuItemComponent } from '../context-menu-item/o-context-menu-item.component';
import { OComponentMenuItems } from '../o-content-menu.class';
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
  public close: EventEmitter<any> = new EventEmitter();

  @ContentChildren(OComponentMenuItems)
  public oContextMenuItems: QueryList<OComponentMenuItems>;
  @ViewChild(MatMenuTrigger, { static: false })
  public trigger: MatMenuTrigger;
  @ViewChild(OWrapperContentMenuComponent, { static: false })
  public menu: OWrapperContentMenuComponent;

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
    this.closeContent();
  }

  public closeContent(): void {
    this.trigger.closeMenu();
    this.close.emit();
  }

}
