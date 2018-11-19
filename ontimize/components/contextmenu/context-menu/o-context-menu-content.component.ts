import { AfterViewInit, Component, ContentChildren, EventEmitter, Injector, OnInit, QueryList, ViewEncapsulation, ViewChild } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatMenuTrigger } from '@angular/material';
import { OComponentMenuItems } from '../o-content-menu.class';
import { OContextMenuService } from '../o-context-menu.service';
import { OContextMenuItemComponent } from '../o-context-menu-components';
import { OWrapperContentMenuComponent } from './wrapper-content-menu/wrapper-content-menu.component';


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
  inputs: DEFAULT_CONTEXT_MENU_CONTENT_INPUTS,
  outputs: DEFAULT_CONTEXT_MENU_CONTENT_OUTPUTS,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-context-menu-content]': 'true'
  }
})
export class OContextMenuContentComponent implements AfterViewInit, OnInit {

  public menuItems: any[] = [];
  public overlay: OverlayRef;
  public data: any;
  public execute: EventEmitter<{ event: Event, data: any, menuItem: OContextMenuItemComponent }> = new EventEmitter();
  public close: EventEmitter<void> = new EventEmitter<void>();


  @ContentChildren(OComponentMenuItems) public oContextMenuItems: QueryList<OComponentMenuItems>;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild(OWrapperContentMenuComponent) menu: OWrapperContentMenuComponent;


  constructor(
    protected injector: Injector,
    protected menuService: OContextMenuService
  ) { }

  ngAfterViewInit() {
    this.trigger.openMenu();
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.setData(this.menuItems);
  }

  setData(items) {
    items.forEach(menuItem => {
      if (this.data) {
        menuItem.data = this.data;
        if (menuItem.children && menuItem.children.length > 0) {
          this.setData(menuItem.children);
        }
      }
    });
  }

  onMenuClosed(event) {
    this.close.emit();
  }


}
