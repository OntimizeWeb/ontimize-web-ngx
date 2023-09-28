import { Component } from "@angular/core";
import { ODialogBase } from "./o-dialog-base.class";
import type { ODialogConfig } from "./o-dialog.config";
import { MatDialogRef } from "@angular/material/dialog";
import { OTranslateService } from "../../../services/translate/o-translate.service";

@Component({
  selector: 'app-local-dialog',
  templateUrl: './o-dialog-internal.component.html',
})
export class ODialogInternalComponent {

  protected static DEFAULT_OK_BUTTON_TEXT = 'OK';
  protected static DEFAULT_CANCEL_BUTTON_TEXT = 'CANCEL';

  protected _title: string;
  protected _message: string;
  protected _okButtonText: string;
  protected _cancelButtonText: string;
  protected _twoOptions: boolean;
  protected _useIcon: boolean;
  protected _icon: string;
  protected _alertType: string;

  constructor(
    public dialogRef: MatDialogRef<ODialogInternalComponent>, private translateService: OTranslateService) {

  }

  onOkClick() {
    if (this.dialogRef) {
      this.dialogRef.close(true);
    }
  }

  public alert(title: string, message: string, config?: ODialogConfig) {
    config = this.ensureConfig(config);
    this.configureDefaultAlert(title, message, config);
  }

  public confirm(title: string, message: string, config?: ODialogConfig) {
    config = this.ensureConfig(config);
    this.configureDefaultAlert(title, message, config);
    this.twoOptions = true;
  }

  /* Utility methods */
  protected ensureConfig(config: ODialogConfig): ODialogConfig {
    if (!config) {
      config = {};
    }
    return config;
  }
  public getTranslation(value: string): string {
    return this.translateService.get(value);
  }
  protected configureDefaultAlert(title: string, message: string, config?: ODialogConfig) {
    this.twoOptions = false;
    this.title = title;
    this.message = message;

    this.icon = (typeof (config.icon) !== 'undefined') ? config.icon : undefined;
    if (this.icon !== undefined) {
      this.useIcon = true;
    }
    this.alertType = config.alertType;

    this.okButtonText = (typeof (config.okButtonText) !== 'undefined') ? config.okButtonText : ODialogInternalComponent.DEFAULT_OK_BUTTON_TEXT;
    this.cancelButtonText = (typeof (config.cancelButtonText) !== 'undefined') ? config.cancelButtonText : ODialogInternalComponent.DEFAULT_CANCEL_BUTTON_TEXT;
  }

  get isInfo(): boolean {
    return this.alertType === 'info';
  }

  get isWarn(): boolean {
    return this.alertType === 'warn';
  }

  get isError(): boolean {
    return this.alertType === 'error';
  }

  get title(): string {
    return this._title;
  }

  set title(val: string) {
    this._title = val;
  }

  get message(): string {
    return this._message;
  }

  set message(val: string) {
    this._message = val;
  }

  get okButtonText(): string {
    return this._okButtonText;
  }

  set okButtonText(val: string) {
    this._okButtonText = val;
  }

  get cancelButtonText(): string {
    return this._cancelButtonText;
  }

  set cancelButtonText(val: string) {
    this._cancelButtonText = val;
  }

  get icon(): string {
    return this._icon;
  }

  set icon(val: string) {
    this._icon = val;
  }

  get alertType(): string {
    return this._alertType;
  }

  set alertType(val: string) {
    this._alertType = val;
  }


  get twoOptions(): boolean {
    return this._twoOptions;
  }

  set twoOptions(val: boolean) {
    this._twoOptions = val;
  }

  get useIcon(): boolean {
    return this._useIcon;
  }

  set useIcon(val: boolean) {
    this._useIcon = val;
  }


}