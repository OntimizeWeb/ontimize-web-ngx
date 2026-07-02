import { Component, ElementRef, forwardRef, Injector, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { OMatErrorDirective } from '../../../directives/o-mat-error.directive';
import { OTranslatePipe } from '../../../pipes/o-translate.pipe';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerInputEvent } from '@angular/material/datepicker';
import moment from 'moment';
import { Subscription } from 'rxjs';

import { BooleanInputConverter } from '../../../decorators/input-converter';
import { MomentService } from '../../../services/moment.service';
import { OntimizeMomentDateAdapter } from '../../../shared/material/date/ontimize-moment-date-adapter';
import { dateFormatFactory } from '../../../shared/material/date/mat-date-formats.factory';
import { DateCustomClassFunction } from '../../../types/date-custom-class.type';
import { DateFilterFunction } from '../../../types/date-filter-function.type';
import { FormValueOptions } from '../../../types/form-value-options.type';
import { ODateValueType } from '../../../types/o-date-value.type';
import { SQLTypes } from '../../../util/sqltypes';
import { Util } from '../../../util/util';
import { OFormValue } from '../../form/o-form-value';
import { OFormDataComponent } from '../../o-form-data-component.class';
import { OValueChangeEvent } from '../../o-value-change-event.class';
import { OFormControl } from '../o-form-control.class';

export const DEFAULT_INPUTS_O_DATE_INPUT = [
  'valueType: value-type',
  'oformat: format',
  'olocale: locale',
  'oStartView: start-view',
  'oMinDate: min',
  'oMaxDate: max',
  'oTouchUi: touch-ui',
  'oStartAt: start-at',
  'filterDate: filter-date',
  'textInputEnabled: text-input-enabled',
  'dateClass: date-class',
];

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatDatepickerModule, MatTooltipModule, OMatErrorDirective, OTranslatePipe],
  selector: 'o-date-input',
  templateUrl: './o-date-input.component.html',
  inputs: DEFAULT_INPUTS_O_DATE_INPUT,
  encapsulation: ViewEncapsulation.None,
  providers: [
    { provide: DateAdapter, useClass: OntimizeMomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useFactory: dateFormatFactory },
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ODateInputComponent), multi: true }
  ]
})
export class ODateInputComponent extends OFormDataComponent implements OnDestroy, OnInit {

  @BooleanInputConverter()
  public textInputEnabled: boolean = true;
  protected _oformat: string = 'L';
  protected olocale: string;
  protected updateLocaleOnChange: boolean = false;
  protected oStartView: 'month' | 'year' = 'month';
  set oMinDate(value: string) {
    if (value) {
      const momentD = this.getValueAsMoment(value)
      if (Util.isDefined(momentD)) {
        this.datepickerInput.min = momentD.toDate();
        this.minDateString = momentD.format(this.oformat);
      }
    }
  }
  set oMaxDate(value: string) {
    if (value) {
      const momentD = this.getValueAsMoment(value)
      if (Util.isDefined(momentD)) {
        this.datepickerInput.max = momentD.toDate();
        this.maxDateString = momentD.format(this.oformat);
      }
    }
  }
  @BooleanInputConverter()
  protected oTouchUi: boolean;
  protected oStartAt: string;
  protected _filterDate: DateFilterFunction;
  protected _dateClass: DateCustomClassFunction
  protected _valueType: ODateValueType = 'timestamp';

  protected _minDateString: string;
  protected _maxDateString: string;

  protected media: BreakpointObserver;
  protected mediaSubscription: Subscription;
  protected onLanguageChangeSubscription: Subscription;
  protected dateValue: Date | undefined;

  @ViewChild('picker', { static: true })
  public datepicker: MatDatepicker<Date>;

  @ViewChild(MatDatepickerInput, { static: true })
  public datepickerInput: MatDatepickerInput<Date>;

  @ViewChild('matInputRef', { read: ElementRef, static: true })
  private matInputRef!: ElementRef;

  private momentSrv: MomentService;
  private momentDateAdapter: DateAdapter<MomentDateAdapter>;

  constructor(
    dateAdapter: DateAdapter<OntimizeMomentDateAdapter>,
    elRef: ElementRef,
    injector: Injector
  ) {
    super(elRef, injector);
    this.momentDateAdapter = dateAdapter;
    this._defaultSQLTypeKey = 'DATE';
    this.momentSrv = this.injector.get(MomentService);
    this.media = this.injector.get(BreakpointObserver);
  }

  public ngOnInit(): void {
    this.initialize();

    if (!this.olocale) {
      this.updateLocaleOnChange = true;
      this.olocale = this.momentSrv.getLocale();
    }

    if (this.oformat) {
      (this.momentDateAdapter as any).oFormat = this.oformat;
    }

    this.momentDateAdapter.setLocale(this.olocale);

    if (this.oStartView) {
      this.datepicker.startView = this.oStartView;
    }

    if (this.oStartAt) {
      this.datepicker.startAt = new Date(this.oStartAt);
    }

    if (this.updateLocaleOnChange) {
      this.onLanguageChangeSubscription = this.translateService.onLanguageChanged.subscribe(() => {
        this.momentDateAdapter.setLocale(this.translateService.getCurrentLang());
        this.setValue(this.getValue());
      });
    }

    this.subscribeToMediaChanges();
  }

