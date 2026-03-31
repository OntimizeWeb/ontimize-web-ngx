import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnDestroy,
  Type,
  ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs';

import { MenuGroup } from '../../interfaces/app-menu.interface';
import { PermissionsService } from '../../services';
import { AppMenuService } from '../../services/app-menu.service';
import { OTranslateService } from '../../services/translate/o-translate.service';
import { OPermissions } from '../../types';
import { MenuRootItem } from '../../types/menu-root-item.type';

export const DEFAULT_INPUTS_O_MENU_LAYOUT = [
  'parentMenuId : parent-menu-id',
  'excludeMenusId : exclude-menus-id'
];

export const DEFAULT_OUTPUTS_O_MENU_LAYOUT = [
];

@Component({
  selector: 'o-card-menu-layout',
  templateUrl: './o-card-menu-layout.component.html',
  styleUrls: ['./o-card-menu-layout.component.scss'],
  inputs: DEFAULT_INPUTS_O_MENU_LAYOUT,
  outputs: DEFAULT_OUTPUTS_O_MENU_LAYOUT,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class.o-menu-layout]': 'true'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OCardMenuLayoutComponent implements AfterViewInit, OnDestroy {

  protected translateService: OTranslateService;
  protected translateServiceSubscription: Subscription;
  protected appMenuService: AppMenuService;
  protected menuRoots: MenuRootItem[];
  protected cardItemsArray: MenuRootItem[];
  protected parentMenuId: string;
  protected excludeMenusId: string;
  protected permissions: OPermissions;
  protected permissionsService: PermissionsService;
  protected parentMenuIds: string[];
  protected excludeIds: string[];

  hidden: boolean;

  constructor(
    private injector: Injector,
    private cd: ChangeDetectorRef
  ) {
    this.translateService = this.injector.get(OTranslateService);
    this.appMenuService = this.injector.get(AppMenuService);
    this.menuRoots = this.appMenuService.getMenuRoots();
    this.permissionsService = this.injector.get<PermissionsService>(PermissionsService as Type<PermissionsService>);

    this.translateServiceSubscription = this.translateService.onLanguageChanged.subscribe(() => {
      this.cd.detectChanges();
    });
  }

  public ngAfterViewInit(): void {
    this.setCardMenuItems();
  }

  public ngOnDestroy(): void {
    if (this.translateServiceSubscription) {
      this.translateServiceSubscription.unsubscribe();
    }
  }

  public setCardMenuItems(): void {
    let cardItemsAux = [];
    if (!this.parentMenuId) {
      cardItemsAux = this.menuRoots.filter(item => !this.appMenuService.isMenuGroup(item));
    } else {

      this.parentMenuIds = (this.parentMenuId || '').split(';').map(id => id.trim());
      this.excludeIds = (this.excludeMenusId || '').split(';').map(id => id.trim());

      cardItemsAux = this.getItemsFilteredByParentId(this.menuRoots, this.parentMenuIds);
    }

    this.cardItems = cardItemsAux;
  }

  get cardItems(): MenuRootItem[] {
    return this.cardItemsArray;
  }

  set cardItems(val: MenuRootItem[]) {
    this.cardItemsArray = val;
    this.cd.detectChanges();
  }

  protected getItemsFilteredByParentId(array: MenuRootItem[], parentMenuIds: string[]): MenuRootItem[] {
    let result: MenuRootItem[] = [];
    const groups = array.filter(item => this.appMenuService.isMenuGroup(item));

    parentMenuIds.forEach(parentMenuId => {
      for (let i = 0, len = groups.length; i < len; i++) {
        const menuGroup = groups[i] as MenuGroup;
        if (menuGroup.id === parentMenuId) {
          let permissions = this.permissionsService.getMenuPermissions(parentMenuId);
          menuGroup.items.forEach(item => {
            let hidden = permissions?.visible === false || this.excludeIds.includes(item.id);

            item['show-in-card-menu'] = !hidden;
          });
          result = result.concat(menuGroup.items);
          break;
        } else {
          const childResult = this.getItemsFilteredByParentId(menuGroup.items, [parentMenuId]);
          if (childResult.length) {
            result = result.concat(childResult);
            break;
          }
        }
      }
    });

    return result;
  }


}
