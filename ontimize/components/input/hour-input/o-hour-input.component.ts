import { Component, NgModule, Optional, Inject, ElementRef, Injector, forwardRef, ViewChild, EventEmitter, ViewEncapsulation, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { OFormDataComponent, DEFAULT_INPUTS_O_FORM_DATA_COMPONENT } from '../../o-form-data-component.class';
import { CommonModule } from '@angular/common';
import { ValidatorFn } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import moment from 'moment';
import { OSharedModule } from '../../../shared';
import { OValidators } from '../../../validators/o-validators';
import { OFormComponent } from '../../form/form-components';
import { OFormValue } from '../../form/OFormValue';
import { InputConverter } from '../../../decorators/input-converter';

const HourFormat = {
  TWELVE: 'hh:mm a',
  TWENTY_FOUR: 'HH:mm',
};
const TWENTY_FOUR_HOUR_FORMAT = 24;

export const DEFAULT_INPUTS_O_HOUR_INPUT = [
  ...DEFAULT_INPUTS_O_FORM_DATA_COMPONENT,
  'format',
];

export const DEFAULT_OUTPUTS_O_HOUR_INPUT = [
  'onChange',
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

  onChange: EventEmitter<Object> = new EventEmitter<Object>();
  onFocus: EventEmitter<Object> = new EventEmitter<Object>();
  onBlur: EventEmitter<Object> = new EventEmitter<Object>();

  @ViewChild('picker')
  private picker: any;

  @InputConverter()
  format: number = TWENTY_FOUR_HOUR_FORMAT;

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
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  setData(value: any) {
    super.setData(value);
  }


  onOpen(event) {
    this.openPopup = true;
    this.picker.open();
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
    return moment('01/01/1970 ' + this.getValue(), formatMoment).unix();
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

}

@NgModule({
  declarations: [OHourInputComponent],
  imports: [OSharedModule, CommonModule, NgxMaterialTimepickerModule.forRoot()],
  exports: [OHourInputComponent]
})
export class OHourInputModule { }
