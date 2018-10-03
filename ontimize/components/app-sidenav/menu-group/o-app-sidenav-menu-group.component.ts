import { AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Injector, NgModule, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subscription } from 'rxjs/Subscription';

import { Util } from '../../../utils';
import { OSharedModule } from '../../../shared';
import { InputConverter } from '../../../decorators';
import { OAppSidenavComponent } from '../o-app-sidenav.component';
import { AppMenuService, MenuGroup, OTranslateService } from '../../../services';
import { OAppSidenavMenuItemModule } from '../menu-item/o-app-sidenav-menu-item.component';

export const DEFAULT_INPUTS_O_APP_SIDENAV_MENU_GROUP = [
  'menuGroup : menu-group',
  'sidenavOpened : sidenav-opened'
];

export const DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_GROUP = [
  'onItemClick'
];

@Component({
  moduleId: module.id,
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
      transition('collapsed => expanded', animate('200ms ease-in')),
      transition('expanded => collapsed', animate('200ms ease-out'))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OAppSidenavMenuGroupComponent implements AfterViewInit, OnDestroy {

  public static DEFAULT_INPUTS_O_APP_SIDENAV_MENU_GROUP = DEFAULT_INPUTS_O_APP_SIDENAV_MENU_GROUP;
  public static DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_GROUP = DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_GROUP;

  public onItemClick: EventEmitter<any> = new EventEmitter<any>();

  protected translateService: OTranslateService;

  appMenuService: AppMenuService;
  protected sidenav: OAppSidenavComponent;
  protected sidenavSubscription: Subscription;

  public menuGroup: MenuGroup;

  @InputConverter()
  sidenavOpened: boolean = true;

  disabled: boolean = false;
  protected _contentExpansion;

  constructor(
    protected injector: Injector,
    protected elRef: ElementRef,
    protected cd: ChangeDetectorRef
  ) {
    this.translateService = this.injector.get(OTranslateService);
    this.appMenuService = this.injector.get(AppMenuService);
    this.sidenav = this.injector.get(OAppSidenavComponent);
  }

  onClick() {
    this.menuGroup.opened = !this.menuGroup.opened;
    this.updateContentExpansion();
  }

  ngAfterViewInit() {
    if (this.menuGroup.id === 'user-info') {
      const self = this;
      this.sidenavSubscription = this.sidenav.sidenav.openedChange.subscribe((opened) => {
        self.disabled = !opened;
        self.updateContentExpansion();
      });
    }
    this.updateContentExpansion();
  }

  ngOnDestroy() {
    if (this.sidenavSubscription) {
      this.sidenavSubscription.unsubscribe();
    }
  }

  updateContentExpansion() {
    let isOpened = this.menuGroup && this.menuGroup.opened;
    if (this.menuGroup.id === 'user-info') {
      isOpened = (this.sidenav && this.sidenav.sidenav.opened) && isOpened;
    }
    this.contentExpansion = isOpened ? 'expanded' : 'collapsed';
  }

  get contentExpansion(): string {
    return this._contentExpansion;
  }

  set contentExpansion(val: string) {
    this._contentExpansion = val;
    this.cd.detectChanges();
  }

  get tooltip() {
    let result = this.translateService.get(this.menuGroup.name);
    if (Util.isDefined(this.menuGroup.tooltip)) {
      result += ': ' + this.translateService.get(this.menuGroup.tooltip);
    }
    return result;
  }

  onMenuItemClick(e: Event): void {
    this.onItemClick.emit(e);
  }

}

@NgModule({
  imports: [CommonModule, OAppSidenavMenuItemModule, OSharedModule],
  declarations: [OAppSidenavMenuGroupComponent],
  exports: [OAppSidenavMenuGroupComponent]
})
export class OAppSidenavMenuGroupModule { }