  public subscribeToMediaChanges(): void {
    this.mediaSubscription = this.media
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .subscribe(result => {
        const isMobile = result.breakpoints[Breakpoints.XSmall] || result.breakpoints[Breakpoints.Small];
        this.touchUi = Util.isDefined(this.oTouchUi) ? this.oTouchUi : !!isMobile;
      });
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

  public getValueAsDate(): any {
    return this.dateValue;
  }

  public getValue(): any {
    const value = super.getValue();
    if (!Util.isDefined(value)) {
      return value;
    }
    // While typing, the internal control holds a moment; from external data it holds a value in the
    // configured value-type. Normalize both to a moment and return undefined when it is not a valid date.
    const m = moment.isMoment(value) ? value : this.getValueAsMoment(value);
    if (!Util.isDefined(m) || !m.isValid()) {
      return void 0;
    }
    return Util.parseByValueType(m.valueOf(), this.valueType, this.oformat);
  }

  get showClearButton(): boolean {
    return this.clearButton && !this.isReadOnly && this.enabled && this.matInputRef.nativeElement.value;
  }

  public open(): void {
    if (!this.isReadOnly && this.enabled) {
      this.datepicker.open();
    }
  }

  public clearValue(options?: FormValueOptions, setDirty: boolean = false): void {
    super.clearValue(options, setDirty);
    this.dateValue = void 0;
  }

  public onChangeEvent(event: MatDatepickerInputEvent<any>): void {
    const isValid = event.value && event.value.isValid && event.value.isValid();
    let val = isValid ? event.value.valueOf() : event.value;
    const parsedVal = Util.parseByValueType(val, this.valueType, this.oformat);
    this.setValue(parsedVal, {
      changeType: OValueChangeEvent.USER_CHANGE,
      emitEvent: false,
      emitModelToViewChange: false
    });
  }

  public onClickInput(e: Event): void {
    if (!this.textInputEnabled) {
      this.open();
    }
  }

  get filterDate(): DateFilterFunction {
    return this._filterDate;
  }

  set filterDate(val: DateFilterFunction) {
    this._filterDate = val;
  }

  get dateClass(): DateCustomClassFunction {
    return this._dateClass;
  }

  set dateClass(val: DateCustomClassFunction) {
    this._dateClass = val;
  }
  get oformat(): string {
    return this._oformat;
  }

  set oformat(val: string) {
    this._oformat = val;
  }

  get minDateString(): string {
    return this._minDateString;
  }

  set minDateString(val: string) {
    this._minDateString = val;
  }

  get maxDateString(): string {
    return this._maxDateString;
  }

  set maxDateString(val: string) {
    this._maxDateString = val;
  }

  get touchUi(): boolean {
    return this.oTouchUi || false;
  }

  set touchUi(val: boolean) {
    this.oTouchUi = val;
    this.datepicker.touchUi = this.touchUi;
  }

  protected ensureODateValueType(val: any): void {
    if (!Util.isDefined(val)) {
      this.dateValue = void 0;
      return val;
    }
    let result = val;
    switch (this.valueType) {
      case 'string':
        if (typeof val === 'string') {
          const m = moment(val, this.oformat);
          if (m.isValid()) {
            this.dateValue = new Date(m.valueOf());
          }
        } else {
          result = undefined;
        }
        break;
      case 'date':
        if ((val instanceof Date)) {
          this.dateValue = val;
        } else {
          result = undefined;
        }
        break;
      case 'timestamp':
        if (typeof val === 'number') {
          this.dateValue = new Date(val);
        } else {
          result = undefined;
        }
        break;
      case 'iso-8601':
        if (typeof val !== 'string') {
          const acceptTimestamp = typeof val === 'number' && this.getSQLType() === SQLTypes.TIMESTAMP;
          if (acceptTimestamp) {
            this.dateValue = new Date(val);
          } else {
            result = undefined;
          }
        } else {
          const m = moment(val);
          if (m.isValid()) {
            this.dateValue = new Date(m.valueOf());
          } else {
            result = undefined;
          }
        }
        break;
      default:
        break;
    }
    if (!Util.isDefined(result)) {
      console.warn(`ODateInputComponent value (${val}) is not consistent with value-type (${this.valueType})`);
    }
    return result;
  }

  protected setFormValue(val: any, options?: FormValueOptions, setDirty: boolean = false): void {
    let value = val;
    if (val instanceof OFormValue) {
      value = val.value;
    }
    this.ensureODateValueType(value);
    super.setFormValue(value, options, setDirty);
  }

  set valueType(val: any) {
    this._valueType = Util.convertToODateValueType(val);
  }

  get valueType(): any {
    return this._valueType;
  }

  public createFormControl(cfg, validators): OFormControl {
    this._fControl = super.createFormControl(cfg, validators);
    if (!this.isEmpty() && (!this.form || !this.form.isInInsertMode())) {
      this._fControl.markAsTouched();
    }
    return this._fControl;
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
