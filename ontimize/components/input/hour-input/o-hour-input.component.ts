import { AfterViewInit, Component, ElementRef, Inject, Injector, NgModule, OnInit, Optional, ViewChild, ViewEncapsulation, forwardRef } from '@angular/core';
import { Codes, Util } from '../../../utils';
import {
  DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
  DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT,
  OFormDataComponent,
  OValueChangeEvent
} from '../../o-form-data-component.class';

import { CommonModule } from '@angular/common';
import { IFormValueOptions } from '../../form/OFormValue';
import { InputConverter } from '../../../decorators/input-converter';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NumberConverter } from '../../../decorators';
import { OFormComponent } from '../../form/form-components';
import { OSharedModule } from '../../../shared';
import { OValidators } from '../../../validators/o-validators';
import { ValidatorFn } from '@angular/forms';
import moment from 'moment';

export type OHourValueType = 'string' | 'timestamp';

export const DEFAULT_INPUTS_O_HOUR_INPUT = [
  'format',
  'textInputEnabled: text-input-enabled',
  'min',
  'max',
  'valueType: value-type',
  ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT
];

export const DEFAULT_OUTPUTS_O_HOUR_INPUT = [
  ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT
];

@Component({
  moduleId: module.id,
  selector: 'o-hour-input',
  templateUrl: './o-hour-input.component.html',
  styleUrls: ['./o-hour-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  outputs: DEFAULT_OUTPUTS_O_HOUR_INPUT,
  inputs: DEFAULT_INPUTS_O_HOUR_INPUT,
  host: {
    '[class.o-hour-input]': 'true'
  }
})
export class OHourInputComponent extends OFormDataComponent implements OnInit, AfterViewInit {

  public static DEFAULT_INPUTS_O_HOUR_INPUT = DEFAULT_INPUTS_O_HOUR_INPUT;
  public static DEFAULT_OUTPUTS_O_HOUR_INPUT = DEFAULT_OUTPUTS_O_HOUR_INPUT;

  @InputConverter()
  public textInputEnabled: boolean = true;
  public min: string;
  public max: string;
  protected _format: number = Codes.TWENTY_FOUR_HOUR_FORMAT;
  protected onKeyboardInputDone = false;
  protected _valueType: OHourValueType = 'timestamp';

  @ViewChild('picker')
  private picker: any; // NgxMaterialTimepickerComponent from ngx-material-timepicker

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
    this._defaultSQLTypeKey = 'TIMESTAMP';
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.modifyPickerMethods();
  }

  public getValue(): any {
    const value = super.getValue();
    // Component value is always string internally, it must be converted to expected type
    if (!Util.isDefined(value) || this.valueType === 'string') {
      return value;
    } else if (this.valueType === 'timestamp') {
      return moment(value, this.formatString).valueOf();
    }
  }

  public onKeyDown(e: KeyboardEvent): void {
    if (!Codes.isHourInputAllowed(e)) {
      e.preventDefault();
    }
  }

  public innerOnBlur(event: any): void {
    if (this.onKeyboardInputDone) {
      this.updateValeOnInputChange(event);
    }
    super.innerOnBlur(event);
  }

  public registerOnFormControlChange(): void {
    // This component does not need this subscription
  }

  get formatString(): string {
    return (this.format === Codes.TWENTY_FOUR_HOUR_FORMAT ? Codes.HourFormat.TWENTY_FOUR : Codes.HourFormat.TWELVE);
  }

  public open(e?: Event): void {
    if (Util.isDefined(e)) {
      e.stopPropagation();
    }
    if (this.picker) {
      this.picker.open();
    }
  }

  public setTimestampValue(value: any, options?: IFormValueOptions): void {
    let parsedValue;
    const momentV = Util.isDefined(value) ? moment(value) : value;
    if (momentV && momentV.isValid()) {
      parsedValue = momentV.utcOffset(0).format(this.formatString);
    }
    this.setValue(parsedValue, options);
  }

  public resolveValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = super.resolveValidators();
    if (this.format === Codes.TWENTY_FOUR_HOUR_FORMAT) {
      validators.push(OValidators.twentyFourHourFormatValidator);
    } else {
      validators.push(OValidators.twelveHourFormatValidator);
    }
    return validators;
  }

  public onFormControlChange(value: any): void {
    if (this.oldValue === value) {
      return;
    }
    super.onFormControlChange(value);
  }

  set format(val: number) {
    const old = this._format;
    let parsedVal = NumberConverter(val);
    if (parsedVal !== Codes.TWELVE_FOUR_HOUR_FORMAT && parsedVal !== Codes.TWENTY_FOUR_HOUR_FORMAT) {
      parsedVal = Codes.TWENTY_FOUR_HOUR_FORMAT;
    }
    this._format = parsedVal;
    if (parsedVal !== old) {
      this.updateValidators();
    }
  }

  get format(): number {
    return this._format;
  }

  set valueType(val: any) {
    this._valueType = this.convertToOHourValueType(val);
  }

  get valueType(): any {
    return this._valueType;
  }

  public convertToOHourValueType(val: any): OHourValueType {
    const result: OHourValueType = 'string';
    const lowerVal = (val || '').toLowerCase();
    if (lowerVal === 'string' || lowerVal === 'timestamp') {
      return lowerVal;
    }
    return result;
  }

  public onChangeEvent(arg: any): void {
    this.onTimepickerChange(arg.target.value);
  }

  public onTimepickerChange(event: string): void {
    let value: any = event;
    if (this.valueType === 'timestamp') {
      value = moment(event, this.formatString).valueOf();
    } else {
      value = this.convertToFormatString(event);
    }
    /** emitModelToViewChange: false  because onChange event is trigger in ngModelChange */
    this.setValue(value, {
      changeType: OValueChangeEvent.USER_CHANGE,
      emitEvent: false,
      emitModelToViewChange: false
    });
  }

  protected modifyPickerMethods(): void {
    if (this.picker) {
      const ngxTimepicker = this.picker.timepickerInput;
      if (ngxTimepicker && ngxTimepicker.onInput) {
        ngxTimepicker.onInput = (value: string) => this.onKeyboardInputDone = true;
      }
    }
  }

  protected updateValeOnInputChange(blurEvent: any): void {
    if (this.onKeyboardInputDone) {
      let value: string = blurEvent.currentTarget.value;
      // ngx-material-timepicker does not allow writing characters on input, so we add 'AM/PM' in order to make validation work properly
      value = this.parseHour(value);
      this.setValue(value);
    }
    this.onKeyboardInputDone = false;
  }

  /**
   * Receives an hour input introduced by the user and returns the hour formated acording current format
   * @param value
   */
  protected parseHour(value: string): string {
    const strArray = value.split(':');
    let hour: any = strArray[0];

    if (Codes.TWELVE_FOUR_HOUR_FORMAT === this.format) {
      if (hour) {
        hour = parseInt(hour);
        const period = hour <= 12 ? ' AM' : ' PM';
        if (hour > 12) {
          hour = hour - 12;
        }
        strArray[0] = hour;
        value = strArray.join(':') + period;
      }
    } else if (Codes.TWELVE_FOUR_HOUR_FORMAT === this.format) {
      // do nothing
    }
    return value;
  }

  protected emitOnValueChange(type, newValue, oldValue): void {
    this.onChange.emit(newValue);
    super.emitOnValueChange(type, newValue, oldValue);
  }

  protected convertToFormatString(value): string {
    if (value === '00:00' || !Util.isDefined(value)) {
      return value;
    }
    const formatStr = this.format === Codes.TWENTY_FOUR_HOUR_FORMAT ? 'HH:mm' : 'hh:mm a';
    let result = value;
    if (typeof value === 'number') {
      result = moment(value).format(formatStr);
    } else {
      result = value ? moment(value, 'h:mm A').format(formatStr) : value;
    }
    return result;
  }

}

@NgModule({
  declarations: [OHourInputComponent],
  imports: [OSharedModule, CommonModule, NgxMaterialTimepickerModule],
  exports: [OHourInputComponent]
})
export class OHourInputModule { }
