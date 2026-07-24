import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, ElementRef, forwardRef, Injector, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { OTranslatePipe } from '../../../pipes/o-translate.pipe';
import { OMatErrorDirective } from '../../../directives/o-mat-error.directive';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { DateRange, MatDatepickerInputEvent, MatDateRangeInput, MatDateRangePicker } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';

import { BooleanInputConverter } from '../../../decorators/input-converter';
import { LuxonService } from '../../../services/luxon.service';
import { O_DATE_ADAPTER_PROVIDERS, parseDateByValueTypeWithAdapter } from '../../../shared';
import { FormValueOptions } from '../../../types/form-value-options.type';
import { ODateValueType } from '../../../types/o-date-value.type';
import { SQLTypes } from '../../../util/sqltypes';
import { Util } from '../../../util/util';
import { OFormValue } from '../../form/o-form-value';
import { DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, OFormDataComponent } from '../../o-form-data-component.class';
import { OValueChangeEvent } from '../../o-value-change-event.class';
import { DEFAULT_INPUTS_O_DATE_INPUT } from '../date-input/o-date-input.component';
import { OFormControl } from '../o-form-control.class';
import { DateCustomClassFunction } from '../../../types/date-custom-class.type';

export const DEFAULT_OUTPUTS_O_DATERANGE_INPUT = [
  ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT
];

export const DEFAULT_INPUTS_O_DATERANGE_INPUT = [
  'separator',
  'olocale:locale',
  'startKey',
  'endKey',
  'valueType: value-type',
  'mode',
  'placeholderStartDay: placeholder-startday',
  'placeholderEndDay: placeholder-endday',
  ...DEFAULT_INPUTS_O_DATE_INPUT
];

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatTooltipModule, OTranslatePipe, OMatErrorDirective],
  selector: 'o-daterange-input',
  templateUrl: './o-daterange-input.component.html',
  outputs: DEFAULT_OUTPUTS_O_DATERANGE_INPUT,
  inputs: DEFAULT_INPUTS_O_DATERANGE_INPUT,
  providers: [
    ...O_DATE_ADAPTER_PROVIDERS,
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ODateRangeInputComponent), multi: true }
  ]
})
export class ODateRangeInputComponent extends OFormDataComponent implements OnDestroy, OnInit {

  @ViewChild('picker', { static: true })
  picker!: MatDateRangePicker<Date>;

  @BooleanInputConverter()
  public textInputEnabled: boolean = true;

  @BooleanInputConverter()
  public oTouchUi: boolean = false;

  @ViewChild('dateRangeInput')
  dateRangeInput: MatDateRangeInput<Date>;

  public mode: 'mobile' | 'desktop' | 'auto' = 'auto';

  startDateValue: Date;
  endDateValue: Date;

  range: FormGroup<{ [x: string]: OFormControl; }>

  protected _dateClass: DateCustomClassFunction
  get dateClass(): DateCustomClassFunction {
    return this._dateClass;
  }

  set dateClass(val: DateCustomClassFunction) {
    this._dateClass = val;
  }

  protected _oMinDate: Date;
  set oMinDate(value: any) {
    if (value) {
      const date = this.getValueAsDateObject(value)
      if (Util.isDefined(date)) {
        this._oMinDate = this.convertToDate(value);
      }
    }
  }
  get oMinDate() {
    return this._oMinDate;
  }

  protected _oMaxDate: Date;
  set oMaxDate(value: any) {
    if (value) {
      this._oMaxDate = this.convertToDate(value);
    }
  }
  get oMaxDate() {
    return this._oMaxDate;
  }

  protected _startKey: string = 'startDate';
  get startKey() {
    return this._startKey;
  }
  set startKey(value) {
    this._startKey = value;
  }

  protected _endKey: string = 'endDate';
  get endKey() {
    return this._endKey;
  }
  set endKey(value) {
    this._endKey = value;
  }

  protected _valueType: ODateValueType = 'timestamp';

  public separator = ' - ';

  get showClearButton(): boolean {
    return this.clearButton && !this.isReadOnly && this.enabled && this.getValue();
  }

  get touchUi(): boolean {
    return this.oTouchUi || false;
  }

  set touchUi(val: boolean) {
    this.oTouchUi = val;
  }

  isMobileMode(): boolean {
    return this.mode === 'mobile' || (this.mode === 'auto' && this.breakpointObserver.isMatched(Breakpoints.Handset))
  }

  isDesktopMode(): boolean {
    return this.mode === 'desktop' || (this.mode === 'auto' && !this.breakpointObserver.isMatched(Breakpoints.Handset))
  }

  public oformat: string;

  protected olocale: string;
  private luxonSrv: LuxonService;
  protected mediaSubscription: Subscription;
  protected onLanguageChangeSubscription: Subscription;

