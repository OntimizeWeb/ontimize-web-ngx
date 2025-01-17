import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, ElementRef, forwardRef, Inject, Injector, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormGroup, UntypedFormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateRange, MatDatepickerInputEvent, MatDateRangeInput, MatDateRangePicker, MatEndDate, MatStartDate } from '@angular/material/datepicker';
import moment from 'moment';
import { Subscription } from 'rxjs';

import { BooleanInputConverter } from '../../../decorators/input-converter';
import { MomentService } from '../../../services/moment.service';
import { OTranslateService } from '../../../services/translate/o-translate.service';
import { OntimizeMomentDateAdapter } from '../../../shared';
import { FormValueOptions } from '../../../types/form-value-options.type';
import { ODateValueType } from '../../../types/o-date-value.type';
import { SQLTypes } from '../../../util/sqltypes';
import { Util } from '../../../util/util';
import { OFormValue } from '../../form/o-form-value';
import { OFormComponent } from '../../form/o-form.component';
import { DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT, OFormDataComponent } from '../../o-form-data-component.class';
import { OValueChangeEvent } from '../../o-value-change-event.class';
import { DEFAULT_INPUTS_O_DATE_INPUT } from '../date-input/o-date-input.component';
import { OFormControl } from '../o-form-control.class';

export const DEFAULT_OUTPUTS_O_DATERANGE_LEGACY_INPUT = [
  ...DEFAULT_OUTPUTS_O_FORM_DATA_COMPONENT
];

export const DEFAULT_INPUTS_O_DATERANGE_LEGACY_INPUT = [
  'separator',
  'showWeekNumbers:show-week-numbers',
  'showRanges:show-ranges',
  'olocale:locale',
  'startKey',
  'endKey',
  'valueType: value-type',
  'mode',
  ...DEFAULT_INPUTS_O_DATE_INPUT
];

@Component({
  selector: 'o-daterange-input',
  templateUrl: './o-daterange-input.component.html',
  outputs: DEFAULT_OUTPUTS_O_DATERANGE_LEGACY_INPUT,
  inputs: DEFAULT_INPUTS_O_DATERANGE_LEGACY_INPUT,
  providers: [
    { provide: DateAdapter, useClass: OntimizeMomentDateAdapter, deps: [MAT_DATE_LOCALE] }
  ]
})
export class ODateRangeInputComponent extends OFormDataComponent implements OnDestroy, OnInit, AfterViewInit {

  @ViewChild('picker', { static: true })
  picker!: MatDateRangePicker<Date>;


  @BooleanInputConverter()
  public textInputEnabled: boolean = true;

  @BooleanInputConverter()
  public showWeekNumbers: boolean = false;

  @BooleanInputConverter()
  public oTouchUi: boolean = false;

  @BooleanInputConverter()
  public showRanges: boolean = false;

  @ViewChild('startDate')
  startDateInput: MatStartDate<Date>;

  @ViewChild('endDate')
  endDateInput: MatEndDate<Date>;

  @ViewChild('dateRangeInput')
  dateRangeInput: MatDateRangeInput<Date>;

  protected _oMinDate: moment.Moment;

  public mode: 'mobile' | 'desktop' | 'auto' = 'auto';
  startDateValue: Date;
  endDateValue: Date;

  range: FormGroup<{ [x: string]: OFormControl; }>
  public oMinDate;
  public oMaxDate;

  // set oMinDate(value: string) {
  //   if (value) {
  //     const momentD = this.getValueAsMoment(value)
  //     if (Util.isDefined(momentD)) {
  //       this.datepickerInput.min = momentD.toDate();
  //       this.minDateString = momentD.format(this.oformat);
  //     }
  //   }
  // }
  // set oMaxDate(value: string) {
  //   if (value) {
  //     const momentD = this.getValueAsMoment(value)
  //     if (Util.isDefined(momentD)) {
  //       this.datepickerInput.max = momentD.toDate();
  //       this.maxDateString = momentD.format(this.oformat);
  //     }
  //   }
  // }

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
  protected _localeOptions: any;
  protected olocale: string;

  private momentSrv: MomentService;
  private oTranslate: OTranslateService;
  protected media: MediaObserver;
  protected mediaSubscription: Subscription;
  protected onLanguageChangeSubscription: Subscription;
  protected dateValue: DateRange<Date>;

