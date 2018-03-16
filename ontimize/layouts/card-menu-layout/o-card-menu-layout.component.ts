import { Component, OnInit, ViewEncapsulation, AfterViewInit, NgModule, Injector, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { OTranslateService, AppMenuService, MenuRootItem, MenuGroup } from '../../services';
import { OSharedModule } from '../../shared/shared.module';
import { OCardMenuItemModule } from '../../components/card-menu-item/o-card-menu-item.component';

export const DEFAULT_INPUTS_O_MENU_LAYOUT = [
  'parentMenuId : parent-menu-id'
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
export class OCardMenuLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  public static DEFAULT_INPUTS_O_MENU_LAYOUT = DEFAULT_INPUTS_O_MENU_LAYOUT;
  public static DEFAULT_OUTPUTS_O_MENU_LAYOUT = DEFAULT_OUTPUTS_O_MENU_LAYOUT;

  protected translateService: OTranslateService;
  protected translateServiceSubscription: Subscription;
  protected appMenuService: AppMenuService;
  protected menuRoots: MenuRootItem[];
  protected cardItemsArray: MenuRootItem[];

  protected parentMenuId: string;

  constructor(
    private injector: Injector,
    private cd: ChangeDetectorRef
  ) {
    this.translateService = this.injector.get(OTranslateService);
    this.appMenuService = this.injector.get(AppMenuService);
    this.menuRoots = this.appMenuService.getMenuRoots();

    this.translateServiceSubscription = this.translateService.onLanguageChanged.subscribe(() => {
      this.cd.detectChanges();
    });
  }

  ngOnInit() {
    //
  }

  ngAfterViewInit() {
    this.setCardMenuItems();
  }

  ngOnDestroy() {
    if (this.translateServiceSubscription) {
      this.translateServiceSubscription.unsubscribe();
    }
  }

  setCardMenuItems() {
    let cardItemsAux = [];
    if (!this.parentMenuId) {
      cardItemsAux = this.menuRoots.filter((item) => !this.appMenuService.isMenuGroup(item));
    } else {
      cardItemsAux = this.getItemsFilteredByParentId(this.menuRoots);
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

  private getItemsFilteredByParentId(array: MenuRootItem[]): MenuRootItem[] {
    let result: MenuRootItem[] = undefined;
    const groups = array.filter((item) => this.appMenuService.isMenuGroup(item));

    for (let i = 0, len = groups.length; i < len; i++) {
      const menuGroup = (groups[i] as MenuGroup);
      if (menuGroup.id === this.parentMenuId) {
        result = menuGroup.items;
        break;
      } else {
        result = this.getItemsFilteredByParentId(menuGroup.items);
      }
    }
    return result;
  }
}

@NgModule({
  declarations: [OCardMenuLayoutComponent],
  imports: [OSharedModule, CommonModule, OCardMenuItemModule],
  exports: [OCardMenuLayoutComponent]
})
export class OCardMenuLayoutModule {
}
