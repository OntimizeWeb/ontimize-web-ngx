import { Injector } from '@angular/core';

import { BooleanConverter } from '../decorators/input-converter';
import { IComponent } from '../interfaces/component.interface';
import { OTranslateService } from '../services/translate/o-translate.service';
import { OPermissions } from '../types/o-permissions.type';
import { PermissionsUtils } from '../util/permissions';
import { Util } from '../util/util';

export class OBaseComponent implements IComponent {

  /* Inputs */
  protected oattr: string;
  protected _olabel: string;
  protected oplaceholder: string;
  protected _enabled: boolean = true;
  protected _readOnly: boolean;
  protected _orequired: boolean = false;

  /* Internal variables */
  protected injector: Injector;
  protected translateService: OTranslateService;

  protected _isReadOnly: boolean;
  protected _tooltip: string;
  protected _tooltipPosition: string = 'below';
  protected _tooltipShowDelay: number = 500;
  protected _tooltipHideDelay: number = 0;
  protected permissions: OPermissions;

  constructor(injector: Injector) {
    this.injector = injector;
    if (this.injector) {
      this.translateService = this.injector.get<OTranslateService>(OTranslateService);
    }
  }

  public initialize(): void {
    if (!Util.isDefined(this._olabel)) {
      this._olabel = this.oattr;
    }
    if (Util.isDefined(this.oplaceholder) && this.oplaceholder.length > 0) {
      this.oplaceholder = this.translateService.get(this.oplaceholder);
    }
  }

  public getAttribute(): string {
    if (this.oattr) {
      return this.oattr;
    }
    return undefined;
  }

  public setEnabled(value: boolean): void {
    if (!PermissionsUtils.checkEnabledPermission(this.permissions)) {
      return;
    }
    const parsedValue = BooleanConverter(value);
    this._enabled = parsedValue;
  }

  get placeHolder(): string {
    return this.oplaceholder;
  }

  set placeHolder(value: string) {
    this.oplaceholder = value;
  }

  get tooltipClass(): string {
    return this.getTooltipClass();
  }

  protected getTooltipClass(): string {
    return `o-tooltip ${this.tooltipPosition}`;
  }

  protected getTooltipText(): string {
    if (Util.isDefined(this._tooltip) && this.translateService) {
      return this.translateService.get(this._tooltip);
    }
    return this._tooltip;
  }

  get tooltip(): string {
    return this.getTooltipText();
  }

  set tooltip(value: string) {
    this._tooltip = value;
  }

  get tooltipPosition(): string {
    return this._tooltipPosition;
  }

  set tooltipPosition(value: string) {
    this._tooltipPosition = value;
  }

  get tooltipShowDelay(): number {
    return this._tooltipShowDelay;
  }

  set tooltipShowDelay(value: number) {
    this._tooltipShowDelay = value;
  }

  get tooltipHideDelay(): number {
    return this._tooltipHideDelay;
  }

  set tooltipHideDelay(value: number) {
    this._tooltipHideDelay = value;
  }

  get isReadOnly(): boolean {
    return this._isReadOnly;
  }

  set isReadOnly(value: boolean) {
    this.setIsReadOnly(value);
  }

  protected setIsReadOnly(value: boolean): void {
    // only modifiyng read only state if the component has not its own read-only input
    if (Util.isDefined(this.readOnly)) {
      return;
    }
    if (!this.enabled) {
      this._isReadOnly = false;
      return;
    }
    if (!PermissionsUtils.checkEnabledPermission(this.permissions)) {
      return;
    }
    this._isReadOnly = value;
  }

  get readOnly(): any {
    return this._readOnly;
  }

  set readOnly(value: any) {
    if (!PermissionsUtils.checkEnabledPermission(this.permissions)) {
      return;
    }
    const parsedValue = BooleanConverter(value);
    this._readOnly = parsedValue;
    this._isReadOnly = parsedValue;
  }

  set orequired(val: boolean) {
    this._orequired = BooleanConverter(val);
  }

  get orequired(): boolean {
    return this._orequired;
  }

  get isRequired(): boolean {
    return this.orequired;
  }

  set required(value: boolean) {
    this.orequired = value;
  }

  get enabled(): any {
    return this._enabled;
  }

  set enabled(value: any) {
    const parsedValue = BooleanConverter(value);
    this.setEnabled(parsedValue);
  }

  get olabel(): string {
    return this._olabel;
  }

  set olabel(value: string) {
    this._olabel = value;
  }

}
