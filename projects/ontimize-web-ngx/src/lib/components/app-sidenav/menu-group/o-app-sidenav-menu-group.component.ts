import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {Subscription } from 'rxjs';

import { InputConverter } from '../../../decorators/input-converter';
import { MenuGroup } from '../../../interfaces/app-menu.interface';
import { AppMenuService } from '../../../services/app-menu.service';
import { PermissionsService } from '../../../services/permissions/permissions.service';
import { OTranslateService } from '../../../services/translate/o-translate.service';
import { OPermissions } from '../../../types/o-permissions.type';
import { PermissionsUtils } from '../../../util/permissions';
import { Util } from '../../../util/util';
import { OAppSidenavComponent } from '../o-app-sidenav.component';

export const DEFAULT_INPUTS_O_APP_SIDENAV_MENU_GROUP = [
  'menuGroup : menu-group',
  'sidenavOpened : sidenav-opened',
  'level'
];

export const DEFAULT_OUTPUTS_O_APP_SIDENAV_MENU_GROUP = [
  'onItemClick'
];

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
      transition('collapsed => expanded', animate('200ms ease-in')),
      transition('expanded => collapsed', animate('200ms ease-out'))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'getClass()',
    '[attr.disabled]': 'disabled'
  }
})
export class OAppSidenavMenuGroupComponent implements OnInit, AfterViewInit, OnDestroy {

  public onItemClick: EventEmitter<any> = new EventEmitter<any>();
  public onClickEvent: EventEmitter<any> = new EventEmitter<any>();

  protected translateService: OTranslateService;
  protected permissionsService: PermissionsService;

  public appMenuService: AppMenuService;
  public sidenav: OAppSidenavComponent;
  protected sidenavSubscription: Subscription = new Subscription();
  protected permissions: OPermissions;
  protected mutationObserver: MutationObserver;

  public menuGroup: MenuGroup;

  @InputConverter()
  sidenavOpened: boolean = true;

  @InputConverter()
  level: number = 1;

  hidden: boolean;
  disabled: boolean;
  protected _contentExpansion;

  constructor(
    protected injector: Injector,
    protected elRef: ElementRef,
    protected cd: ChangeDetectorRef
  ) {
    this.translateService = this.injector.get(OTranslateService);
    this.appMenuService = this.injector.get(AppMenuService);
    this.permissionsService = this.injector.get(PermissionsService);
    this.sidenav = this.injector.get(OAppSidenavComponent);
  }

  ngOnInit() {
    this.parsePermissions();
  }

  ngAfterViewInit() {
    if (this.menuGroup.id === 'user-info' && this.sidenav) {
      const self = this;
      this.sidenavSubscription.add(this.sidenav.onSidenavOpenedChange.subscribe((opened) => {
        self.disabled = ((!opened && Util.isDefined(opened)) || (Util.isDefined(self.permissions) && self.permissions && self.permissions.enabled === false));
        self.updateContentExpansion();
        self.cd.markForCheck();
      }));
    }
    this.updateContentExpansion();
  }

  ngOnDestroy() {
    if (this.sidenavSubscription) {
      this.sidenavSubscription.unsubscribe();
    }
  }

  protected parsePermissions() {
    // if oattr in form, it can have permissions
    this.permissions = this.permissionsService.getMenuPermissions(this.menuGroup.id);
    if (!Util.isDefined(this.permissions)) {
      return;
    }
    this.hidden = this.permissions.visible === false;
    this.disabled = this.permissions.enabled === false;

    if (this.disabled) {
      this.mutationObserver = PermissionsUtils.registerDisabledChangesInDom(this.elRef.nativeElement, {
        checkStringValue: true
      });
    }
  }

  onClick() {
    if (this.disabled) {
      return;
    }

    this.menuGroup.opened = !this.menuGroup.opened;
    this.appMenuService.onClick.next();
    this.updateContentExpansion();
  }

  updateContentExpansion() {
    let isOpened = this.menuGroup && this.menuGroup.opened;
    if (this.menuGroup.id === 'user-info') {
      isOpened = (this.sidenav && this.sidenav.sidenav && this.sidenav.sidenav.opened) && isOpened;
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

  getClass() {
    let className = 'o-app-sidenav-menu-group o-app-sidenav-menu-group-level-' + this.level;
    if (this.menuGroup.class) {
      className += ' ' + this.menuGroup.class;
    }
    return className;
  }

}
