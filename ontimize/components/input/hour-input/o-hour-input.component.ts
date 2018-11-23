import { Component, NgModule, Optional, Inject, ElementRef, Injector, forwardRef, ViewChild, EventEmitter, ViewEncapsulation, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { OFormDataComponent, DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, OValueChangeEvent } from '../../o-form-data-component.class';
import { CommonModule } from '@angular/common';
import { ValidatorFn } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import moment from 'moment';
import { Util } from '../../../utils';
import { OSharedModule } from '../../../shared';
import { NumberConverter } from '../../../decorators';
import { OFormComponent } from '../../form/form-components';
import { IFormValueOptions } from '../../form/OFormValue';
import { InputConverter } from '../../../decorators/input-converter';
import { OValidators } from '../../../validators/o-validators';

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
  'valueType: value-type',
  ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT
];

export const DEFAULT_OUTPUTS_O_HOUR_INPUT = [
  ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT,
  'onFocus',
  'onBlur'
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

export class OHourInputComponent extends OFormDataComponent implements OnInit, AfterViewInit, OnDestroy {

  public static DEFAULT_INPUTS_O_HOUR_INPUT = DEFAULT_INPUTS_O_HOUR_INPUT;
  public static DEFAULT_OUTPUTS_O_HOUR_INPUT = DEFAULT_OUTPUTS_O_HOUR_INPUT;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(form, elRef, injector);
    this._defaultSQLTypeKey = 'TIMESTAMP';
  }

  onFocus: EventEmitter<Object> = new EventEmitter<Object>();
  onBlur: EventEmitter<Object> = new EventEmitter<Object>();

  @ViewChild('picker')
  private picker: any;
  protected _format: number = TWENTY_FOUR_HOUR_FORMAT;
  @InputConverter()
  textInputEnabled: boolean = true;
  protected _valueType: OHourValueType = 'timestamp';

  private openPopup = false;

  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    const originalPickerOpen = this.picker.open.bind(this.picker);
    const self = this;
    this.picker.open = function (e) {
      if (!self.isReadOnly && !self.isDisabled && self.openPopup) {
        self.openPopup = false;
        originalPickerOpen();
      }
    };
    this.picker.setTime = function () {
      let stringVal = self.convertToFormatString(self.picker.timepickerService.fullTime);
      self.picker.timeSet.next(stringVal);
      // ensuring fControl value
      if (self._fControl) {
        self._fControl.setValue(self.value.value, {
          emitEvent: false,
          emitModelToViewChange: false,
          emitViewToModelChange: true
        });
      }
      self.picker.close();
    };
  }

  get formatString(): string {
    return (this.format === TWENTY_FOUR_HOUR_FORMAT ? HourFormat.TWENTY_FOUR : HourFormat.TWELVE);
  }

  setData(arg: any) {
    super.setData(arg);
  }

  ensureOFormValue(value: any) {
    super.ensureOFormValue(value);
    if (this.valueType === 'timestamp' && typeof this.value.value === 'string') {
      this.value.value = this.defaultValue;
    }
  }

  open(e?: Event) {
    this.openPopup = true;
    if (this.picker) {
      let momentV = moment(this.getValueAsTimeStamp());
      if (this.picker.timepickerService && momentV.isValid()) {
        let hour = momentV.get('hour');
        const minutes = momentV.get('minutes');
        let timePeriod = 'AM';
        if (hour >= 12) {
          timePeriod = 'PM';
        }
        if (hour > 12) {
          hour -= 12;
        }
        if (hour === 0) {
          hour = 12;
        }
        this.picker.changeTimeUnit(0);
        this.picker.timepickerService.hour = {
          time: hour,
          angle: hour * 30
        };
        this.picker.timepickerService.minute = {
          time: minutes === 0 ? '00' : minutes,
          angle: minutes === 0 ? 360 : minutes * 6
        };
        this.picker.timepickerService.period = timePeriod;
      }
      this.picker.open();
    }
  }

  innerOnFocus(event: any) {
    if (!this.isReadOnly && !this.isDisabled) {
      this.onFocus.emit(event);
    }
  }

  innerOnBlur(event: any) {
    if (!this.isReadOnly && !this.isDisabled) {
      this.onBlur.emit(event);
    }
  }

  getValueAsTimeStamp() {
    const value = this.getValue();
    if (typeof value === 'number') {
      return value;
    }
    const formatMoment = 'MM/DD/YYYY ' + this.formatString;
    const momentV = moment('01/01/1970 ' + value, formatMoment);
    return momentV.valueOf();
  }

  getValueAsString() {
    let value = this.getValue();
    value = this.format === TWENTY_FOUR_HOUR_FORMAT ? this.convertToFormatString(value) : value;
    return Util.isDefined(value) ? value.toLowerCase() : null;
  }

  setTimestampValue(value: any, options?: IFormValueOptions) {
    let parsedValue;
    const momentV = Util.isDefined(value) ? moment(value) : value;
    if (momentV && momentV.isValid()) {
      parsedValue = momentV.utcOffset(0).format(this.formatString);
    }
    this.setValue(parsedValue, options);
  }

  resolveValidators(): ValidatorFn[] {
    let validators: ValidatorFn[] = super.resolveValidators();
    if (this.format === TWENTY_FOUR_HOUR_FORMAT) {
      validators.push(OValidators.twentyFourHourFormatValidator);
    } else {
      validators.push(OValidators.twelveHourFormatValidator);
    }
    return validators;
  }

  onClickInput(e: Event): void {
    if (!this.textInputEnabled) {
      this.open(e);
    }
  }

  onTimeEvent(event) {
    const compValue = this.getValue();
    const eventM = moment(event, this.formatString);
    const eventTimestamp = eventM.valueOf() - eventM.startOf('day').valueOf();
    let value = event;
    if (typeof compValue === 'number') {
      const valueM = moment(compValue);
      value = valueM.startOf('day').add(eventTimestamp).valueOf();
    } else {
      value = this.convertToFormatString(event);
    }
    /** emitModelToViewChange: false  because onChange event is trigger in ngModelChange */
    this.setValue(value, { changeType: OValueChangeEvent.USER_CHANGE, emitModelToViewChange: false });
  }

  protected convertToFormatString(value) {
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

  convertToOHourValueType(val: any): OHourValueType {
    let result: OHourValueType = 'string';
    const lowerVal = (val || '').toLowerCase();
    if (lowerVal === 'string' || lowerVal === 'timestamp') {
      return lowerVal;
    }
    return result;
  }

}

@NgModule({
  declarations: [OHourInputComponent],
  imports: [OSharedModule, CommonModule, NgxMaterialTimepickerModule.forRoot()],
  exports: [OHourInputComponent]
})
export class OHourInputModule { }
