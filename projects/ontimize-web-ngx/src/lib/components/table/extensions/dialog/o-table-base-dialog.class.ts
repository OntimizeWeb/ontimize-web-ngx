
import { Injector, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Codes, Util } from '../../../../utils';
import { O_MAT_ERROR_OPTIONS, OMatErrorComponent, OMatErrorOptions } from '../../../../shared';

export class OTableBaseDialogClass {

  protected errorOptions: OMatErrorOptions;
  @ViewChildren(OMatErrorComponent)
  protected oMatErrorChildren: QueryList<OMatErrorComponent>;
  protected formControl: AbstractControl;

  constructor(
    protected injector: Injector
  ) {
    try {
      this.errorOptions = this.injector.get(O_MAT_ERROR_OPTIONS) || {};
    } catch (e) {
      this.errorOptions = {};
    }
  }

  protected setFormControl(formControl: AbstractControl) {
    this.formControl = formControl;
  }

  get tooltipClass(): string {
    let result: string;
    const liteError = this.errorOptions.type === Codes.O_MAT_ERROR_LITE;
    if (liteError && Util.isDefined(this.formControl) && this.formControlHasErrors()) {
      result = `o-tooltip o-mat-error`;
    }
    return result;
  }

  get tooltipText(): string {
    let result: string;
    const liteError = this.errorOptions.type === Codes.O_MAT_ERROR_LITE;
    if (liteError && this.formControlHasErrors() && this.oMatErrorChildren && this.oMatErrorChildren.length > 0) {
      result = '';
      this.oMatErrorChildren.forEach((oMatError: OMatErrorComponent) => {
        result += `${oMatError.text}\n`;
      });
    }
    return result;
  }

  protected formControlHasErrors(): boolean {
    return Util.isDefined(this.formControl) && this.formControl.touched && Util.isDefined(this.formControl.errors);
  }
}
