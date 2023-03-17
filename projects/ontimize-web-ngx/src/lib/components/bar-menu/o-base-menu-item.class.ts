import { ElementRef, HostListener, Injector, OnDestroy, OnInit, Directive } from '@angular/core';
import { Subscription } from 'rxjs';

import { OTranslateService } from '../../services/translate/o-translate.service';
import { OPermissions } from '../../types/o-permissions.type';
import { PermissionsUtils } from '../../util/permissions';
import { Util } from '../../util/util';
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

@Directive({
  inputs: DEFAULT_INPUTS_O_BASE_MENU_ITEM
})
export class OBaseMenuItemClass implements OnInit, OnDestroy {

  protected translateService: OTranslateService;
  protected onLanguageChangeSubscription: Subscription;

  protected permissions: OPermissions;
  protected mutationObserver: MutationObserver;

  title: string;
  tooltip: string;
  icon: string;
  restricted: boolean;
  disabled: boolean;
  protected _isHovered: boolean = false;
  attr: string;

  @HostListener('mouseover') onMouseover = () => this.isHovered = true;
  @HostListener('mouseout') onMouseout = () => this.isHovered = false;

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
    const tooltip = this.translateService.get(this.tooltip);
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
