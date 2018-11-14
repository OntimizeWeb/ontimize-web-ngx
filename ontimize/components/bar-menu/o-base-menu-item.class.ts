import { OnInit, Injector, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PermissionsUtils } from '../../util/permissions';
import { OTranslateService, OPermissions } from '../../services';
import { Util } from '../../utils';
import { OBarMenuComponent } from './o-bar-menu.component';

export const DEFAULT_INPUTS_O_BASE_MENU_ITEM = [
  // title [string]: menu item title. Default: no value.
  'title',

  // tooltip [string]: menu group tooltip. Default: 'title' value.
  'tooltip',

  // icon [string]: material icon. Default: no value.
  'icon',

  'attr'
];

export class OBaseMenuItemClass implements OnInit, OnDestroy {

  public static DEFAULT_INPUTS_O_BASE_MENU_ITEM = DEFAULT_INPUTS_O_BASE_MENU_ITEM;

  protected translateService: OTranslateService;
  protected onLanguageChangeSubscription: Subscription;

  title: string;
  tooltip: string;
  icon: string;
  restricted: boolean;
  disabled: boolean;
  protected _isHovered: boolean = false;
  attr: string;

  @HostListener('mouseover') onMouseover = () => this.isHovered = true;
  @HostListener('mouseout') onMouseout = () => this.isHovered = false;

  protected permissions: OPermissions;
  protected mutationObserver: MutationObserver;

  constructor(
    protected menu: OBarMenuComponent,
    protected elRef: ElementRef,
    protected injector: Injector) {

    this.translateService = this.injector.get(OTranslateService);
  }

  ngOnInit() {
    if (!this.tooltip) {
      this.tooltip = this.title;
    }
    if (this.translateService) {
      this.onLanguageChangeSubscription = this.translateService.onLanguageChanged.subscribe(() => {
        this.setDOMTitle();
      });
      this.setDOMTitle();
    }
    this.parsePermissions();
  }

  ngOnDestroy(): void {
    if (this.onLanguageChangeSubscription) {
      this.onLanguageChangeSubscription.unsubscribe();
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  setDOMTitle() {
    let tooltip = this.translateService.get(this.tooltip);
    this.elRef.nativeElement.setAttribute('title', tooltip);
  }

  protected parsePermissions() {
    // if oattr in form, it can have permissions
    this.permissions = this.menu.getPermissionsService().getMenuPermissions(this.attr);
    if (!Util.isDefined(this.permissions)) {
      return;
    }
    this.restricted = this.permissions.visible === false;
    this.disabled = this.permissions.enabled === false;

    if (this.disabled) {
      this.mutationObserver = PermissionsUtils.registerDisabledChangesInDom(this.elRef.nativeElement, {
        checkStringValue: true
      });
    }
  }

  get isHovered(): boolean {
    return this._isHovered;
  }

  set isHovered(val: boolean) {
    if (!this.disabled) {
      this._isHovered = val;
    }
  }
}
