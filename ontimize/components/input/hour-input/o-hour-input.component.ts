import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, forwardRef, Inject, Injector, NgModule, OnInit, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import moment from 'moment';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { NumberConverter } from '../../../decorators';
import { InputConverter } from '../../../decorators/input-converter';
import { OSharedModule } from '../../../shared';
import { Util } from '../../../utils';
import { OValidators, TWELVE_HOUR_FORMAT_PATTERN, TWENTY_FOUR_HOUR_FORMAT_PATTERN } from '../../../validators/o-validators';
import { OFormComponent } from '../../form/form-components';
import { IFormValueOptions } from '../../form/OFormValue';
import {
  DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
  DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT,
  OFormDataComponent,
  OValueChangeEvent
} from '../../o-form-data-component.class';

const HourFormat = {
  TWELVE: 'hh:mm a',
  TWENTY_FOUR: 'HH:mm a',
};

const TWENTY_FOUR_HOUR_FORMAT = 24;
const TWELVE_FOUR_HOUR_FORMAT = 12;

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
  protected _format: number = TWENTY_FOUR_HOUR_FORMAT;
  protected onKeyboardInputDone = false;
  protected _valueType: OHourValueType = 'timestamp';
  private openPopup = false;

  @ViewChild('picker')
  private picker: any;

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

  protected modifyPickerMethods(): void {
    if (this.picker) {
      const self = this;
      if (this.picker.open) {
        const originalPickerOpen = this.picker.open.bind(this.picker);
        this.picker.open = (e) => {
          if (!self.isReadOnly && self.enabled && self.openPopup) {
            self.openPopup = false;
            originalPickerOpen();
          }
        };
      }
      const ngxTimepicker = this.picker.timepickerInput;
      if (ngxTimepicker && ngxTimepicker.onInput) {
        ngxTimepicker.onInput = (value: string) => {
          self.onKeyboardInputDone = true;
          // ngxTimepicker.value = value;
          // ngxTimepicker.onChange(value);
        };
      }
    }
  }

  public onKeyDown(e: KeyboardEvent): void {
    if (!this.isInputAllowed(e)) {
      e.preventDefault();
    }
  }

  protected isInputAllowed(e: KeyboardEvent): boolean {
    // Allow: backspace, delete, tab, escape, enter
    if ([46, 8, 9, 27, 13].some(n => n === e.keyCode) ||
      (e.key === ':') ||
      // Allow: Ctrl/cmd+A
      (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: Ctrl/cmd+C
      (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: Ctrl/cmd+X
      (e.keyCode === 88 && (e.ctrlKey === true || e.metaKey === true)) ||
      // Allow: home, end, left, right, up, down
      (e.keyCode >= 35 && e.keyCode <= 40)) {
      return true;
    }
    return !((e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105));
  }

  public innerOnBlur(event: any): void {
    if (this.onKeyboardInputDone) {
      this.updateValeOnInputChange(event);
    }
    super.innerOnBlur(event);
  }

  protected updateValeOnInputChange(blurEvent: any): void {
    const ngxTimepicker = this.picker.timepickerInput;
    if (ngxTimepicker && this.onKeyboardInputDone) {
      const pattern = (this.format === TWENTY_FOUR_HOUR_FORMAT)
        ? TWENTY_FOUR_HOUR_FORMAT_PATTERN
        : TWELVE_HOUR_FORMAT_PATTERN;
      const regExp = new RegExp(pattern);
      const value = blurEvent.currentTarget.value;
      if (!regExp.test(value)) {
        this.clearValue();
      } else if (this.valueType === 'string') {
        this.setValue(value);
      } else if (this.valueType === 'timestamp') {
        const m = moment(value, this.formatString);
        if (m.isValid()) {
          this.setValue(m.valueOf());
        }
      }
    }
    this.onKeyboardInputDone = false;
  }

  protected emitOnValueChange(type, newValue, oldValue): void {
    this.onChange.emit(newValue);
    super.emitOnValueChange(type, newValue, oldValue);
  }

  public registerOnFormControlChange(): void {
    // This component does not need this subscription
  }

  get formatString(): string {
    return (this.format === TWENTY_FOUR_HOUR_FORMAT ? HourFormat.TWENTY_FOUR : HourFormat.TWELVE);
  }

  public setData(arg: any): void {
    super.setData(arg);
  }

  public ensureOFormValue(value: any): void {
    super.ensureOFormValue(value);
    if (this.valueType === 'timestamp' && typeof this.value.value === 'string') {
      this.value.value = this.defaultValue;
    }
  }

  public open(e?: Event): void {
    this.openPopup = true;
    if (this.picker) {
      this.picker.open();
    }
  }

  public getValueAsTimeStamp(): any {
    const value = this.getValue();
    if (typeof value === 'number') {
      return value;
    }
    const formatMoment = 'MM/DD/YYYY ' + this.formatString;
    const momentV = moment('01/01/1970 ' + value, formatMoment);
    return momentV.valueOf();
  }

  public getValueAsString(): string {
    let value = this.getValue();
    value = this.convertToFormatString(value);
    return Util.isDefined(value) ? value.toLowerCase() : null;
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
    let validators: ValidatorFn[] = super.resolveValidators();
    if (this.format === TWENTY_FOUR_HOUR_FORMAT) {
      validators.push(OValidators.twentyFourHourFormatValidator);
    } else {
      validators.push(OValidators.twelveHourFormatValidator);
    }
    return validators;
  }

  public onClickInput(e: Event): void {
    if (!this.textInputEnabled) {
      this.open(e);
    }
  }

  public onFormControlChange(value: any): void {
    if (this.oldValue === value) {
      return;
    }
    super.onFormControlChange(value);
  }

  public onTimeEvent(event): void {
    const compValue = this.getValue();
    const eventM = moment(event, this.formatString);
    const eventTimestamp = eventM.valueOf() - eventM.startOf('day').valueOf();
    let value = event;
    if (this.valueType === 'timestamp') {
      const valueM = moment(compValue);
      value = valueM.startOf('day').add(eventTimestamp).valueOf();
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

  protected convertToFormatString(value): string {
    if (value === '00:00' || !Util.isDefined(value)) {
      return value;
    }
    const formatStr = this.format === TWENTY_FOUR_HOUR_FORMAT ? 'HH:mm' : 'hh:mm a';
    let result = value;
    if (typeof value === 'number') {
      result = moment(value).format(formatStr);
    } else {
      result = value ? moment(value, 'h:mm A').format(formatStr) : value;
    }
    return result;
  }

  set format(val: number) {
    const old = this._format;
    let parsedVal = NumberConverter(val);
    if (parsedVal !== TWELVE_FOUR_HOUR_FORMAT && parsedVal !== TWENTY_FOUR_HOUR_FORMAT) {
      parsedVal = TWENTY_FOUR_HOUR_FORMAT;
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
    let result: OHourValueType = 'string';
    const lowerVal = (val || '').toLowerCase();
    if (lowerVal === 'string' || lowerVal === 'timestamp') {
      return lowerVal;
    }
    return result;
  }

  public onTimepickerClosed(): void {
    this.onTimeEvent(this.picker.timepickerService.getFullTime(this.picker.format));
  }

}

@NgModule({
  declarations: [OHourInputComponent],
  imports: [OSharedModule, CommonModule, NgxMaterialTimepickerModule],
  exports: [OHourInputComponent]
})
export class OHourInputModule { }
