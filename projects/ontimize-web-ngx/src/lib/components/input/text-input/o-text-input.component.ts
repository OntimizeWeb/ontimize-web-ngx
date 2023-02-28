import { Component, ContentChildren, ElementRef, forwardRef, Inject, Injector, OnInit, Optional, QueryList, ViewEncapsulation } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';

import { NumberConverter } from '../../../decorators/input-converter';
import { OFormComponent } from '../../form/o-form.component';
import {
  DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
  DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT,
  OFormDataComponent
} from '../../o-form-data-component.class';
import { OMatPrefix } from '../../../directives/o-mat-prefix.directive';
import { OMatSuffix } from '../../../directives/o-mat-suffix.directive';

export const DEFAULT_INPUTS_O_TEXT_INPUT = [
  ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
  'minLength: min-length',
  'maxLength: max-length'
];

export const DEFAULT_OUTPUTS_O_TEXT_INPUT = [
  ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT
];

@Component({
  selector: 'o-text-input',
  templateUrl: './o-text-input.component.html',
  styleUrls: ['./o-text-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_TEXT_INPUT,
  outputs: DEFAULT_OUTPUTS_O_TEXT_INPUT,
  encapsulation: ViewEncapsulation.None
})

export class OTextInputComponent extends OFormDataComponent implements OnInit {

  @ContentChildren(OMatPrefix) _prefixChildren: QueryList<OMatPrefix>;
  @ContentChildren(OMatSuffix) _suffixChildren: QueryList<OMatSuffix>;

  protected _minLength: number = -1;
  protected _maxLength: number = -1;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  resolveValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = super.resolveValidators();

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
