import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Type,
  ViewEncapsulation
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { BooleanInputConverter } from '../../../decorators/input-converter';
import { MenuSection } from '../../../interfaces/app-menu.interface';
import { OTranslatePipe } from '../../../pipes/o-translate.pipe';
import { AppMenuService } from '../../../services/app-menu.service';
import { PermissionsService } from '../../../services/permissions/permissions.service';
import { OPermissions } from '../../../types/o-permissions.type';
import { Util } from '../../../util/util';
import { OAppSidenavMenuGroupComponent } from '../menu-group/o-app-sidenav-menu-group.component';
import { OAppSidenavMenuItemComponent } from '../menu-item/o-app-sidenav-menu-item.component';

export const DEFAULT_INPUTS_O_APP_SIDENAV_MENU_SECTION = [
  'menuSection : menu-section',
  'sidenavOpened : sidenav-opened'
];

export const DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_SECTION = [
  'onItemClick'
];

@Component({
  standalone: true,
  imports: [MatIconModule, MatListModule, OTranslatePipe, OAppSidenavMenuItemComponent, OAppSidenavMenuGroupComponent],
  selector: 'o-app-sidenav-menu-section',
  inputs: DEFAULT_INPUTS_O_APP_SIDENAV_MENU_SECTION,
  outputs: DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_SECTION,
  templateUrl: './o-app-sidenav-menu-section.component.html',
  styleUrls: ['./o-app-sidenav-menu-section.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'getClass()'
  }
})
export class OAppSidenavMenuSectionComponent implements OnInit {

  public onItemClick: EventEmitter<any> = new EventEmitter<any>();

  public appMenuService: AppMenuService;
  protected permissionsService: PermissionsService;

  public menuSection: MenuSection;

  @BooleanInputConverter()
  sidenavOpened: boolean = true;

  hidden: boolean;

  constructor(protected injector: Injector) {
    this.appMenuService = this.injector.get<AppMenuService>(AppMenuService as Type<AppMenuService>);
    this.permissionsService = this.injector.get<PermissionsService>(PermissionsService as Type<PermissionsService>);
  }

  ngOnInit() {
    this.parsePermissions();
  }

  /**
   * A menu section is not an interactive element so only the `visible` permission is taken
   * into account, the `enabled` one is ignored.
   */
  protected parsePermissions(): void {
    const permissions: OPermissions = this.permissionsService.getMenuPermissions(this.menuSection.id);
    if (!Util.isDefined(permissions)) {
      return;
    }
    this.hidden = permissions.visible === false;
  }

  onMenuItemClick(e: Event): void {
    this.onItemClick.emit(e);
  }

  getClass(): string {
    let className = 'o-app-sidenav-menu-section';
    if (this.menuSection.class) {
      className += ' ' + this.menuSection.class;
    }
    return className;
  }

}
