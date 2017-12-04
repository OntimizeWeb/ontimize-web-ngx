import { ElementRef, Injector, NgModule, Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OSharedModule } from '../../../shared';
import { AppMenuService, MenuGroup } from '../../../services';
import { InputConverter } from '../../../decorators';
import { OAppSidenavMenuItemModule } from '../menu-item/o-app-sidenav-menu-item.component';

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
  encapsulation: ViewEncapsulation.None
})
export class OAppSidenavMenuGroupComponent {
  // implements OnInit
  public static DEFAULT_INPUTS_O_APP_SIDENAV_MENU_GROUP = DEFAULT_INPUTS_O_APP_SIDENAV_MENU_GROUP;
  public static DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_GROUP = DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_GROUP;

  protected appMenuService: AppMenuService;

  public menuGroup: MenuGroup;

  @InputConverter()
  sidenavOpened: boolean = true;

  constructor(
    protected injector: Injector,
    protected elRef: ElementRef
  ) {
    this.appMenuService = this.injector.get(AppMenuService);
  }

  onClick() {
    this.menuGroup.opened = !this.menuGroup.opened;
  }
}

@NgModule({
  imports: [
    CommonModule,
    OSharedModule,
    OAppSidenavMenuItemModule
  ],
  declarations: [
    OAppSidenavMenuGroupComponent
  ],
  exports: [OAppSidenavMenuGroupComponent]
})
export class OAppSidenavMenuGroupModule { }


