import { Component, NgModule, Optional, Inject, ElementRef, Injector, forwardRef, ViewChild, EventEmitter, ViewEncapsulation, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { OFormDataComponent, DEFAULT_INPUTS_O_FORM_DATA_COMPONENT, DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT } from '../../o-form-data-component.class';
import { CommonModule } from '@angular/common';
import { ValidatorFn } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import moment from 'moment';
import { Util } from '../../../utils';
import { OSharedModule } from '../../../shared';
import { OValidators } from '../../../validators/o-validators';
import { OFormComponent } from '../../form/form-components';
import { OFormValue, IFormValueOptions } from '../../form/OFormValue';
import { InputConverter } from '../../../decorators/input-converter';

const HourFormat = {
  TWELVE: 'hh:mm a',
  TWENTY_FOUR: 'HH:mm a',
};

const TWENTY_FOUR_HOUR_FORMAT = 24;

export const DEFAULT_INPUTS_O_HOUR_INPUT = [
  ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
  'format',
  'textInputEnabled: text-input-enabled'
];

export const DEFAULT_OUTPUTS_O_HOUR_INPUT = [
  ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT,
  'onFocus',
  'onBlur'
];

@Component({
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
  }

  onFocus: EventEmitter<Object> = new EventEmitter<Object>();
  onBlur: EventEmitter<Object> = new EventEmitter<Object>();

  @ViewChild('picker')
  private picker: any;

  @InputConverter()
  format: number = TWENTY_FOUR_HOUR_FORMAT;
  @InputConverter()
  textInputEnabled: boolean = true;

  formatString = HourFormat.TWENTY_FOUR;

  private openPopup = false;

  ngOnInit() {
    super.ngOnInit();
    this.formatString = (this.format === TWENTY_FOUR_HOUR_FORMAT ? HourFormat.TWENTY_FOUR : HourFormat.TWELVE);
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
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  setData(value: any) {
    super.setData(value);
  }

  open(e?: Event) {
    this.openPopup = true;
    if (this.picker) {
      let momentV = moment(this.getValueAsTimeStamp());
      if (this.picker.timepickerService && momentV.isValid()) {
        momentV = momentV.utcOffset(0);
        let hour = momentV.get('hour');
        const minutes = momentV.get('minutes');
        let timePeriod = 'AM';
        if (hour === 0) {
          hour = 12;
        } else if (hour > 12) {
          timePeriod = 'PM';
          hour -= 12;
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

  innerOnChange(event: any) {
    if (!this.value) {
      this.value = new OFormValue();
    }
    this.ensureOFormValue(event);
    this.onChange.emit(event);
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
    const formatMoment = 'MM/DD/YYYY ' + this.formatString;
    const momentV = moment('01/01/1970 ' + this.getValue(), formatMoment);
    return momentV.add(1, 'hour').valueOf();
  }

  getValueAsString() {
    const value = this.getValue();
    return Util.isDefined(value) ? value.toUpperCase() : null;
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
      validators.push(OValidators.twentyHourFormatValidator);
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

}

@NgModule({
  declarations: [OHourInputComponent],
  imports: [OSharedModule, CommonModule, NgxMaterialTimepickerModule.forRoot()],
  exports: [OHourInputComponent]
})
export class OHourInputModule { }