  public placeholderStartDay = 'DATERANGE.PLACEHOLDER_STARTDATE';
  public placeholderEndDay = 'DATERANGE.PLACEHOLDER_ENDDATE';
  constructor(
    elRef: ElementRef,
    injector: Injector,
    protected dateAdapter: DateAdapter<any>,
    protected breakpointObserver: BreakpointObserver
  ) {
    super(elRef, injector);
    this.luxonSrv = this.injector.get(LuxonService);
    // Default format follows the active date engine ('D' for Luxon, 'L' for moment)
    const dateFormats: MatDateFormats | null = this.injector.get(MAT_DATE_FORMATS, null);
    this.oformat = dateFormats?.display?.dateInput ?? 'D';
    this.range = new FormGroup({
      [this.startKey]: new OFormControl(),
      [this.endKey]: new OFormControl()
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.subscribeToMediaChanges();
    if (!this.olocale) {
      this.olocale = this.luxonSrv.getLocale();
    }

    if (this.oformat) {
      (this.dateAdapter as any).oFormat = this.oformat;
    }

    this.dateAdapter.setLocale(this.olocale);
    this.onLanguageChangeSubscription = this.translateService.onLanguageChanged.subscribe(() => {
      this.dateAdapter.setLocale(this.translateService.getCurrentLang());
      this.setValue(this.getValue());
    });

  }

  public subscribeToMediaChanges(): void {
    this.mediaSubscription = this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .subscribe(result => {
        const isMobile = result.breakpoints[Breakpoints.XSmall] || result.breakpoints[Breakpoints.Small];
        this.touchUi = Util.isDefined(this.oTouchUi) ? this.oTouchUi : isMobile;
      });
  }

  public open(): void {
    if (!this.isReadOnly && this.enabled) {
      this.picker.open();
    }
  }

  resolveValidators(): ValidatorFn[] {
    const validators: ValidatorFn[] = super.resolveValidators();

    validators.push(this.rangeDateValidator.bind(this));
    if (Util.isDefined(this.oMinDate)) {
      validators.push(this.minDateValidator.bind(this));
    }
    if (Util.isDefined(this.oMaxDate)) {
      validators.push(this.maxDateValidator.bind(this));
    }

    validators.push(this.parseDateValidator.bind(this));
    return validators;
  }

  isObjectDataRangeNull(objectValue): boolean {
    return objectValue !== null && objectValue.value !== null &&
      !Util.isDefined(objectValue.value[this.startKey]) &&
      !Util.isDefined(objectValue.value[this.endKey]);
  }


  protected rangeDateValidator(control: AbstractControl): ValidationErrors {

    if (control.value instanceof Object && !this.isObjectDataRangeNull(control)) {
      const endValue = this.getValueAsDateObject(control.value[this._endKey]);
      const startValue = this.getValueAsDateObject(control.value[this._startKey]);
      if (Util.isDefined(endValue) && Util.isDefined(startValue) && endValue.valueOf() <= startValue.valueOf()) {
        return {
          dateRange: true
        };
      }
    }
    return {};
  }

  protected minDateValidator(control: AbstractControl): ValidationErrors {
    const mindate = this.dateAdapter.deserialize(this.oMinDate);
    if ((control.value instanceof Object)
      && !this.isObjectDataRangeNull(control)) {
      const startValue = this.getValueAsDateObject(control.value[this._startKey]);
      if (Util.isDefined(startValue) && startValue.valueOf() < mindate.valueOf()) {
        return {
          dateRangeMin: {
            dateMin: this.dateAdapter.format(mindate, this.oformat)
          }
        };
      }
    }
    return {};
  }

  protected maxDateValidator(control: AbstractControl): ValidationErrors {
    const maxdate = this.dateAdapter.deserialize(this.oMaxDate);
    if ((control.value instanceof Object)
      && !this.isObjectDataRangeNull(control)) {
      const endValue = this.getValueAsDateObject(control.value[this._endKey]);
      if (Util.isDefined(endValue) && endValue.valueOf() > maxdate.valueOf()) {
        return {
          dateRangeMax: {
            dateMax: this.dateAdapter.format(maxdate, this.oformat)
          }
        };
      }
    }
    return {};
  }

  protected parseDateValidator(control: AbstractControl): ValidationErrors {
    if ((control.value instanceof Object)
      && !this.isObjectDataRangeNull(control)) {
      const endValue = this.getValueAsDateObject(control.value[this._endKey]);
      const startValue = this.getValueAsDateObject(control.value[this._startKey]);
      // getValueAsDateObject already returns undefined for unparseable values
      if (!Util.isDefined(endValue) || !Util.isDefined(startValue)) {
        return {
          dateRangeParse: {
            format: this.oformat + this.separator + this.oformat
          }
        };
      }
    }
    return {};
  }

  set valueType(val: any) {
    this._valueType = Util.convertToODateValueType(val);
  }

  get valueType(): any {
    return this._valueType;
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.mediaSubscription) {
      this.mediaSubscription.unsubscribe();
    }
    if (this.onLanguageChangeSubscription) {
      this.onLanguageChangeSubscription.unsubscribe();
    }
  }

  protected setFormValue(val: any, options?: FormValueOptions, setDirty: boolean = false): void {
    let value = val;
    if (val instanceof OFormValue) {
      value = val.value;
    }

    this.range.setValue(this.ensureODateValueType(value), options);
    super.setFormValue(value, options, setDirty);
  }


  protected ensureODateValueType(val: any) {
    if (!Util.isDefined(val)) {
      return { [this.startKey]: null, [this.endKey]: null };
    }

    let result = val;
    const startVal = this.convertToDate(val[this.startKey]);
    const endVal = this.convertToDate(val[this.endKey]);

    if (!Util.isDefined(result)) {
      console.warn(`ODateRangeInputComponent value (${val}) is not consistent with value-type (${this.valueType})`);
    } else {
      result = { [this.startKey]: startVal, [this.endKey]: endVal };

    }
    return result;
  }

  protected convertToDate(val: any): Date | null {
    if (!Util.isDefined(val)) return null;

    switch (this.valueType) {
      case 'string': {
        if (typeof val !== 'string') {
          return null;
        }
        const date = this.dateAdapter.parse(val, this.oformat);
        return Util.isDefined(date) && this.dateAdapter.isValid(date) ? new Date(date.valueOf()) : null;
      }

      case 'date':
        return val instanceof Date ? val : null;

      case 'timestamp':
        return typeof val === 'number' ? new Date(val) : null;

      case 'iso-8601':
        if (typeof val === 'string') {
          const date = this.dateAdapter.deserialize(val);
          return Util.isDefined(date) && this.dateAdapter.isValid(date) ? new Date(date.valueOf()) : null;
        } else if (typeof val === 'number' && this.getSQLType() === SQLTypes.TIMESTAMP) {
          return new Date(val);
        }
        return null;

      default:
        return null;
    }
  }

  public onChangeEvent(event: MatDatepickerInputEvent<Date>): void {
    const dateRangeValue: DateRange<Date> = this.dateRangeInput.value;

    if (dateRangeValue.start && dateRangeValue.end) {
      let value = {
        [this.startKey]: parseDateByValueTypeWithAdapter(this.dateAdapter, dateRangeValue.start.valueOf(), this.valueType, this.oformat),
        [this.endKey]: parseDateByValueTypeWithAdapter(this.dateAdapter, dateRangeValue.end.valueOf(), this.valueType, this.oformat)
      };
      this.setValue(value, {
        changeType: OValueChangeEvent.USER_CHANGE,
        emitEvent: false,
        emitModelToViewChange: false
      });
    }

  }

  public onClickInput(e: Event): void {
    if (!this.textInputEnabled) {
      this.open();
    }
  }

  public onClickClearValue(event: Event): void {
    super.onClickClearValue(event);
    this.range.setValue({ [this.startKey]: null, [this.endKey]: null });
    this.markFormGroupTouched();
  }

  protected markFormGroupTouched() {
    Object.keys(this.range.controls).forEach((key) => {
      const control = this.range.get(key);
      control?.markAsTouched();
    });
  }
  /** Normalizes a value in the configured value-type to the active adapter's date object. */
  protected getValueAsDateObject(val: any): any {
    if (!Util.isDefined(val)) {
      return val;
    }
    let result: any;
    switch (true) {
      case this.valueType === 'string' && typeof val === 'string':
        result = this.dateAdapter.parse(val, this.oformat);
        break;
      case this.valueType === 'date' && val instanceof Date:
        result = this.dateAdapter.deserialize(val);
        break;
      case this.valueType === 'timestamp' && typeof val === 'number':
        result = this.dateAdapter.deserialize(new Date(val));
        break;
      case this.valueType === 'iso-8601' && typeof val === 'string':
        result = this.dateAdapter.deserialize(val);
        break;
      case this.valueType === 'iso-8601':
        if (typeof val !== 'string') {
          const acceptTimestamp = typeof val === 'number' && this.getSQLType() === SQLTypes.TIMESTAMP;
          if (acceptTimestamp) {
            result = this.dateAdapter.deserialize(new Date(val));
          }
        }
        break;
      default:
        break;
    }
    return Util.isDefined(result) && this.dateAdapter.isValid(result) ? result : undefined
  }



}
