import { Component, Inject, Injector, forwardRef, ElementRef, Optional, ViewChild, NgModule, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';
import { MatInput } from '@angular/material';

import { OSharedModule } from '../../../shared';
import { NumberConverter } from '../../../decorators';
import { OFormComponent } from '../../form/o-form.component';
import { OFormDataComponent, DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT } from '../../o-form-data-component.class';

export const DEFAULT_INPUTS_O_TEXT_INPUT = [
  ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
  'minLength: min-length',
  'maxLength: max-length'
];

export const DEFAULT_OUTPUTS_O_TEXT_INPUT = [
  ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT
];

@Component({
  moduleId: module.id,
  selector: 'o-text-input',
  templateUrl: './o-text-input.component.html',
  styleUrls: ['./o-text-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_TEXT_INPUT,
  outputs: DEFAULT_OUTPUTS_O_TEXT_INPUT,
  encapsulation: ViewEncapsulation.None
})

export class OTextInputComponent extends OFormDataComponent {

  public static DEFAULT_INPUTS_O_TEXT_INPUT = DEFAULT_INPUTS_O_TEXT_INPUT;
  public static DEFAULT_OUTPUTS_O_TEXT_INPUT = DEFAULT_OUTPUTS_O_TEXT_INPUT;

  protected _minLength: number = -1;
  protected _maxLength: number = -1;

  @ViewChild('matInputRef')
  protected matInputRef: MatInput;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector) {
    super(form, elRef, injector);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = super.resolveValidators();

    if (this.minLength >= 0) {
      validators.push(Validators.minLength(this.minLength));
    }
    if (this.maxLength >= 0) {
      validators.push(Validators.maxLength(this.maxLength));
    }

    return validators;
  }

  set minLength(val: number) {
    const old = this._minLength;
    this._minLength = NumberConverter(val);
    if (val !== old) {
      this.updateValidators();
    }
  }

  get minLength(): number {
    return this._minLength;
  }

  set maxLength(val: number) {
    const old = this._maxLength;
    this._maxLength = NumberConverter(val);
    if (val !== old) {
      this.updateValidators();
    }
  }

  get maxLength(): number {
    return this._maxLength;
  }
}

@NgModule({
  declarations: [OTextInputComponent],
  imports: [OSharedModule, CommonModule],
  exports: [OTextInputComponent]
})
export class OTextInputModule {
}
