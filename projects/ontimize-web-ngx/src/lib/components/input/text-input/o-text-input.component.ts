import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  forwardRef,
  Injector,
  OnDestroy,
  OnInit,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Subscription } from 'rxjs';

import { NumberConverter } from '../../../decorators/input-converter';
import { InputRegulateDirective } from '../../../directives/input-regulate.directive';
import { OMatErrorDirective } from '../../../directives/o-mat-error.directive';
import { OMatPrefix } from '../../../directives/o-mat-prefix.directive';
import { OMatSuffix } from '../../../directives/o-mat-suffix.directive';
import { OTranslatePipe } from '../../../pipes/o-translate.pipe';
import { Util } from '../../../util/util';
import { OFormValue } from '../../form';
import { OFormDataComponent } from '../../o-form-data-component.class';

export const DEFAULT_INPUTS_O_TEXT_INPUT = [
  'minLength: min-length',
  'maxLength: max-length',
  //uppercase | lowercase | default
  'stringCase: string-case',
  'regulatePattern: regulate-pattern'
];


@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatTooltipModule, OMatErrorDirective, InputRegulateDirective, OTranslatePipe],
  selector: 'o-text-input',
  templateUrl: './o-text-input.component.html',
  styleUrls: ['./o-text-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_TEXT_INPUT,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => OTextInputComponent), multi: true }]
})

export class OTextInputComponent extends OFormDataComponent implements OnInit, OnDestroy, AfterViewInit {

  @ContentChildren(OMatPrefix) _prefixChildren: QueryList<OMatPrefix>;
  @ContentChildren(OMatSuffix) _suffixChildren: QueryList<OMatSuffix>;


  public stringCase: string;
  protected _minLength: number;
  protected _maxLength: number;
  protected upperSubscription: Subscription;
  public regulatePattern: string;

  constructor(
    elRef: ElementRef,
    injector: Injector
  ) {
    super(elRef, injector);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  onFormControlChange(value: any) {
    /*
    It is overridden to manage data entry with string-case
    1. The value is transformed if necessary
    2. This transformed value is set to the control so that the change is seen in the view
    3. The onFormControlChange event is emitted with the transformed value
    */
    value = this.transformStringCase(value);
    this._fControl.setValue(value, { emitEvent: false });
    super.onFormControlChange(value);
  }

  protected transformStringCase(value) {
    const stringCaseVariant = this.stringCase || this.oInputsOptions?.stringCase;

    if (Util.isDefined(value) && Util.isDefined(stringCaseVariant) && stringCaseVariant !== 'default') {
      if (value instanceof OFormValue && typeof value.value === 'string') {
        value.value = stringCaseVariant === 'lowercase' ? value.value.toLowerCase() : value.value.toUpperCase();
      } else if (typeof value === 'string') {
        value = stringCaseVariant === 'lowercase' ? value.toLowerCase() : value.toUpperCase();;
      }
    }
    return value;
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

  public ngOnDestroy(): void {
    if (this.upperSubscription) {
      this.upperSubscription.unsubscribe();
    }

    super.ngOnDestroy();
  }


}
