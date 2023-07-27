import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Inject,
  Injector,
  OnInit,
  Optional,
  ViewEncapsulation
} from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';

import { InputConverter } from '../../../decorators/input-converter';
import { IIntegerPipeArgument, OIntegerPipe } from '../../../pipes/o-integer.pipe';
import { FormValueOptions } from '../../../types/form-value-options.type';
import { Util } from '../../../util/util';
import { OValidators } from '../../../validators/o-validators';
import { OFormValue } from '../../form/o-form-value';
import { OFormComponent } from '../../form/o-form.component';
import {
  DEFAULT_INPUTS_O_TEXT_INPUT,
  DEFAULT_OUTPUTS_O_TEXT_INPUT,
  OTextInputComponent
} from '../text-input/o-text-input.component';

const INPUT_TYPE_TEXT = 'text'
const INPUT_TYPE_NUMBER = 'number'
type HTMLInputType = 'text' | 'number'

export const DEFAULT_INPUTS_O_INTEGER_INPUT = [
  ...DEFAULT_INPUTS_O_TEXT_INPUT,
  'min',
  'max',
  'step',
  'grouping',
  'thousandSeparator : thousand-separator',
  'olocale : locale'
];

export const DEFAULT_OUTPUTS_O_INTEGER_INPUT = [
  ...DEFAULT_OUTPUTS_O_TEXT_INPUT
];

@Component({
  selector: 'o-integer-input',
  templateUrl: './o-integer-input.component.html',
  styleUrls: ['./o-integer-input.component.scss'],
  inputs: DEFAULT_INPUTS_O_INTEGER_INPUT,
  outputs: DEFAULT_OUTPUTS_O_INTEGER_INPUT,
  encapsulation: ViewEncapsulation.None
})
export class OIntegerInputComponent extends OTextInputComponent implements AfterViewInit, OnInit {

  inputType: HTMLInputType = INPUT_TYPE_NUMBER;

  @InputConverter()
  min: number;
  @InputConverter()
  max: number;
  @InputConverter()
  step: number = 1;

  @InputConverter()
  protected grouping: boolean = false;
  protected thousandSeparator: string;
  protected olocale: string;

  protected componentPipe: OIntegerPipe;
  protected pipeArguments: IIntegerPipeArgument;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
    this._defaultSQLTypeKey = 'INTEGER';
    this.inputType = INPUT_TYPE_TEXT;
    this.setComponentPipe();
  }

  initialize(): void {
    super.initialize();
    this.initializeStep();
  }

  setComponentPipe() {
    this.componentPipe = new OIntegerPipe(this.injector);
  }

  ngOnInit() {
    super.ngOnInit();

    this.pipeArguments = {
      grouping: this.grouping,
      thousandSeparator: this.thousandSeparator,
      locale: this.olocale
    };

    if (this.step === undefined) {
      this.step = 1;
    }
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  setData(value: any) {
    super.setData(value);
    setTimeout(() => {
      this.setPipeValue();
    }, 0);
  }

  setValue(val: any, options?: FormValueOptions) {
    super.setValue(val, options);
    this.setPipeValue();
  }

  innerOnFocus(event: FocusEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.isReadOnly) {
      return;
    }
    super.innerOnFocus(event);
    this.setNumberDOMValue(this.getValue());
    if (this.selectAllOnClick) {
      this.selectValue();
    }
  }

  innerOnBlur(event?: any) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (this.isReadOnly) {
      return;
    }
    this.setPipeValue();
    const formControl: FormControl = this.getControl();
    if (formControl) {
      formControl.updateValueAndValidity({ emitEvent: false });
    }
    super.innerOnBlur(event);
  }

  setPipeValue() {
    if (typeof this.pipeArguments !== 'undefined' && !this.isEmpty()) {
      const parsedValue = this.componentPipe.transform(this.getValue(), this.pipeArguments);
      this.setTextDOMValue(parsedValue);
    }
  }

  isEmpty(): boolean {
    if (this.value instanceof OFormValue) {
      if (this.value.value !== undefined) {
        return false;
      }
    }
    return true;
  }

  getInputEl() {
    let inputElement;
    if (this.elRef.nativeElement.tagName === 'INPUT') {
      inputElement = this.elRef.nativeElement;
    } else {
      inputElement = this.elRef.nativeElement.getElementsByTagName('INPUT')[0];
    }
    return inputElement;
  }

  setNumberDOMValue(val: any) {
    this.setInputTypeAndValue(INPUT_TYPE_NUMBER, val)
  }

  setTextDOMValue(val: any) {
    this.setInputTypeAndValue(INPUT_TYPE_TEXT, val)
  }

  resolveValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = super.resolveValidators();
    if (Util.isDefined(this.min)) {
      validators.push(OValidators.createMinValidator(this.min));
    }
    if (Util.isDefined(this.max)) {
      validators.push(OValidators.createMaxValidator(this.max));
    }
    return validators;
  }

  protected initializeStep(): void {
    if (this.step <= 0) {
      this.step = 1;
      console.warn('`step` attribute must be greater than zero');
    }
  }

  protected setInputTypeAndValue(inputType: HTMLInputType, value: any): void {
    const inputElement = this.getInputEl();
    if (Util.isDefined(inputElement)) {
      inputElement.type = inputType;
      inputElement.value = (value !== undefined) ? value : '';
    }
  }
}
