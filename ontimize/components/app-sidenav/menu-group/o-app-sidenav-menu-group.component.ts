import { ElementRef, Injector, NgModule, Component, ViewEncapsulation, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs/Subscription';

import { OSharedModule } from '../../../shared';
import { AppMenuService, MenuGroup } from '../../../services';
import { InputConverter } from '../../../decorators';
import { OAppSidenavMenuItemModule } from '../menu-item/o-app-sidenav-menu-item.component';
import { OAppSidenavComponent } from '../o-app-sidenav.component';

export const DEFAULT_INPUTS_O_APP_SIDENAV_MENU_GROUP = [
  'menuGroup : menu-group',
  'sidenavOpened : sidenav-opened'
];

export const DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_GROUP = [];

@Component({
  selector: 'o-app-sidenav-menu-group',
  inputs: DEFAULT_INPUTS_O_APP_SIDENAV_MENU_GROUP,
  outputs: DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_GROUP,
  templateUrl: './o-app-sidenav-menu-group.component.html',
  styleUrls: ['./o-app-sidenav-menu-group.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('contentExpansion', [
      state('collapsed', style({ height: '0px' })),
      state('expanded', style({ height: '*' })),
      transition('collapsed => expanded', animate('500ms ease-in')),
      transition('expanded => collapsed', animate('500ms ease-out'))
    ])
  ]
})
export class OAppSidenavMenuGroupComponent implements AfterViewInit, OnDestroy {

  public static DEFAULT_INPUTS_O_APP_SIDENAV_MENU_GROUP = DEFAULT_INPUTS_O_APP_SIDENAV_MENU_GROUP;
  public static DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_GROUP = DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_GROUP;

  appMenuService: AppMenuService;
  protected sidenav: OAppSidenavComponent;
  protected sidenavSubscription: Subscription;

  public menuGroup: MenuGroup;

  @InputConverter()
  sidenavOpened: boolean = true;

  disabled: boolean = false;
  protected _contentExpansion = 'collapsed';

  constructor(
    protected injector: Injector,
    protected elRef: ElementRef
  ) {
    this.appMenuService = this.injector.get(AppMenuService);
    this.sidenav = this.injector.get(OAppSidenavComponent);
  }

  onClick() {
    this.menuGroup.opened = !this.menuGroup.opened;
    this.contentExpansion = this.menuGroup.opened ? 'expanded' : 'collapsed';
  }

  ngAfterViewInit() {
    if (this.menuGroup.id === 'user-info') {
      const self = this;
      this.sidenavSubscription = this.sidenav.onSidenavToggle.subscribe((opened) => {
        self.disabled = !opened;
      });
    }
  }

  ngOnDestroy() {
    if (this.sidenavSubscription) {
      this.sidenavSubscription.unsubscribe();
    }
  }

  get contentExpansion(): string {
    return this._contentExpansion;
  }

  set contentExpansion(val: string) {
    this._contentExpansion = val;
  }
}

@NgModule({
  imports: [CommonModule, OSharedModule, OAppSidenavMenuItemModule],
  declarations: [OAppSidenavMenuGroupComponent],
  exports: [OAppSidenavMenuGroupComponent]
})
export class OAppSidenavMenuGroupModule { }