  constructor(
    @Optional() @Inject(forwardRef(() => OFormComponent)) form: OFormComponent,
    elRef: ElementRef,
    injector: Injector,
    protected momentDateAdapter: DateAdapter<OntimizeMomentDateAdapter>,
    protected breakpointObserver: BreakpointObserver
  ) {
    super(form, elRef, injector);
    this.oTranslate = this.injector.get(OTranslateService);
    this.momentSrv = this.injector.get(MomentService);
    this.media = this.injector.get(MediaObserver);
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
    this.mediaSubscription = this.media.asObservable().subscribe((change: MediaChange[]) => {
      if (['xs', 'sm'].indexOf(change[0].mqAlias) !== -1) {
        this.touchUi = Util.isDefined(this.oTouchUi) ? this.oTouchUi : true;
      }
      if (['md', 'lg', 'xl'].indexOf(change[0].mqAlias) !== -1) {
        this.touchUi = Util.isDefined(this.oTouchUi) ? this.oTouchUi : false;
      }
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


  protected rangeDateValidator(control: UntypedFormControl): ValidationErrors {

    if (control.value instanceof Object && !this.isObjectDataRangeNull(control)) {
      const endValue = this.getValueAsMoment(control.value[this._endKey]);
      const startValue = this.getValueAsMoment(control.value[this._startKey]);
      if (endValue.isSameOrBefore(startValue)) {
        return {
          dateRange: true
        };
      }
    }
    return {};
  }

  protected minDateValidator(control: UntypedFormControl): ValidationErrors {
    const mindate = moment(this.oMinDate);
    if ((control.value instanceof Object)
      && !this.isObjectDataRangeNull(control)) {
      const startValue = this.getValueAsMoment(control.value[this._startKey]);
      if (startValue.isBefore(mindate)) {
        return {
          dateRangeMin: {
            dateMin: mindate.format(this.oformat)
          }
        };
      }
    }
    return {};
  }

  protected maxDateValidator(control: UntypedFormControl): ValidationErrors {
    const maxdate = moment(this.oMaxDate);
    if ((control.value instanceof Object)
      && !this.isObjectDataRangeNull(control)) {
      const endValue = this.getValueAsMoment(control.value[this._endKey]);
      if (endValue.isAfter(maxdate)) {
        return {
          dateRangeMax: {
            dateMax: maxdate.format(this.oformat)
          }
        };
      }
    }
    return {};
  }

  protected parseDateValidator(control: UntypedFormControl): ValidationErrors {
    if ((control.value instanceof Object)
      && !this.isObjectDataRangeNull(control)) {
      const endValue = this.getValueAsMoment(control.value[this._endKey]);
      const startValue = this.getValueAsMoment(control.value[this._startKey]);
      if (!endValue.isValid() || !startValue.isValid()) {
        return {
          dateRangeParse: {
            format: this.oformat + this._localeOptions.separator + this.oformat
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
    this.ensureODateValueType(value);
    console.log('setFormvalue ', value);
    super.setFormValue(value, options, setDirty);
  }


  protected ensureODateValueType(val: any): void {
    if (!Util.isDefined(val)) {
      return val;
    }
    let result = val;
    const startVal = val[this.startKey];
    const endVal = val[this.endKey];
    switch (this.valueType) {
      case 'string':

        if (typeof startVal === 'string' && typeof endVal === 'string') {
          const mstartVal = moment(startVal, this.oformat);
          const mendVal = moment(endVal, this.oformat);
          this.dateValue = mstartVal.isValid() && mendVal.isValid() ? new DateRange(new Date(mstartVal.valueOf()), new Date(mendVal.valueOf())) : undefined;
        } else {
          result = undefined;
        }
        break;
      case 'date':
        if ((startVal instanceof Date && endVal instanceof Date)) {
          this.dateValue = new DateRange(startVal, endVal);
        } else {
          result = undefined;
        }
        break;
      case 'timestamp':
        if (typeof startVal === 'number' && typeof endVal === 'number') {
          this.dateValue = new DateRange(new Date(startVal), new Date(endVal));
        } else {
          result = undefined;
        }
        break;
      case 'iso-8601':
        if (typeof startVal !== 'string' && typeof endVal !== 'string') {
          const acceptTimestamp = typeof startVal === 'number' && typeof endVal === 'number' && this.getSQLType() === SQLTypes.TIMESTAMP;
          if (acceptTimestamp) {
            this.dateValue = new DateRange(new Date(startVal), new Date(endVal));
          } else {
            result = undefined;
          }
        } else {
          const mstartVal = moment(startVal, this.oformat);
          const mendVal = moment(endVal, this.oformat);
          if (mstartVal.isValid() && mendVal.isValid()) {
            this.dateValue = new DateRange(new Date(mstartVal.valueOf()), new Date(mendVal.valueOf()));
          } else {
            result = undefined;
          }
        }
        break;
      default:
        break;
    }
    if (!Util.isDefined(result)) {
      console.warn(`ODateRangeInputComponent value (${val}) is not consistent with value-type (${this.valueType})`);

    } else {
      const value = { [this.startKey]: this.dateValue.start, [this.endKey]: this.dateValue.end };
      this.range.setValue(value);
    }


  }

  public onChangeEvent(event: MatDatepickerInputEvent<Date>): void {
    console.log(event, event.target, event.value, this.dateRangeInput.value);
    const dateRangeValue: DateRange<Date> = this.dateRangeInput.value;
    // const startDateValue = moment(dateRangeValue.start.valueOf());
    // const endDateValue = new Date(dateRangeValue.start.valueOf());

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
    this.range.setValue({ [this.startKey]: void 0, [this.endKey]: void 0 });
    this.dateValue = void 0;
  }

  public getValueAsDate(): any {
    return this.dateValue;
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
