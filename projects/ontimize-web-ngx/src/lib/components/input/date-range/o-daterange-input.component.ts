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
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateRange, MatDatepickerInputEvent, MatDateRangeInput, MatDateRangePicker } from '@angular/material/datepicker';
import moment from 'moment';
import { Subscription } from 'rxjs';

import { BooleanInputConverter } from '../../../decorators/input-converter';
import { MomentService } from '../../../services/moment.service';
import { OntimizeMomentDateAdapter } from '../../../shared';
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
    { provide: DateAdapter, useClass: OntimizeMomentDateAdapter, deps: [MAT_DATE_LOCALE] },
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
      const momentD = this.getValueAsMoment(value)
      if (Util.isDefined(momentD)) {
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

  public oformat: string = 'L';

  protected olocale: string;
  private momentSrv: MomentService;
  protected mediaSubscription: Subscription;
  protected onLanguageChangeSubscription: Subscription;

  public placeholderStartDay = 'DATERANGE.PLACEHOLDER_STARTDATE';
  public placeholderEndDay = 'DATERANGE.PLACEHOLDER_ENDDATE';
  constructor(
    elRef: ElementRef,
    injector: Injector,
    protected momentDateAdapter: DateAdapter<OntimizeMomentDateAdapter>,
    protected breakpointObserver: BreakpointObserver
  ) {
    super(elRef, injector);
    this.momentSrv = this.injector.get(MomentService);
    this.range = new FormGroup({
      [this.startKey]: new OFormControl(),
      [this.endKey]: new OFormControl()
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.subscribeToMediaChanges();
    if (!this.olocale) {
      this.olocale = this.momentSrv.getLocale();
    }

    if (this.oformat) {
      (this.momentDateAdapter as any).oFormat = this.oformat;
    }

    this.momentDateAdapter.setLocale(this.olocale);
    this.onLanguageChangeSubscription = this.translateService.onLanguageChanged.subscribe(() => {
      this.momentDateAdapter.setLocale(this.translateService.getCurrentLang());
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
      const endValue = this.getValueAsMoment(control.value[this._endKey]);
      const startValue = this.getValueAsMoment(control.value[this._startKey]);
      if (Util.isDefined(endValue) && Util.isDefined(startValue) && endValue.isSameOrBefore(startValue)) {
        return {
          dateRange: true
        };
      }
    }
    return {};
  }

  protected minDateValidator(control: AbstractControl): ValidationErrors {
    const mindate = moment(this.oMinDate);
    if ((control.value instanceof Object)
      && !this.isObjectDataRangeNull(control)) {
      const startValue = this.getValueAsMoment(control.value[this._startKey]);
      if (Util.isDefined(startValue) && startValue.isBefore(mindate)) {
        return {
          dateRangeMin: {
            dateMin: mindate.format(this.oformat)
          }
        };
      }
    }
    return {};
  }

  protected maxDateValidator(control: AbstractControl): ValidationErrors {
    const maxdate = moment(this.oMaxDate);
    if ((control.value instanceof Object)
      && !this.isObjectDataRangeNull(control)) {
      const endValue = this.getValueAsMoment(control.value[this._endKey]);
      if (Util.isDefined(endValue) && endValue.isAfter(maxdate)) {
        return {
          dateRangeMax: {
            dateMax: maxdate.format(this.oformat)
          }
        };
      }
    }
    return {};
  }

  protected parseDateValidator(control: AbstractControl): ValidationErrors {
    if ((control.value instanceof Object)
      && !this.isObjectDataRangeNull(control)) {
      const endValue = this.getValueAsMoment(control.value[this._endKey]);
      const startValue = this.getValueAsMoment(control.value[this._startKey]);
      if ((!Util.isDefined(endValue) || !endValue.isValid()) || (!Util.isDefined(startValue) || !startValue.isValid())) {
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
      case 'string':
        return typeof val === 'string' && moment(val, this.oformat).isValid()
          ? new Date(moment(val, this.oformat).valueOf())
          : null;

      case 'date':
        return val instanceof Date ? val : null;

      case 'timestamp':
        return typeof val === 'number' ? new Date(val) : null;

      case 'iso-8601':
        if (typeof val === 'string') {
          return moment(val).isValid() ? new Date(moment(val).valueOf()) : null;
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
        [this.startKey]: Util.parseByValueType(dateRangeValue.start, this.valueType, this.oformat),
        [this.endKey]: Util.parseByValueType(dateRangeValue.end, this.valueType, this.oformat)
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
  protected getValueAsMoment(val: any): any {
    if (!Util.isDefined(val)) {
      return val;
    }
    let result;
    switch (true) {
      case this.valueType === 'string' && typeof val === 'string':
        result = moment(val, this.oformat);
        break;
      case this.valueType === 'date' && val instanceof Date:
      case this.valueType === 'timestamp' && typeof val === 'number':
      case this.valueType === 'iso-8601' && typeof val === 'string':
        result = moment(val)
        break;
      case this.valueType === 'iso-8601':
        if (typeof val !== 'string') {
          const acceptTimestamp = typeof val === 'number' && this.getSQLType() === SQLTypes.TIMESTAMP;
          if (acceptTimestamp) {
            result = moment(val)
          }
        }
        break;
      default:
        break;
    }
    return Util.isDefined(result) && result.isValid() ? result : undefined
  }



}
