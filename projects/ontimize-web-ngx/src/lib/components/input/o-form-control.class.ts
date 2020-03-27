import { AbstractControlOptions, AsyncValidatorFn, FormControl, ValidatorFn } from '@angular/forms';

import { OFormDataComponent } from '../o-form-data-component.class';

export class OFormControl extends FormControl {
  public fControlChildren: (FormControl | OFormDataComponent)[];

  constructor(
    formState: any = null,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(formState, validatorOrOpts, asyncValidator);
  }

  markAsTouched(opts: { onlySelf?: boolean } = {}): void {
    super.markAsTouched(opts);
    if (!this.fControlChildren) {
      return;
    }
    this.fControlChildren.forEach(x => {
      if (x instanceof FormControl) {
        x.markAsTouched(opts);
      } else if (x.getFormControl()) {
        x.getFormControl().markAsTouched();
      }
    });
  }

  markAsDirty(opts: { onlySelf?: boolean } = {}): void {
    super.markAsDirty(opts);
    if (!this.fControlChildren) {
      return;
    }
    this.fControlChildren.forEach(x => {
      if (x instanceof FormControl) {
        x.markAsDirty(opts);
      } else if (x.getFormControl()) {
        x.getFormControl().markAsDirty();
      }
    });
  }

  markAsPristine(opts: { onlySelf?: boolean } = {}): void {
    super.markAsPristine(opts);
    if (!this.fControlChildren) {
      return;
    }
    this.fControlChildren.forEach(x => {
      if (x instanceof FormControl) {
        x.markAsPristine(opts);
      } else if (x.getFormControl()) {
        x.getFormControl().markAsPristine();
      }
    });
  }

  getValue() {
    return this.value;
  }

  /**setValue(value: any, options: { } => Not override this method because there is a case where the children have a different value than the main one
   */
}
